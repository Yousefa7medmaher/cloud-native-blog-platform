variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "joo-blog"
}

variable "environment" {
  type = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging, or prod."
  }
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "private_subnet_cidrs" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}

variable "enable_dns_support" {
  type    = bool
  default = true
}

variable "enable_dns_hostnames" {
  type    = bool
  default = true
}

variable "enable_nat_gateway" {
  type    = bool
  default = true
}

variable "ssh_cidr_blocks" {
  type    = list(string)
  default = null
}

variable "s3_bucket_name" {
  type = string
}

variable "s3_enable_versioning" {
  type    = bool
  default = true
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ami_id" {
  type    = string
  default = null
}

variable "key_name" {
  type    = string
  default = null
}

variable "ec2_user_data" {
  type    = string
  default = null
}

variable "ec2_min_size" {
  type    = number
  default = 2
}

variable "ec2_max_size" {
  type    = number
  default = 2
}

variable "ec2_desired_capacity" {
  type    = number
  default = 2
}

variable "ec2_associate_public_ip_address" {
  type    = bool
  default = false
}

variable "ec2_health_check_type" {
  type    = string
  default = "ELB"
}

variable "ec2_health_check_grace_period" {
  type    = number
  default = 60
}

variable "certificate_arn" {
  type = string
}

variable "listener_port" {
  type    = number
  default = 443
}

variable "listener_protocol" {
  type    = string
  default = "HTTPS"
}

variable "enable_http_redirect" {
  type    = bool
  default = true
}

variable "target_group_port" {
  type    = number
  default = 80
}

variable "target_group_protocol" {
  type    = string
  default = "HTTP"
}

variable "health_check_path" {
  type    = string
  default = "/"
}

variable "enable_deletion_protection" {
  type    = bool
  default = false
}

variable "enable_access_logs" {
  type    = bool
  default = false
}

variable "access_logs_bucket" {
  type    = string
  default = ""
}

variable "frontend_s3_bucket_name" {
  description = "Name of the frontend static assets bucket."
  type        = string
  default     = ""
}

variable "cloudfront_certificate_arn" {
  description = "ACM certificate ARN for CloudFront distribution aliases."
  type        = string
  default     = ""
}

variable "cloudfront_aliases" {
  description = "Alternate domain names for CloudFront distribution."
  type        = list(string)
  default     = []
}

variable "route53_zone_name" {
  description = "Route 53 hosted zone name."
  type        = string
  default     = ""
}

variable "route53_create_zone" {
  description = "Whether to create a Route 53 hosted zone."
  type        = bool
  default     = false
}

variable "route53_existing_zone_id" {
  description = "Existing Route 53 hosted zone ID."
  type        = string
  default     = ""
}

variable "frontend_record_name" {
  description = "Frontend DNS record name (e.g. www)."
  type        = string
  default     = ""
}

variable "backend_record_name" {
  description = "Backend DNS record name (e.g. api)."
  type        = string
  default     = ""
}

variable "github_subject_filters" {
  description = "GitHub Actions subject filters for OIDC."
  type        = list(string)
  default     = ["repo:*/*:ref:refs/heads/*"]
}

variable "db_name" {
  description = "Database name for DocumentDB."
  type        = string
  default     = "jooblog"
}

variable "db_master_username" {
  description = "Master username for DocumentDB."
  type        = string
  default     = "jooblogadmin"
}

variable "db_engine_version" {
  description = "DocumentDB engine version."
  type        = string
  default     = "4.0.0"
}

variable "db_instance_class" {
  description = "DocumentDB instance class."
  type        = string
  default     = "db.t4g.small"
}

variable "db_instance_count" {
  description = "Number of DocumentDB instances."
  type        = number
  default     = 1
}
