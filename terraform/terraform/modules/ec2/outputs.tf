output "asg_name" {
  value = aws_autoscaling_group.this.name
}

output "instance_ids" {
  value = data.aws_instances.this.ids
}

output "instance_private_ips" {
  value = data.aws_instances.this.instances[*].private_ip
}
