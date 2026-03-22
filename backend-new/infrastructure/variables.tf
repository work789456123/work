# --- AWS PROVIDER ---
variable "aws_region" {
  description = "AWS Region to deploy to"
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

# --- ACCESS CONTROL ---
variable "my_ip" {
  description = "Your local public IP address for secure SSH/RDS access (e.g. 1.2.3.4/32)"
  type        = string
  default     = "106.205.192.152/32" # Currently using your IP
}

# --- DATABASE ---
variable "db_username" {
  description = "Database master user"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

# --- APP SERVER ---
variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.small"
}

