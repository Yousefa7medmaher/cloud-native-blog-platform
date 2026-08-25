data "aws_ami" "this" {
  count = var.ami_id == null ? 1 : 0

  most_recent = true
  owners      = var.ami_owners

  filter {
    name   = "name"
    values = [var.ami_name_filter]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_launch_template" "this" {
  name_prefix   = var.instance_name != null ? "${var.instance_name}-lt-" : "terraform-instance-lt-"
  image_id      = var.ami_id != null ? var.ami_id : data.aws_ami.this[0].id
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile {
    name = var.iam_instance_profile_name
  }

  user_data = var.user_data

  network_interfaces {
    security_groups              = var.security_group_ids
    associate_public_ip_address  = var.associate_public_ip_address
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tag_specifications {
    resource_type = "instance"
    tags = merge(
      var.tags,
      {
        Name = var.instance_name != null ? var.instance_name : "terraform-instance"
      }
    )
  }
}

resource "aws_autoscaling_group" "this" {
  name                      = var.instance_name != null ? var.instance_name : "terraform-asg"
  max_size                  = var.max_size
  min_size                  = var.min_size
  desired_capacity          = var.desired_capacity
  vpc_zone_identifier       = var.subnet_ids

  launch_template {
    id      = aws_launch_template.this.id
    version = "$Latest"
  }

  target_group_arns         = var.target_group_arns
  health_check_type         = var.health_check_type
  health_check_grace_period = var.health_check_grace_period
  force_delete              = true

  tag {
    key                 = "Name"
    value               = var.instance_name != null ? var.instance_name : "terraform-instance"
    propagate_at_launch = true
  }

  dynamic "tag" {
    for_each = var.tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
}

data "aws_instances" "this" {
  filter {
    name   = "tag:aws:autoscaling:groupName"
    values = [aws_autoscaling_group.this.name]
  }
}
