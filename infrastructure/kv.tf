resource "cloudflare_kv_namespace" "config_kv" {
  account_id = var.cloudflare_account_id
  title      = "lifestyle-platform-config"
}

resource "cloudflare_kv_namespace" "trust_scores_kv" {
  account_id = var.cloudflare_account_id
  title      = "lifestyle-platform-trust-scores"
}

resource "cloudflare_kv_namespace" "users_kv" {
  account_id = var.cloudflare_account_id
  title      = "lifestyle-platform-users" # For WebAuthn authenticators & challenges
}