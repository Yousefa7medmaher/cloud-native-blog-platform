variable "alb_name" {
  type = string
}

variable "internal" {
  type    = bool
  default = false
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "listener_port" {
  type    = number
  default = 443
}

variable "listener_protocol" {
  type    = string
  default = "HTTPS"

  validation {
    condition     = contains(["HTTP", "HTTPS"], var.listener_protocol)
    error_message = "Protocol must be HTTP or HTTPS."
  }
}

variable "certificate_arn" {
  type    = string
  default = ""

  validation {
    condition = var.listener_protocol == "HTTPS" ? var.certificate_arn != "" : true
    error_message = "certificate_arn must be provided when listener_protocol is HTTPS."
  }
}

variable "enable_http_redirect" {
  type    = bool
  default = true
}

variable "access_logs_bucket" {
  type    = string
  default = ""

  validation {
    condition = var.enable_access_logs ? var.access_logs_bucket != "" : true
    error_message = "access_logs_bucket must be set when enable_access_logs is true."
  }
}

variable "target_group_name" {
  type    = string
  default = ""
}

variable "target_group_port" {
  type    = number
  default = 80
}

variable "target_group_protocol" {
  type    = string
  default = "HTTP"

  validation {
    condition     = contains(["HTTP", "HTTPS"], var.target_group_protocol)
    error_message = "Target Group protocol must be HTTP or HTTPS."
  }
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

variable "tags" {
  type    = map(string)
  default = {}
}

