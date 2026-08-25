output "provider_arn" {
  description = "ARN of the GitHub OIDC provider."
  value       = aws_iam_openid_connect_provider.github.arn
}

output "frontend_role_arn" {
  description = "ARN of the frontend GitHub deployer role."
  value       = try(aws_iam_role.github_frontend_deployer[0].arn, "")
}

output "backend_role_arn" {
  description = "ARN of the backend GitHub deployer role."
  value       = try(aws_iam_role.github_backend_deployer[0].arn, "")
}
