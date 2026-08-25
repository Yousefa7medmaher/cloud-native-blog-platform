# VPC module

This module provisions the network foundation for the environment.

## Responsibilities
- Create a VPC and Internet Gateway
- Create public and private subnets
- Create route tables and associations
- Optionally create NAT Gateway resources

## Inputs
- `environment`
- `vpc_cidr`
- `public_subnet_cidrs`
- `private_subnet_cidrs`
- `availability_zones`
- `enable_nat_gateway`
- `tags`

## Outputs
- `vpc_id`
- `public_subnet_ids`
- `private_subnet_ids`
