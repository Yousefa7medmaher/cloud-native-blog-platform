# Load balancer module

This module creates an Application Load Balancer with a target group and listeners.

## Responsibilities
- Provision an internet-facing or internal ALB
- Create a target group and health checks
- Create HTTPS and optional HTTP redirect listeners

## Inputs
- `name`
- `vpc_id`
- `subnet_ids`
- `security_group_ids`
- `listener_port`
- `listener_protocol`
- `certificate_arn`
- `target_group_port`
- `target_group_protocol`
- `health_check_path`
- `tags`

## Outputs
- `alb_arn`
- `alb_dns_name`
- `target_group_arn`
