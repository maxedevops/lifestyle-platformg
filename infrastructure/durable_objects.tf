resource "cloudflare_worker_script" "session_manager_do" {
  account_id = var.cloudflare_account_id
  name       = "session-manager-do"
  content    = file("../apps/worker-api/dist/session_manager.js") # Durable Object specific build output

  # DO binding is handled via the worker_script that imports it
}