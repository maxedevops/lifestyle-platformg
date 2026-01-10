resource "cloudflare_pages_project" "lifestyle_frontend" {
  account_id        = var.cloudflare_account_id
  name              = "lifestyle-platform-web"
  production_branch = "main"

  deployment_configs {
    production {
      environment_variables = {
        VITE_API_URL = "https://api.lifestyle-platform.com"
      }
    }
    preview {
      environment_variables = {
        VITE_API_URL = "https://preview-api.lifestyle-platform.com"
      }
    }
  }
}