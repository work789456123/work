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
  default = "t3.medium"
}

variable "desired_capacity" {
  type    = number
  default = 2
}

variable "min_size" {
  type    = number
  default = 2
}

variable "max_size" {
  type    = number
  default = 4
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
