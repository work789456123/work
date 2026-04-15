terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # S3 remote state management
  backend "s3" {
    bucket         = "pashuvaani-terraform-state-bucket-f4bbc7da"
    key            = "backend/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "pashuvaani-terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
