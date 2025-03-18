variable "project_id" {
  default = "q-manager-453001"
}

variable "region" {
  default = "australia-southeast2"
}

variable "image_tag" {
  description = "Docker image tag for the WebSocket server"
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
}

variable "environment" {
  default = "production"
}
