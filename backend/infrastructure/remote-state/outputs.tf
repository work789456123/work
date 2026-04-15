output "state_bucket_name" {
  description = "Name of the S3 bucket to store Terraform state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table for state locking"
  value       = aws_dynamodb_table.terraform_state_lock.name
}

output "how_to_use" {
  description = "Instructions to configure the backend"
  value       = <<EOF
Add the following backend configuration to your main infrastructure/provider.tf block:

backend "s3" {
  bucket         = "${aws_s3_bucket.terraform_state.bucket}"
  key            = "backend/terraform.tfstate"
  region         = "ap-south-1"
  dynamodb_table = "${aws_dynamodb_table.terraform_state_lock.name}"
  encrypt        = true
}

Then run `terraform init` in your main infrastructure folder!
EOF
}
