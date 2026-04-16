variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "force_destroy" {
  description = "Allow bucket force destroy (true in dev, false in prod)."
  type        = bool
  default     = false
}

variable "common_tags" {
  type = map(string)
}
