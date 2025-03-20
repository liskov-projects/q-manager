output "nextjs_url" {
  value = google_cloud_run_service.nextjs_app.status[0].url
}
