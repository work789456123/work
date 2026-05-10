variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "aws_profile" {
  type        = string
  default     = "pvaani"
  description = "AWS CLI profile passed to the Terraform AWS provider. Set to empty string to use the default credential chain instead."
}

variable "project_name" {
  type    = string
  default = "pashuvaani"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "vpc_cidr" {
  type    = string
  default = "10.30.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.30.1.0/24", "10.30.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.30.11.0/24", "10.30.12.0/24"]
}

variable "app_port" {
  type    = number
  default = 80
}

variable "frontend_port" {
  type    = number
  default = 3000
}

variable "alb_health_check_path" {
  type    = string
  default = "/health/db"
}

variable "ssh_ingress_cidrs" {
  type    = list(string)
  default = []
}

variable "instance_type" {
  type    = string
  default = "t3.small"
}

variable "desired_capacity" {
  type        = number
  default     = 1
  description = "ECS EC2 capacity. Increase if tasks fail to place (Qdrant + backend + frontend on awsvpc can exhaust ENIs on small instances)."
}

variable "min_size" {
  type    = number
  default = 1
}

variable "max_size" {
  type    = number
  default = 2
}

variable "backend_image" {
  description = "Container image URI for backend service."
  type        = string
}

variable "frontend_image" {
  description = "Container image URI for frontend service."
  type        = string
}

variable "backend_environment" {
  description = "Backend container environment variables."
  type        = map(string)
  default     = {}
}

variable "root_volume_size" {
  description = "Root EBS size in GB for ECS EC2 instances."
  type        = number
  default     = 20
}

variable "domain_name" {
  description = "Route53 hosted zone root domain."
  type        = string
}

variable "record_name" {
  description = "App DNS record, e.g. app.example.com."
  type        = string
}

variable "acm_certificate_arn" {
  description = "Optional. ACM certificate ARN in ap-south-1 for HTTPS on the ALB. Leave empty to create & validate a new certificate via Route53."
  type        = string
  default     = ""
}

variable "enable_alb_https" {
  description = "When true, ALB uses HTTPS (443) and redirects HTTP. Set false for HTTP-only (no ACM resources)."
  type        = bool
  default     = true
}
