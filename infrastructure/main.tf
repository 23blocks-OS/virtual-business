terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure this based on your setup
    # bucket = "your-terraform-state-bucket"
    # key    = "virtual-office/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "virtual-ai-office"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Networking Module
module "networking" {
  source = "./modules/networking"

  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

# S3 + CloudFront for Frontend
module "frontend" {
  source = "./modules/s3-cloudfront"

  environment   = var.environment
  domain_name   = var.domain_name
  certificate_arn = var.certificate_arn
}

# ECS for Backend
module "backend" {
  source = "./modules/ecs"

  environment         = var.environment
  vpc_id              = module.networking.vpc_id
  private_subnet_ids  = module.networking.private_subnet_ids
  public_subnet_ids   = module.networking.public_subnet_ids
  anthropic_api_key   = var.anthropic_api_key
  frontend_url        = module.frontend.cloudfront_url
}
