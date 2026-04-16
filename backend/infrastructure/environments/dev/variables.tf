variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {
  type    = string
  default = "pashuvaani"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.1.0/24", "10.20.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.11.0/24", "10.20.12.0/24"]
}

variable "app_port" {
  type    = number
  default = 80
}

variable "alb_health_check_path" {
  type    = string
  default = "/"
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
  type    = number
  default = 1
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

variable "nextjs_image" {
  description = "Container image URI for Next.js service."
  type        = string
}

variable "domain_name" {
  description = "Route53 hosted zone root domain."
  type        = string
}

variable "record_name" {
  description = "App DNS record, e.g. app.example.com."
  type        = string
}
