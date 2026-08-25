# IAM module

This module creates the instance role, instance profile, and S3 access policy used by the compute tier.

## Responsibilities
- Create an EC2 assume-role policy
- Attach a policy allowing S3 access for application assets
- Create an instance profile used by the launch template

## Inputs
- `role_name`
- `s3_bucket_arn`
- `tags`

## Outputs
- `role_arn`
- `role_name`
- `instance_profile_name`
