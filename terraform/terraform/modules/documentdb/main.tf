resource "aws_security_group" "documentdb" {
  name        = "${var.name}-documentdb-sg"
  description = "Security group for DocumentDB cluster."
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.security_group_ids
    content {
      description      = "Allow DocumentDB access from application security group."
      from_port        = 27017
      to_port          = 27017
      protocol         = "tcp"
      security_groups  = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    {
      Name = "${var.name}-documentdb-sg"
    },
    var.tags
  )
}

resource "aws_docdb_subnet_group" "this" {
  name       = "${var.name}-subnet-group"
  subnet_ids = var.subnet_ids

  tags = merge(
    {
      Name = "${var.name}-subnet-group"
    },
    var.tags
  )
}

resource "random_password" "master" {
  length           = 24
  special          = true
  override_characters = "@%+=:,._-~"
}

resource "aws_docdb_cluster" "this" {
  cluster_identifier      = "${var.name}-cluster"
  engine                  = "docdb"
  engine_version          = var.engine_version
  master_username         = var.master_username
  master_password         = random_password.master.result
  backup_retention_period = var.backup_retention_period
  preferred_maintenance_window = var.preferred_maintenance_window
  db_cluster_parameter_group_name = "default.docdb4.0"
  vpc_security_group_ids  = [aws_security_group.documentdb.id]
  db_subnet_group_name    = aws_docdb_subnet_group.this.name
  apply_immediately       = false
  deletion_protection     = false
  storage_encrypted       = true
  port                    = 27017
  tags = merge(
    {
      Name = "${var.name}-cluster"
    },
    var.tags
  )
}

resource "aws_docdb_cluster_instance" "this" {
  count                = var.instance_count
  identifier           = "${var.name}-instance-${count.index + 1}"
  engine               = aws_docdb_cluster.this.engine
  engine_version       = aws_docdb_cluster.this.engine_version
  instance_class       = var.instance_class
  cluster_identifier   = aws_docdb_cluster.this.id
  apply_immediately    = false
  auto_minor_version_upgrade = true
  preferred_maintenance_window = var.preferred_maintenance_window
  tags = merge(
    {
      Name = "${var.name}-instance-${count.index + 1}"
    },
    var.tags
  )
}

resource "aws_secretsmanager_secret" "database" {
  name        = "${var.name}-credentials"
  description = "Database credentials for DocumentDB cluster."

  tags = merge(
    {
      Name = "${var.name}-credentials"
    },
    var.tags
  )
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id     = aws_secretsmanager_secret.database.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master.result
    host     = aws_docdb_cluster.this.endpoint
    port     = aws_docdb_cluster.this.port
    dbname   = var.db_name
  })
}
