# TLS for the ALB must use an ACM certificate in the SAME region as the load balancer (ap-south-1).
# Certificates in us-east-1 are for CloudFront / global services only, not regional ALBs.

data "aws_route53_zone" "root" {
  name         = var.domain_name
  private_zone = false
}

# Omit acm_certificate_arn in terraform.tfvars to create & validate a new cert in ap-south-1.
# Or set acm_certificate_arn to an existing ap-south-1 ARN to skip creation.
resource "aws_acm_certificate" "alb" {
  count = var.enable_alb_https && var.acm_certificate_arn == "" ? 1 : 0

  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

resource "aws_route53_record" "cert_validation" {
  for_each = var.enable_alb_https && var.acm_certificate_arn == "" ? {
    for dvo in aws_acm_certificate.alb[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.root.zone_id
}

resource "aws_acm_certificate_validation" "alb" {
  count = var.enable_alb_https && var.acm_certificate_arn == "" ? 1 : 0

  certificate_arn         = aws_acm_certificate.alb[0].arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

locals {
  alb_certificate_arn = !var.enable_alb_https ? "" : (
    var.acm_certificate_arn != "" ? var.acm_certificate_arn : aws_acm_certificate_validation.alb[0].certificate_arn
  )
}
