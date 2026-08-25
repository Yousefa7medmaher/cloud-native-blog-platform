output "alb_arn" {
  value = aws_lb.this.arn
}

output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "alb_zone_id" {
  value = aws_lb.this.zone_id
}

output "target_group_arn" {
  value = aws_lb_target_group.this.arn
}

output "https_listener_arn" {
  value = aws_lb_listener.https.arn
}

output "http_redirect_listener_arn" {
  value = try(aws_lb_listener.http_redirect[0].arn, null)
}
