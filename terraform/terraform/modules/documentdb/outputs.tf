output "cluster_endpoint" {
  description = "DocumentDB cluster endpoint."
  value       = aws_docdb_cluster.this.endpoint
}

output "cluster_port" {
  description = "DocumentDB cluster port."
  value       = aws_docdb_cluster.this.port
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing the DocumentDB credentials."
  value       = aws_secretsmanager_secret.database.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret containing the DocumentDB credentials."
  value       = aws_secretsmanager_secret.database.name
}

output "db_name" {
  description = "DocumentDB database name."
  value       = var.db_name
}

output "master_username" {
  description = "DocumentDB master username."
  value       = var.master_username
}
