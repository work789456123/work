# Pashuvaani Terraform Infrastructure

This directory now contains a modular Terraform layout for enterprise-style deployments with separate environment roots:

- `environments/dev`
- `environments/prod`
- `modules/*` reusable building blocks

## Architecture included

- VPC with public and private subnets across 2 AZs
- Internet/NAT routing
- ALB in public subnets
- EC2 Auto Scaling Group in private subnets
- Dockerized `backend` + `nextjs` services with `nginx` reverse proxy on each instance
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

3. Initialize and apply:

```bash
terraform init
terraform plan
terraform apply
```

Repeat the same flow in `environments/prod`.

## Important production notes

- Configure remote state backend (`S3 + DynamoDB locking`) in each environment before production rollout.
- Add HTTPS listener and ACM certificate for ALB (currently HTTP listener is configured).
- Restrict `ssh_ingress_cidrs` to office/VPN only (or disable SSH and use SSM Session Manager).
- Keep container images in private ECR and pin immutable tags.

## Legacy files

Existing top-level Terraform files (`ec2.tf`, `frontend_infra.tf`, etc.) are left intact for compatibility and migration; use `environments/*` for all new deployments.
