provider "google" {
  credentials = file("~/.gcp/q-manager-453001-52399e6ab034.json")
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
      }
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }
}
