# --- FRONTEND S3 BUCKETS ---

resource "aws_s3_bucket" "main_frontend" {
  bucket = "${local.project_name}-main-frontend-v2-${local.environment}"
  tags   = local.common_tags
}

resource "aws_s3_bucket" "admin_frontend" {
  bucket = "${local.project_name}-admin-frontend-v2-${local.environment}"
  tags   = local.common_tags
}

# --- S3 BUCKET POLICIES (Allow CloudFront OAC) ---

resource "aws_s3_bucket_policy" "main_frontend" {
  bucket = aws_s3_bucket.main_frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.main_frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main_frontend.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "admin_frontend" {
  bucket = aws_s3_bucket.admin_frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.admin_frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin_frontend.arn
          }
        }
      }
    ]
  })
}

# --- CLOUDFRONT ORIGIN ACCESS CONTROL ---

resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "${local.project_name}-oac"
  description                       = "Origin Access Control for PashuVaani Frontends"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# --- CLOUDFRONT DISTRIBUTIONS ---

# 1. Main Frontend Distribution
resource "aws_cloudfront_distribution" "main_frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # S3 Origin (Frontend files)
  origin {
    domain_name              = aws_s3_bucket.main_frontend.bucket_regional_domain_name
    origin_id                = "S3-MainFrontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
  }

  # EC2 Origin (Backend API)
  origin {
    domain_name = aws_instance.app_server.public_dns
    origin_id   = "EC2-Backend"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # Change to "https-only" if you add SSL to EC2
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default Behavior (Serve from S3)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-MainFrontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # API Behavior (Route /api to EC2)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "EC2-Backend"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Authorization", "Content-Type", "Origin", "X-Device-ID"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0 # Disable caching for API
  }

  # Root API Behavior (Route exact /api to EC2)
  ordered_cache_behavior {
      path_pattern     = "/api"
      allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = "EC2-Backend"
  
      forwarded_values {
        query_string = true
        cookies {
          forward = "all"
        }
        headers = ["Authorization", "Content-Type", "Origin", "X-Device-ID"]
      }
  
      viewer_protocol_policy = "redirect-to-https"
      min_ttl                = 0
      default_ttl            = 0
      max_ttl                = 0 
    }

  # SPA Routing (Redirect 404/403 to index.html)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags
}

# 2. Admin Frontend Distribution
resource "aws_cloudfront_distribution" "admin_frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # S3 Origin (Admin Frontend files)
  origin {
    domain_name              = aws_s3_bucket.admin_frontend.bucket_regional_domain_name
    origin_id                = "S3-AdminFrontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
  }

  # EC2 Origin (Backend API)
  origin {
    domain_name = aws_instance.app_server.public_dns
    origin_id   = "EC2-Backend"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default Behavior (Serve from S3)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-AdminFrontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # API Behavior (Route /api to EC2)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "EC2-Backend"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Authorization", "Content-Type", "Origin", "X-Device-ID"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  # Root API Behavior (Route exact /api to EC2)
  ordered_cache_behavior {
      path_pattern     = "/api"
      allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = "EC2-Backend"
  
      forwarded_values {
        query_string = true
        cookies {
          forward = "all"
        }
        headers = ["Authorization", "Content-Type", "Origin", "X-Device-ID"]
      }
  
      viewer_protocol_policy = "redirect-to-https"
      min_ttl                = 0
      default_ttl            = 0
      max_ttl                = 0 
    }

  # SPA Routing (Redirect 404/403 to index.html)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags
}
