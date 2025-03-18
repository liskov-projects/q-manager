terraform {
  backend "gcs" {
    bucket = "q-manager-terraform-state"
    prefix = "cloud-run/production/websocket-server"
  }
}
