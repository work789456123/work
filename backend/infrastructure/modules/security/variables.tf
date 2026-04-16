variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "app_port" {
  type    = number
  default = 80
}

variable "ssh_ingress_cidrs" {
  description = "CIDRs allowed to SSH to application instances."
  type        = list(string)
  default     = []
}

variable "common_tags" {
  type = map(string)
}
