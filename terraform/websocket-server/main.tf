provider "google" {
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_run_service" "websocket_server" {
  name     = "websocket-server"
  location = var.region

  template {
    spec {
      containers {
        image = var.image_tag
        ports {
          container_port = var.port
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "NEXT_PUBLIC_MONGO_URI"
          value = var.mongo_uri
        }
        env {
          name  = "ENV"
          value = var.env // "qa", "prod", etc..
        }
      }
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }
}
