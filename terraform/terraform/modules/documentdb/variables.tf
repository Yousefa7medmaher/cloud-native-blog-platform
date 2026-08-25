variable "name" {
  description = "Name prefix for the DocumentDB resources."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where DocumentDB is deployed."
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs for the DocumentDB cluster."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs allowed to access DocumentDB."
  type        = list(string)
  default     = []
}

variable "instance_class" {
  description = "DocumentDB instance class."
  type        = string
  default     = "db.t4g.small"
}

variable "instance_count" {
  description = "Number of DocumentDB instances."
  type        = number
  default     = 1
}

variable "db_name" {
  description = "Primary database name for the DocumentDB cluster."
  type        = string
  default     = "jooblog"
}

variable "master_username" {
  description = "Master username for DocumentDB."
  type        = string
  default     = "jooblogadmin"
}

variable "engine_version" {
  description = "DocumentDB engine version."
  type        = string
  default     = "4.0.0"
}

variable "preferred_maintenance_window" {
  description = "Preferred maintenance window for the DocumentDB cluster."
  type        = string
  default     = "sun:23:00-mon:01:00"
}

variable "backup_retention_period" {
  description = "Backup retention period in days."
  type        = number
  default     = 7
}

variable "tags" {
  description = "Tags to apply to DocumentDB resources."
  type        = map(string)
  default     = {}
}
