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
  description = "Deployment environment (prod, staging)"
}
