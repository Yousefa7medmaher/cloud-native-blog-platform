output "hosted_zone_id" {
  description = "The Route 53 hosted zone ID." 
  value       = var.create_zone ? aws_route53_zone.this[0].zone_id : var.existing_zone_id
}

output "frontend_fqdn" {
  description = "Fully qualified domain name for the frontend." 
  value       = length(trimspace(var.frontend_record_name)) > 0 && length(trimspace(var.zone_name)) > 0 ? join(".", [var.frontend_record_name, var.zone_name]) : ""
}

output "backend_fqdn" {
  description = "Fully qualified domain name for the backend." 
  value       = length(trimspace(var.backend_record_name)) > 0 && length(trimspace(var.zone_name)) > 0 ? join(".", [var.backend_record_name, var.zone_name]) : ""
}
