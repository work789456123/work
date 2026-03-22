resource "aws_db_instance" "postgres" {
  identifier           = "${local.project_name}-db"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "17"
  instance_class       = "db.t4g.micro"
  username             = var.db_username
  password             = var.db_password
  
  # Security
  storage_encrypted    = true
  deletion_protection  = false # Set to true for production!
  publicly_accessible  = true  # Currently true for your testing; set to false for production
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = merge(local.common_tags, {
    Name = "${local.project_name}_db"
  })
}
