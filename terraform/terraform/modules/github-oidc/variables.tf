variable "role_prefix" {
  description = "Prefix used for GitHub OIDC IAM role names."
  type        = string
}

variable "github_subject_filters" {
  description = "Subject filters for GitHub Actions OIDC tokens."
  type        = list(string)
  default     = ["repo:*/*:ref:refs/heads/*"]
}

variable "enable_frontend_deployer" {
  description = "Whether to create the frontend deployer IAM role."
  type        = bool
  default     = true
}

variable "enable_backend_deployer" {
  description = "Whether to create the backend deployer IAM role."
  type        = bool
  default     = true
}

variable "frontend_s3_bucket_arn" {
  description = "ARN of the frontend S3 bucket used by GitHub Actions."
  type        = string
  default     = ""
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution used by GitHub Actions."
  type        = string
  default     = ""
}

variable "secrets_prefix" {
  description = "Secrets Manager resource path prefix for backend deployer access."
  type        = string
  default     = ""
}

variable "ssm_parameter_prefix" {
  description = "SSM parameter path prefix for backend deployer access."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags applied to IAM resources."
  type        = map(string)
  default     = {}
}
