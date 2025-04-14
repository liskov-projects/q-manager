variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  description = "GCP Region"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag for the container"
}

variable "env" {
  type        = string
  description = "Deployment environment (prod, qa)"
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk secret key"
  type        = string
}

variable "socket_url" {
  description = "The WebSocket URL to expose to the client app"
  type        = string
}

variable "google_bucket_credentials" {
  type = string
}

variable "clerk_frontend_api_key" {
  type = string
}