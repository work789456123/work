terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "network" {
  source = "../../modules/network"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  common_tags          = local.common_tags
}

module "security" {
  source = "../../modules/security"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.network.vpc_id
  app_port          = var.app_port
  additional_app_ports = [3000]
  ssh_ingress_cidrs = var.ssh_ingress_cidrs
  common_tags       = local.common_tags
}

module "alb" {
  source = "../../modules/alb-ecs"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  backend_port          = var.app_port
  frontend_port         = var.frontend_port
  backend_health_check_path  = var.alb_health_check_path
  frontend_health_check_path = "/"
  enable_https          = var.enable_alb_https
  certificate_arn       = local.alb_certificate_arn
  common_tags           = local.common_tags
}

module "s3_media" {
  source = "../../modules/s3-media"

  project_name  = var.project_name
  environment   = var.environment
  force_destroy = false
  common_tags   = local.common_tags
}

module "compute" {
  source = "../../modules/ecs-ec2"

  project_name          = var.project_name
  environment           = var.environment
  aws_region            = var.aws_region
  private_subnet_ids    = module.network.private_subnet_ids
  app_security_group_id = module.security.app_security_group_id
  backend_target_group_arn  = module.alb.backend_target_group_arn
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  instance_type         = var.instance_type
  root_volume_size      = var.root_volume_size
  desired_capacity      = var.desired_capacity
  min_size              = var.min_size
  max_size              = var.max_size
  backend_image         = var.backend_image
  frontend_image        = var.frontend_image
  backend_environment   = var.backend_environment
  media_bucket_arn      = module.s3_media.bucket_arn
  media_bucket_name     = module.s3_media.bucket_name
  backend_container_port  = var.app_port
  frontend_container_port = var.frontend_port
  common_tags            = local.common_tags
}

module "route53" {
  source = "../../modules/route53"

  domain_name  = var.domain_name
  record_name  = var.record_name
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
}
