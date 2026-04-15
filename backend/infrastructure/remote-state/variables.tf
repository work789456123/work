variable "aws_region" {
  description = "AWS Region"
  default     = "ap-south-1"
}

variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
  sensitive   = true
}

variable "bucket_name" {
  description = "Name for the S3 state bucket"
  type        = string
  default     = "pashuvaani-terraform-state-bucket"
}
