resource "aws_route53_zone" "this" {
  count = var.create_zone ? 1 : 0
  name  = var.zone_name

  tags = merge(
    {
      Name = var.zone_name
    },
    var.tags
  )
}

locals {
  hosted_zone_id = var.create_zone ? aws_route53_zone.this[0].zone_id : var.existing_zone_id
  domain_name     = var.zone_name
}

resource "aws_route53_record" "frontend_alias" {
  count = length(trimspace(var.frontend_record_name)) > 0 && length(trimspace(loc.hosted_zone_id)) > 0 && length(trimspace(var.frontend_alias_target)) > 0 ? 1 : 0

  zone_id = loc.hosted_zone_id
  name    = var.frontend_record_name
  type    = "A"

  alias {
    name                   = var.frontend_alias_target
    zone_id                = var.frontend_alias_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "backend_alias" {
  count = length(trimspace(var.backend_record_name)) > 0 && length(trimspace(loc.hosted_zone_id)) > 0 && length(trimspace(var.backend_alias_target)) > 0 ? 1 : 0

  zone_id = loc.hosted_zone_id
  name    = var.backend_record_name
  type    = "A"

  alias {
    name                   = var.backend_alias_target
    zone_id                = var.backend_alias_zone_id
    evaluate_target_health = false
  }
}
