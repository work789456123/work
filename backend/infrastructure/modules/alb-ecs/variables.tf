variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "backend_health_check_path" {
  type    = string
  default = "/"
}

variable "frontend_health_check_path" {
  type    = string
  default = "/"
}

variable "common_tags" {
  type = map(string)
}

# Use enable_https (known at plan time) for listener counts — do not branch on certificate_arn alone
# when it may be unknown until ACM validation (e.g. auto-created certificate).
variable "enable_https" {
  description = "When true, ALB serves HTTPS on 443 and redirects HTTP to HTTPS. When false, HTTP only on port 80."
  type        = bool
  default     = false
}

# ACM certificate must be in the SAME region as the ALB (e.g. ap-south-1 for Mumbai).
# A certificate in us-east-1 is for CloudFront only, not for a regional ALB.
variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS (443). Required when enable_https is true (may be known only after apply)."
  type        = string
  default     = ""
}

variable "ssl_policy" {
  description = "TLS policy for HTTPS listener."
  type        = string
  default     = "ELBSecurityPolicy-TLS13-1-2-2021-06"
}
