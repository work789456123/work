variable "project_name" {
  description = "Project identifier used in naming."
  type        = string
}

variable "environment" {
  description = "Environment name (dev/prod)."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDRs for public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDRs for private app subnets."
  type        = list(string)
}

variable "common_tags" {
  description = "Tags applied to all resources."
  type        = map(string)
}
