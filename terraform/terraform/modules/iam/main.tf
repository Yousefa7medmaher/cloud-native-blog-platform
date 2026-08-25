data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = merge(
    {
      Name = var.role_name
    },
    var.tags
  )
}

data "aws_iam_policy_document" "s3_access" {
  statement {
    sid    = "ListBucket"
    effect = "Allow"

    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
    ]

    resources = [var.s3_bucket_arn]
  }

  statement {
    sid    = "ObjectAccess"
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = ["${var.s3_bucket_arn}/*"]
  }

  dynamic "statement" {
    for_each = length(trimspace(var.secrets_manager_secret_arn)) > 0 ? [1] : []
    content {
      sid    = "SecretsManagerRead"
      effect = "Allow"
      actions = ["secretsmanager:GetSecretValue"]
      resources = [var.secrets_manager_secret_arn]
    }
  }

  dynamic "statement" {
    for_each = length(trimspace(var.ssm_parameter_prefix)) > 0 ? [1] : []
    content {
      sid    = "SSMParameterRead"
      effect = "Allow"
      actions = [
        "ssm:GetParameter",
        "ssm:GetParameters",
      ]
      resources = ["arn:aws:ssm:*:*:parameter${var.ssm_parameter_prefix}*"]
    }
  }
}

resource "aws_iam_role_policy" "s3_access" {
  name   = "${var.role_name}-s3-access"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.s3_access.json
}

resource "aws_iam_instance_profile" "ec2" {
  name = var.role_name
  role = aws_iam_role.ec2.name

  tags = merge(
    {
      Name = var.role_name
    },
    var.tags
  )
}
