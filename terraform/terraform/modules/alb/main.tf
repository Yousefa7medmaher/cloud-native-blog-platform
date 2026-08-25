resource "aws_lb" "this" {
  name               = var.alb_name
  internal           = var.internal
  load_balancer_type = "application"

  security_groups = var.security_group_ids
  subnets         = var.subnet_ids

  enable_deletion_protection = var.enable_deletion_protection

  dynamic "access_logs" {
    for_each = var.enable_access_logs ? [1] : []

    content {
      bucket  = var.access_logs_bucket
      prefix  = var.alb_name
      enabled = true
    }
  }

  tags = merge(
    {
      Name = var.alb_name
    },
    var.tags
  )
}

resource "aws_lb_target_group" "this" {
  name = (
    var.target_group_name != ""
    ? var.target_group_name
    : "${var.alb_name}-tg"
  )

  port     = var.target_group_port
  protocol = var.target_group_protocol
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    path                = var.health_check_path
    protocol            = var.target_group_protocol
    matcher             = "200"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }

  tags = merge(
    {
      Name = "${var.alb_name}-tg"
    },
    var.tags
  )
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = var.listener_port
  protocol          = var.listener_protocol

  ssl_policy = (
    var.listener_protocol == "HTTPS"
    ? "ELBSecurityPolicy-TLS13-1-2-2021-06"
    : null
  )

  certificate_arn = (
    var.listener_protocol == "HTTPS"
    ? var.certificate_arn
    : null
  )

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

resource "aws_lb_listener" "http_redirect" {
  count = var.enable_http_redirect && var.listener_protocol == "HTTPS" ? 1 : 0

  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

