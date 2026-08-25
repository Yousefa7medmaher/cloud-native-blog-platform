variable "name" {
  description = "Base name for the compute resources."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the launch template."
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID to use for the launch template. If null, the latest Ubuntu 22.04 AMI is selected."
  type        = string
  default     = null
}

variable "ami_name_filter" {
  description = "AMI name filter when ami_id is null."
  type        = string
  default     = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
}

variable "ami_owners" {
  description = "Account IDs allowed to provide the AMI when ami_id is null."
  type        = list(string)
  default     = ["099720109477"]
}

variable "key_name" {
  description = "EC2 key pair name."
  type        = string
  default     = null
}

variable "subnet_ids" {
  description = "Private subnet IDs for the Auto Scaling Group."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs attached to the launch template."
  type        = list(string)
  default     = []
}

variable "iam_instance_profile_name" {
  description = "IAM instance profile name to attach to launched instances."
  type        = string
  default     = null
}

variable "user_data" {
  description = "User data script for the instances."
  type        = string
  default     = null
}

variable "target_group_arns" {
  description = "Target group ARNs to register instances with."
  type        = list(string)
  default     = []
}

variable "min_size" {
  description = "Minimum size of the Auto Scaling Group."
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum size of the Auto Scaling Group."
  type        = number
  default     = 2
}

variable "desired_capacity" {
  description = "Desired capacity of the Auto Scaling Group."
  type        = number
  default     = 1
}

variable "health_check_type" {
  description = "Health check type for the Auto Scaling Group."
  type        = string
  default     = "ELB"
}

variable "health_check_grace_period" {
  description = "Grace period before health checks begin."
  type        = number
  default     = 60
}

variable "associate_public_ip_address" {
  description = "Whether launched instances get a public IP address."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional tags applied to compute resources."
  type        = map(string)
  default     = {}
}
