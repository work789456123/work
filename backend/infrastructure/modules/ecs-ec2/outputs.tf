output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "qdrant_internal_url" {
  description = "Private HTTP URL for the Qdrant API (same value injected as QDRANT_URL on backend)."
  value       = local.qdrant_service_url
}
