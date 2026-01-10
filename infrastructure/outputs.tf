output "d1_database_id" {
  description = "The ID of the D1 database."
  value       = cloudflare_d1_database.main_db.id
}

output "r2_bucket_name" {
  description = "The name of the R2 bucket."
  value       = cloudflare_r2_bucket.media_storage.name
}

output "kv_config_id" {
  description = "The ID of the KV namespace for config."
  value       = cloudflare_kv_namespace.config_kv.id
}

output "kv_trust_scores_id" {
  description = "The ID of the KV namespace for trust scores."
  value       = cloudflare_kv_namespace.trust_scores_kv.id
}

output "kv_users_id" {
  description = "The ID of the KV namespace for user authenticators."
  value       = cloudflare_kv_namespace.users_kv.id
}

output "cloudflare_pages_project_name" {
  description = "The name