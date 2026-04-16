# Pashuvaani Terraform Infrastructure

This directory now contains a modular Terraform layout for enterprise-style deployments with separate environment roots:

- `environments/dev`
- `environments/prod`
- `modules/*` reusable building blocks

## Architecture included

- VPC with public and private subnets across 2 AZs
- Internet/NAT routing
- ALB in public subnets
- Dev: EC2 Auto Scaling Group in private subnets with Dockerized app stack
- Prod: ECS cluster on EC2 capacity (Auto Scaling)
- Prod routing: `/api` to backend service, `/` to frontend service
- Route53 alias record pointing to ALB
- S3 media bucket (private, encrypted, versioned)
- IAM profile for EC2 with scoped access to the media bucket

## Directory layout

```text
infrastructure/
  environments/
    dev/
    prod/
  modules/
    network/
    security/
    alb/
    compute/
    route53/
    s3-media/
```

## Usage

1. Move into environment folder:

```bash
cd backend/infrastructure/environments/dev
```

2. Copy and edit variables:

```bash
cp terraform.tfvars.example terraform.tfvars
```

3. Authenticate AWS profile:

```bash
export AWS_PROFILE=pvaani
```

4. Initialize backend and apply:

```bash
terraform init -reconfigure
terraform plan
terraform apply
```

Repeat the same flow in `environments/prod`.

## Important production notes

- Remote state is configured via `backend.tf` in each environment and uses:
  - S3 bucket: `pashuvaani-terraform-state-bucket-f4bbc7da`
  - DynamoDB lock table: `pashuvaani-terraform-state-lock`
- Add HTTPS listener and ACM certificate for ALB (currently HTTP listener is configured).
- Restrict `ssh_ingress_cidrs` to office/VPN only (or disable SSH and use SSM Session Manager).
- Keep container images in private ECR and pin immutable tags.
- Prod ECS EC2 uses `t3.small`; set root volume to at least `30GB` for the current ECS-optimized AMI snapshot.

## Legacy files

Legacy top-level Terraform files are now moved to `old-terraform/` for archive and migration reference. Use only `environments/*` and `modules/*` for active deployments.
