variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "gcloud_service_key" {
  description = "GCP service account key"
  type        = string
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
  description = "Deployment environment (prod, staging)"
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key"
  type        = string
}