variable "instance_name" {
  type    = string
  default = null
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ami_id" {
  type    = string
  default = null
}

variable "ami_name_filter" {
  type    = string
  default = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
}

variable "ami_owners" {
  type    = list(string)
  default = ["099720109477"]
}

variable "key_name" {
  type    = string
  default = null
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type    = list(string)
  default = []
}

variable "target_group_arns" {
  type    = list(string)
  default = []
}

variable "max_size" {
  type    = number
  default = 2
}

variable "min_size" {
  type    = number
  default = 2
}

variable "desired_capacity" {
  type    = number
  default = 2
}

variable "health_check_type" {
  type    = string
  default = "ELB"
}

variable "health_check_grace_period" {
  type    = number
  default = 60
}

variable "associate_public_ip_address" {
  type    = bool
  default = false
}

variable "iam_instance_profile_name" {
  type    = string
  default = null
}

variable "user_data" {
  type    = string
  default = null
}

variable "tags" {
  type    = map(string)
  default = {}
}
