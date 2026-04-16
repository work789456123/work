variable "domain_name" {
  description = "Root hosted zone domain, e.g. example.com."
  type        = string
}

variable "record_name" {
  description = "Record name under hosted zone, e.g. app.example.com."
  type        = string
}

variable "alb_dns_name" {
  type = string
}

variable "alb_zone_id" {
  type = string
}
