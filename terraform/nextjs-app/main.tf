provider "google" {
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_run_service" "nextjs_app" {
  name     = "nextjs-app-${var.env}"
  location = var.region
  project  = var.project_id

  template {
    spec {
      # ✅ Explicitly set the Cloud Run service account
      service_account_name = "cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com"

      containers {
        image = var.image_tag

        ports {
          container_port = 8080
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = "https://websocket-server-269155740970.australia-southeast2.run.app"
        }

        env {
          name  = "NEXT_PUBLIC_MONGO_URI"
          value = var.mongo_uri
        }

        env {
          name  = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
          value = var.clerk_publishable_key
        }

        # ✅ Startup probe – waits for the container to start
        startup_probe {
            http_get {
                path = "/api/health"
                port = 8080
            }
            failure_threshold = 30 # ✅ More retries
            period_seconds    = 20  # ✅ Shorter interval between checks
            timeout_seconds   = 15 # ✅ More time to respond
            initial_delay_seconds = 5
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
