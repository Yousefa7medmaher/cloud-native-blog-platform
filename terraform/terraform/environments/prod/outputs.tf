output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "alb_zone_id" {
  value = module.alb.alb_zone_id
}

output "target_group_arn" {
  value = module.alb.target_group_arn
}

output "asg_name" {
  value = module.compute.autoscaling_group_name
}

output "s3_bucket_name" {
  value = module.s3.bucket_id
}

output "s3_bucket_arn" {
  value = module.s3.bucket_arn
}

output "iam_role_arn" {
  value = module.iam.role_arn
}

output "frontend_s3_bucket_name" {
  value = module.frontend_s3.bucket_id
}

output "frontend_s3_bucket_arn" {
  value = module.frontend_s3.bucket_arn
}

output "cloudfront_distribution_domain_name" {
  value = module.cloudfront.distribution_domain_name
}

output "cloudfront_distribution_arn" {
  value = module.cloudfront.distribution_arn
}

output "route53_hosted_zone_id" {
  value = module.route53.hosted_zone_id
}

output "route53_frontend_fqdn" {
  value = module.route53.frontend_fqdn
}

output "route53_backend_fqdn" {
  value = module.route53.backend_fqdn
}

output "documentdb_secret_arn" {
  value = module.documentdb.secret_arn
}

output "documentdb_endpoint" {
  value = module.documentdb.cluster_endpoint
}

output "github_oidc_frontend_role_arn" {
  value = module.github_oidc.frontend_role_arn
}

output "github_oidc_backend_role_arn" {
  value = module.github_oidc.backend_role_arn
}
