variable "role_name" {
  type = string
}

variable "s3_bucket_arn" {
  type = string
}

variable "secrets_manager_secret_arn" {
  description = "ARN of a Secrets Manager secret that EC2 instances need to access."
  type        = string
  default     = ""
}

variable "ssm_parameter_prefix" {
  description = "SSM parameter path prefix for EC2 access."
  type        = string
  default     = ""
}

variable "tags" {
  type    = map(string)
  default = {}
}
