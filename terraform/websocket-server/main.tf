provider "google" {
  credentials = file("~/.gcp/q-manager-453001-52399e6ab034.json")
  project     = "q-manager-453001"
  region      = "australia-southeast2"
}

resource "google_cloud_run_service" "websocket_server" {
  name     = "websocket-server"
  location = "australia-southeast2"

  template {
    spec {
      containers {
        image = var.image_tag
        ports {
          container_port = 4000
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
      }
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }
}

resource "google_cloud_run_domain_mapping" "websocket_server" {
  location = "australia-southeast2"
  name     = var.custom_domain

  metadata {
    namespace = "q-manager-453001"
  }

  spec {
    route_name = google_cloud_run_service.websocket_server.name
  }
}
