# Security group module

This module creates reusable security groups for the environment.

## Responsibilities
- Create a security group with dynamic ingress and egress rules
- Support either CIDR blocks or source security groups

## Inputs
- `name`
- `description`
- `vpc_id`
- `ingress_rules`
- `egress_rules`
- `tags`

## Outputs
- `security_group_id`
- `security_group_arn`
