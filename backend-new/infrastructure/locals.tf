locals {
  project_name = "pashuvaani"
  environment  = "dev"
  owner        = "hridesh"

  common_tags = {
    Project     = local.project_name
    Environment = local.environment
    Owner       = local.owner
    ManagedBy   = "terraform"
  }
}
