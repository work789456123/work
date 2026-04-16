variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "app_security_group_id" {
  type = string
}

variable "target_group_arn" {
  type = string
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
  type = string
}

variable "nextjs_image" {
  type = string
}

variable "aws_region" {
  type = string
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
