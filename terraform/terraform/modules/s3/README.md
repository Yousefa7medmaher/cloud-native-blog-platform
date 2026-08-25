# S3 module

This module creates a secure S3 bucket for application storage.

## Responsibilities
- Create a bucket with versioning and encryption
- Block public access by default

## Inputs
- `bucket_name`
- `environment`
- `enable_versioning`
- `tags`

## Outputs
- `bucket_id`
- `bucket_arn`
- `bucket_domain_name`
