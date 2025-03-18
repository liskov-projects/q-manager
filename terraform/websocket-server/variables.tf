variable "image_tag" {
  description = "Docker image tag for the WebSocket server"
}

variable "custom_domain" {
  description = "Custom domain for the WebSocket server"
  default     = "cloud-run-server-269155740970.australia-southeast2.run.app"
}
