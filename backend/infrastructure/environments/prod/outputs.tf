output "app_url" {
  value = "http://${module.route53.fqdn}"
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "media_bucket_name" {
  value = module.s3_media.bucket_name
}

output "ecs_app_security_group_id" {
  description = "Allow this SG on RDS security group inbound TCP 5432 when DB is in the same VPC."
  value       = module.security.app_security_group_id
}

output "alb_certificate_arn" {
  description = "ACM certificate ARN used for HTTPS on the ALB (ap-south-1)."
  value       = local.alb_certificate_arn
}
