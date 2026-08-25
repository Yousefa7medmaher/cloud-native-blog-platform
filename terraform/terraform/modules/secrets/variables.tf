variable "name" {
  description = "Name prefix for the Secrets Manager secret."
  type        = string
}

variable "description" {
  description = "Description for the secret."
  type        = string
  default     = ""
}

variable "secret_data" {
  description = "Key-value map stored in Secrets Manager."
  type        = map(string)
}

variable "tags" {
  description = "Tags applied to the secret."
  type        = map(string)
  default     = {}
}
