# -----------------------------------------------------------------------------
# Qdrant on ECS (EC2) with durable storage on Amazon EFS
# -----------------------------------------------------------------------------

resource "aws_efs_file_system" "qdrant" {
  creation_token = "${var.project_name}-${var.environment}-qdrant-data"
  encrypted      = true

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-${var.environment}-qdrant-efs"
  })
}

resource "aws_security_group" "qdrant_tasks" {
  name_prefix = "${var.project_name}-${var.environment}-qdrant-task-"
  description = "Qdrant container HTTP API (port 6333 from app tier)"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Qdrant REST from app tier"
    from_port       = 6333
    to_port         = 6333
    protocol        = "tcp"
    security_groups = [var.app_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "efs_qdrant" {
  name_prefix = "${var.project_name}-${var.environment}-efs-qdrant-"
  description = "EFS NFS for Qdrant persistence"
  vpc_id      = var.vpc_id

  ingress {
    description     = "NFS from Qdrant tasks"
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.qdrant_tasks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_efs_mount_target" "qdrant" {
  for_each        = toset(var.private_subnet_ids)
  file_system_id  = aws_efs_file_system.qdrant.id
  subnet_id       = each.value
  security_groups = [aws_security_group.efs_qdrant.id]
}

resource "aws_cloudwatch_log_group" "qdrant" {
  name              = "/ecs/${var.project_name}-${var.environment}-qdrant"
  retention_in_days = 14

  tags = var.common_tags
}

resource "aws_service_discovery_private_dns_namespace" "internal" {
  name        = "${var.project_name}-${var.environment}.internal"
  description = "ECS service discovery (${var.project_name} ${var.environment})"
  vpc         = var.vpc_id

  tags = var.common_tags
}

resource "aws_service_discovery_service" "qdrant" {
  name = "qdrant"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.internal.id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  tags = var.common_tags
}

locals {
  qdrant_service_url = "http://qdrant.${aws_service_discovery_private_dns_namespace.internal.name}:6333"
}

resource "aws_ecs_task_definition" "qdrant" {
  family                   = "${var.project_name}-${var.environment}-qdrant"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  volume {
    name = "qdrant-storage"

    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.qdrant.id
      root_directory     = "/"
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode([
    {
      name      = "qdrant"
      image     = "qdrant/qdrant:latest"
      essential = true
      portMappings = [
        {
          containerPort = 6333
          protocol      = "tcp"
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "qdrant-storage"
          containerPath = "/qdrant/storage"
          readOnly      = false
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.qdrant.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "qdrant"
        }
      }
    }
  ])

  depends_on = [aws_efs_mount_target.qdrant]
}

resource "aws_ecs_service" "qdrant" {
  name            = "${var.project_name}-${var.environment}-qdrant-svc"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.qdrant.arn
  desired_count   = 1
  launch_type     = "EC2"

  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.qdrant_tasks.id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = aws_service_discovery_service.qdrant.arn
  }

  depends_on = [aws_ecs_cluster_capacity_providers.this]
}
