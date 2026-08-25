variable "name" {
  description = "Name prefix for the load balancer resources."
  type        = string
}

variable "internal" {
  description = "Whether the ALB is internal or internet-facing."
  type        = bool
  default     = false
}

variable "vpc_id" {
  description = "VPC ID for the target group."
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs where the ALB will be deployed."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs attached to the ALB."
  type        = list(string)
}

variable "listener_port" {
  description = "Port for the listener."
  type        = number
  default     = 443
}

variable "listener_protocol" {
  description = "Protocol for the listener."
  type        = string
  default     = "HTTPS"

  validation {
    condition     = contains(["HTTP", "HTTPS"], var.listener_protocol)
    error_message = "listener_protocol must be HTTP or HTTPS."
  }
}

variable "certificate_arn" {
  description = "Certificate ARN for HTTPS listener."
  type        = string
  default     = ""

  validation {
    condition     = var.listener_protocol == "HTTPS" ? var.certificate_arn != "" : true
    error_message = "certificate_arn must be provided when listener_protocol is HTTPS."
  }
}

variable "enable_http_redirect" {
  description = "Create an HTTP listener that redirects to HTTPS."
  type        = bool
  default     = true
}

variable "target_group_name" {
  description = "Optional name for the target group."
  type        = string
  default     = ""
}

variable "target_group_port" {
  description = "Port used by the target group."
  type        = number
  default     = 80
}

variable "target_group_protocol" {
  description = "Protocol used by the target group."
  type        = string
  default     = "HTTP"

  validation {
    condition     = contains(["HTTP", "HTTPS"], var.target_group_protocol)
    error_message = "target_group_protocol must be HTTP or HTTPS."
  }
}

variable "health_check_path" {
  description = "Health check path for the target group."
  type        = string
  default     = "/"
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection on the ALB."
  type        = bool
  default     = false
}

variable "enable_access_logs" {
  description = "Enable ALB access logs."
  type        = bool
  default     = false
}

variable "access_logs_bucket" {
  description = "S3 bucket for ALB access logs."
  type        = string
  default     = ""

  validation {
    condition     = var.enable_access_logs ? var.access_logs_bucket != "" : true
    error_message = "access_logs_bucket must be set when enable_access_logs is true."
  }
}

variable "tags" {
  description = "Additional tags applied to load balancer resources."
  type        = map(string)
  default     = {}
}
