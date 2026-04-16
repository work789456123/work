output "app_url" {
  value = "http://${module.route53.fqdn}"
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "media_bucket_name" {
  value = module.s3_media.bucket_name
}
