variable "zone_name" {
  description = "DNS zone name used for Route 53."
  type        = string
  default     = ""
}

variable "create_zone" {
  description = "Whether to create a new hosted zone."
  type        = bool
  default     = false
}

variable "existing_zone_id" {
  description = "Existing Route 53 hosted zone ID for an external or preexisting zone."
  type        = string
  default     = ""
}

variable "frontend_record_name" {
  description = "Frontend record name within the hosted zone."
  type        = string
  default     = ""
}

variable "frontend_alias_target" {
  description = "Frontend alias target domain name (CloudFront distribution domain name)."
  type        = string
  default     = ""
}

variable "frontend_alias_zone_id" {
  description = "Route53 hosted zone ID for the frontend alias target (CloudFront)."
  type        = string
  default     = ""
}

variable "backend_record_name" {
  description = "Backend record name within the hosted zone."
  type        = string
  default     = ""
}

variable "backend_alias_target" {
  description = "Backend alias target domain name (ALB DNS name)."
  type        = string
  default     = ""
}

variable "backend_alias_zone_id" {
  description = "Route53 hosted zone ID for the backend alias target (ALB)."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to Route 53 hosted zone and records."
  type        = map(string)
  default     = {}
}
