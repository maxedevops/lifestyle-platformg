resource "cloudflare_d1_database" "main_db" {
  account_id = var.cloudflare_account_id
  name       = "lifestyle-platform-db"
}

resource "cloudflare_r2_bucket" "media_storage" {
  account_id = var.cloudflare_account_id
  name       = "lifestyle-platform-media"
  location   = "ENAM"
}

resource "cloudflare_worker_script" "api_worker" {
  account_id = var.cloudflare_account_id
  name       = "worker-api"
  content    = file("../apps/worker-api/dist/index.js")
  
  d1_database_binding {
    name        = "DB"
    database_id = cloudflare_d1_database.main_db.id
  }
}