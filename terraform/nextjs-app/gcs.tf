resource "google_storage_bucket" "tournament_images" {
  name     = "tournament-images-${var.project_id}"
  location = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  # Optional cleanup rule after 1 year
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 365
    }
  }
}

# Optional: Make images publicly readable
resource "google_storage_bucket_iam_binding" "public_read" {
  bucket = google_storage_bucket.tournament_images.name

  role = "roles/storage.objectViewer"
  members = [
    "allUsers"
  ]
}
