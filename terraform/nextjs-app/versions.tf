terraform {
  required_version = ">= 1.4.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.87.0"  # ✅ Match or exceed what your state expects
    }
  }
}
