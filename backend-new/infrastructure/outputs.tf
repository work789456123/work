output "ec2_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.postgres.endpoint
}

output "private_key" {
  description = "The private key for SSH access"
  value       = tls_private_key.main.private_key_pem
  sensitive   = true
}

output "main_frontend_url" {
  description = "The URL of the main frontend"
  value       = "https://${aws_cloudfront_distribution.main_frontend.domain_name}"
}

output "admin_frontend_url" {
  description = "The URL of the admin frontend"
  value       = "https://${aws_cloudfront_distribution.admin_frontend.domain_name}"
}
