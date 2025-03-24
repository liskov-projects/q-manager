terraform {
  backend "gcs" {
    bucket = "q-manager-terraform-state"
    prefix = "cloud-run/nextjs"
  }
}
