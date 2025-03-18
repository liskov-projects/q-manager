output "url" {
  value = google_cloud_run_service.websocket_server.status[0].url
}
