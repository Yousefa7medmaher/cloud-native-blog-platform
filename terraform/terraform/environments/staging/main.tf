terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.tags,
      {
        Environment = var.environment
        Project     = var.project
        ManagedBy   = "terraform"
      }
    )
  }
}

locals {
  name_prefix = "${var.project}-${var.environment}"
}

module "vpc" {
  source = "../../modules/vpc"

  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  enable_dns_support   = var.enable_dns_support
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_nat_gateway   = var.enable_nat_gateway
}

module "alb_sg" {
  source = "../../modules/security-group"

  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = [
    {
      description = "HTTP"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      description = "HTTPS"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

module "ec2_sg" {
  source = "../../modules/security-group"

  name        = "${local.name_prefix}-ec2-sg"
  description = "Security group for EC2 instances"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = concat(
    [
      {
        description     = "HTTP from ALB"
        from_port       = 80
        to_port         = 80
        protocol        = "tcp"
        security_groups = [module.alb_sg.security_group_id]
      }
    ],
    var.ssh_cidr_blocks != null ? [
      {
        description = "SSH"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = var.ssh_cidr_blocks
      }
    ] : []
  )
}

module "s3" {
  source = "../../modules/s3"

  bucket_name       = var.s3_bucket_name
  environment       = var.environment
  enable_versioning = var.s3_enable_versioning
}

module "frontend_s3" {
  source = "../../modules/frontend-s3"

  bucket_name       = var.frontend_s3_bucket_name
  environment       = var.environment
  enable_versioning = var.s3_enable_versioning
  tags              = var.tags
}

module "cloudfront" {
  source          = "../../modules/cloudfront"

  name            = "${local.name_prefix}-frontend-cf"
  bucket_name     = module.frontend_s3.bucket_id
  bucket_arn      = module.frontend_s3.bucket_arn
  certificate_arn = var.cloudfront_certificate_arn
  aliases         = var.cloudfront_aliases
  tags            = var.tags
}

module "github_oidc" {
  source                         = "../../modules/github-oidc"
  role_prefix                    = local.name_prefix
  github_subject_filters         = var.github_subject_filters
  enable_frontend_deployer       = true
  enable_backend_deployer        = true
  frontend_s3_bucket_arn         = module.frontend_s3.bucket_arn
  cloudfront_distribution_arn    = module.cloudfront.distribution_arn
  tags                           = var.tags
}

module "documentdb" {
  source              = "../../modules/documentdb"

  name                = "${local.name_prefix}-documentdb"
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_ids  = [module.ec2_sg.security_group_id]
  instance_class      = var.db_instance_class
  instance_count      = var.db_instance_count
  db_name             = var.db_name
  master_username     = var.db_master_username
  engine_version      = var.db_engine_version
  tags                = var.tags
}

module "iam" {
  source = "../../modules/iam"

  role_name                  = "${local.name_prefix}-ec2-role"
  s3_bucket_arn              = module.s3.bucket_arn
  secrets_manager_secret_arn = module.documentdb.secret_arn
}

module "alb" {
  source = "../../modules/load-balancer"

  name                      = "${local.name_prefix}-alb"
  internal                  = false
  vpc_id                    = module.vpc.vpc_id
  subnet_ids                = module.vpc.public_subnet_ids
  security_group_ids        = [module.alb_sg.security_group_id]
  listener_port             = var.listener_port
  listener_protocol         = var.listener_protocol
  certificate_arn           = var.certificate_arn
  enable_http_redirect      = var.enable_http_redirect
  target_group_port         = var.target_group_port
  target_group_protocol     = var.target_group_protocol
  health_check_path         = var.health_check_path
  enable_deletion_protection = var.enable_deletion_protection
  enable_access_logs        = var.enable_access_logs
  access_logs_bucket        = var.access_logs_bucket
}

module "route53" {
  source = "../../modules/route53"

  zone_name               = var.route53_zone_name
  create_zone             = var.route53_create_zone
  existing_zone_id        = var.route53_existing_zone_id
  frontend_record_name    = var.frontend_record_name
  frontend_alias_target   = module.cloudfront.distribution_domain_name
  frontend_alias_zone_id  = "Z2FDTNDATAQYW2"
  backend_record_name     = var.backend_record_name
  backend_alias_target    = module.alb.alb_dns_name
  backend_alias_zone_id   = module.alb.alb_zone_id
  tags                    = var.tags
}

module "compute" {
  source = "../../modules/compute"

  name                        = "${local.name_prefix}-asg"
  instance_type               = var.instance_type
  ami_id                      = var.ami_id
  key_name                    = var.key_name
  subnet_ids                  = module.vpc.private_subnet_ids
  security_group_ids          = [module.ec2_sg.security_group_id]
  iam_instance_profile_name   = module.iam.instance_profile_name
  user_data                   = var.ec2_user_data
  target_group_arns           = [module.alb.target_group_arn]
  min_size                    = var.ec2_min_size
  max_size                    = var.ec2_max_size
  desired_capacity            = var.ec2_desired_capacity
  associate_public_ip_address = var.ec2_associate_public_ip_address
  health_check_type           = var.ec2_health_check_type
  health_check_grace_period   = var.ec2_health_check_grace_period
}
