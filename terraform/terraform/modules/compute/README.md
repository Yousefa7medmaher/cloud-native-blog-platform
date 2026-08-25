# Compute module

This module creates a production-ready compute tier based on an Auto Scaling Group and launch template.

## Responsibilities
- Create an EC2 launch template
- Create an Auto Scaling Group in private subnets
- Register instances with target groups
- Attach an IAM instance profile

## Inputs
- `name`
- `instance_type`
- `ami_id`
- `subnet_ids`
- `security_group_ids`
- `iam_instance_profile_name`
- `target_group_arns`
- `min_size`, `max_size`, `desired_capacity`
- `tags`

## Outputs
- `launch_template_id`
- `autoscaling_group_name`
