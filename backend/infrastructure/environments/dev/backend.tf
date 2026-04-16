terraform {
  backend "s3" {
    bucket         = "pashuvaani-terraform-state-bucket-f4bbc7da"
    key            = "infrastructure/dev/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "pashuvaani-terraform-state-lock"
    encrypt        = true
  }
}
