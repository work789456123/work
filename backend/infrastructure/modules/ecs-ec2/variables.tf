variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "app_security_group_id" {
  type = string
}

variable "backend_target_group_arn" {
  type = string
}

variable "frontend_target_group_arn" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.small"
}

variable "root_volume_size" {
  type    = number
  default = 20
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
  type = string
}

variable "frontend_image" {
  type = string
}

variable "backend_container_port" {
  type    = number
  default = 80
}

variable "backend_environment" {
  description = "Environment variables passed to backend container."
  type        = map(string)
  default     = {}
}

variable "frontend_container_port" {
  type    = number
  default = 3000
}

variable "media_bucket_arn" {
  type = string
}

variable "media_bucket_name" {
  type = string
}

variable "common_tags" {
  type = map(string)
}
