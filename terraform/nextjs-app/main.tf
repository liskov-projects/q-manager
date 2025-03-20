resource "google_cloud_run_service" "nextjs_app" {
  name = "nextjs-app-${var.env}"
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = var.image_tag

        ports {
          container_port = 3000
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = "https://websocket-server-269155740970.australia-southeast2.run.app"
        }

        # ✅ Startup probe – waits for the container to start
        startup_probe {
            http_get {
                path = "/"
                port = 3000
            }
            failure_threshold = 30 # ✅ More retries
            period_seconds    = 10  # ✅ Shorter interval between checks
            timeout_seconds   = 5 # ✅ More time to respond
        }

      }

      # ✅ Increase timeout to give the container more time to start
      timeout_seconds = 600
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
