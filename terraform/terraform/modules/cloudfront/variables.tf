variable "name" {
  description = "Name prefix for CloudFront resources."
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name used as CloudFront origin."
  type        = string
}

variable "bucket_arn" {
  description = "ARN of the frontend S3 bucket."
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for CloudFront aliases."
  type        = string
  default     = ""
}

variable "aliases" {
  description = "List of domain names for the CloudFront distribution."
  type        = list(string)
  default     = []

  validation {
    condition     = length(var.aliases) == 0 || var.certificate_arn != ""
    error_message = "certificate_arn must be provided when aliases are configured."
  }
}

variable "default_root_object" {
  description = "Default root object for the CloudFront distribution."
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Tags to apply to CloudFront resources."
  type        = map(string)
  default     = {}
}
