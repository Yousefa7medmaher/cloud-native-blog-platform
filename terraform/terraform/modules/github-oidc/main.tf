resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "github_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = var.github_subject_filters
    }
  }
}

resource "aws_iam_role" "github_frontend_deployer" {
  count              = var.enable_frontend_deployer ? 1 : 0
  name               = "${var.role_prefix}-github-frontend-deployer"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json

  tags = merge(
    {
      Name = "${var.role_prefix}-github-frontend-deployer"
    },
    var.tags
  )
}

resource "aws_iam_role" "github_backend_deployer" {
  count              = var.enable_backend_deployer ? 1 : 0
  name               = "${var.role_prefix}-github-backend-deployer"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json

  tags = merge(
    {
      Name = "${var.role_prefix}-github-backend-deployer"
    },
    var.tags
  )
}

data "aws_iam_policy_document" "frontend_s3_cloudfront_access" {
  count = var.enable_frontend_deployer ? 1 : 0

  statement {
    sid    = "S3FrontendBucketAccess"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = concat(
      [var.frontend_s3_bucket_arn],
      ["${var.frontend_s3_bucket_arn}/*"]
    )
  }

  dynamic "statement" {
    for_each = length(trimspace(var.cloudfront_distribution_arn)) > 0 ? [1] : []
    content {
      sid    = "CloudFrontInvalidation"
      effect = "Allow"
      actions = [
        "cloudfront:CreateInvalidation",
      ]
      resources = [var.cloudfront_distribution_arn]
    }
  }
}

resource "aws_iam_role_policy" "frontend_s3_cloudfront_access" {
  count  = var.enable_frontend_deployer ? 1 : 0
  name   = "${var.role_prefix}-frontend-s3-cloudfront"
  role   = aws_iam_role.github_frontend_deployer[0].id
  policy = data.aws_iam_policy_document.frontend_s3_cloudfront_access[0].json
}

data "aws_iam_policy_document" "backend_secret_access" {
  count = var.enable_backend_deployer ? 1 : 0

  dynamic "statement" {
    for_each = length(trimspace(var.secrets_prefix)) > 0 ? [1] : []
    content {
      sid    = "SecretsManagerRead"
      effect = "Allow"
      actions = ["secretsmanager:GetSecretValue"]
      resources = ["arn:aws:secretsmanager:*:*:secret${var.secrets_prefix}*"]
    }
  }

  dynamic "statement" {
    for_each = length(trimspace(var.ssm_parameter_prefix)) > 0 ? [1] : []
    content {
      sid    = "SSMParameterRead"
      effect = "Allow"
      actions = [
        "ssm:GetParameters",
        "ssm:GetParameter",
      ]
      resources = ["arn:aws:ssm:*:*:parameter${var.ssm_parameter_prefix}*"]
    }
  }
}

resource "aws_iam_role_policy" "backend_secret_access" {
  count  = var.enable_backend_deployer ? 1 : 0
  name   = "${var.role_prefix}-backend-secret-access"
  role   = aws_iam_role.github_backend_deployer[0].id
  policy = data.aws_iam_policy_document.backend_secret_access[0].json
}
