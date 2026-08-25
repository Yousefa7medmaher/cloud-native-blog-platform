variable "bucket_name" {
  description = "Name of the frontend S3 bucket."
  type        = string
}

variable "environment" {
  description = "Environment name used in tags and naming."
  type        = string
}

variable "enable_versioning" {
  description = "Whether to enable versioning on the bucket."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to add to the frontend S3 bucket."
  type        = map(string)
  default     = {}
}
