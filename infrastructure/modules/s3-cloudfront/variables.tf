variable "environment" {
  description = "Environment name"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate ARN"
  type        = string
  default     = ""
}
