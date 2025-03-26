variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
}

variable "env" {
  description = "environment"
  type        = string
}

variable "port" {
  description = "Port the WebSocket server will listen on"
  type        = number
  default     = 4000
}
