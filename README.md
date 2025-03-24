# Overview

The Queue Management App is a React-based application designed to facilitate the efficient management of players across multiple queues. Players can be distributed, processed, and reassigned between queues dynamically, making it an excellent tool for managing tournaments or similar events. The app also integrates with MongoDB for persistent storage, enabling easy updates and retrieval of player and queue data.

# Features

## Player Management

        Add players with details like names, categories, and phone numbers.
        Assign players to queues or mark them as unprocessed.
        Update player statuses dynamically (e.g., assignedToQueue, processedThroughQueue).

## Queue Management

        Create, update, and delete queues.
        Dynamically find and add players to the shortest queue.
        Redistribute items between queues while ensuring no duplicates.

## Drag and Drop

        Drag items from the unprocessed list to a queue.
        Rearrange items within queues.

## Persistent Storage

        Store players and queue data in MongoDB using Mongoose schemas.
        Handle CRUD operations for both players and queues.

## State Management

        Use React's useState and useReducer hooks to manage complex interactions.
        Context API for sharing state across components.

## Dynamic Updates

        Ensure queues are updated in real-time when players are added or reassigned.
        Prevent duplicates across queues and unprocessed lists.

# Core Data Structures

## Player Object

{
"\_id": "6747f3044eafd5b409c0ac96",
"id": 1,
"names": "Player 29 vs Player 117",
"categories": ["teens"],
"phoneNumbers": ["04840 329 948"],
"tournamentId": "674535149d28197b79a96bd1",
"assignedToQueue": false,
"processedThroughQueue": false
}

## Queue Object

{
"\_id": "674c31ae6481d1026a4f69b9",
"id": "q11",
"queueName": "Field 1",
"queueItems": []
}

# Code organisation

    Every input at the top of the file follows the order: hooks - types - components
    The app core functoinality is divided into groups and the relevant hooks

# Key Components

## Player List

    Displays all players in the tournament.
    Differentiates between processed and unprocessed players.

## Queue

    Represents a single queue.
    Shows the items assigned to the queue.

## Drag-and-Drop Zone

    Provides an interactive UI for reordering and assigning players.

## Buttons

    Add All to Queues: Distributes players across queues.
    Remove All: Clears a queue or unprocessed list.

# Functions

## handleAddToShortestQueue

Assigns a player to the shortest queue by comparing the length of queueItems.
Parameters

    itemId (string | undefined): ID of the player to be added.

Process

    Finds the player by itemId.
    Identifies the shortest queue.
    Updates the queue's queueItems and marks the player as assigned.

Usage

Called when a player is manually added to a queue or distributed using a button.

## onDelete

Removes a player from the database and updates the state.
Parameters

    id (string): The MongoDB _id of the player to delete.

Usage

Used for clearing players no longer needed in the tournament.

## queueSlicer

Slices a collection of items from queues and redistributes them.
Returns

    stumps: Items to be redistributed.
    slicedCollection: Remaining items after extraction.

Usage

Called during batch redistribution or when queues need rebalancing.

# MongoDB Integration

## Database

Player Collection
Tournament Collection

# API Endpoints

## GET /api/players

    Retrieves all players.

## POST /api/players

    Adds a new player.

## DELETE /api/players/:id

    Deletes a player by ID.

## GET /api/queues

    Retrieves all queues.

# Seeding utilities | dev purposes

## npm run seed:tournaments

    Populates the db with 7 empty tournaments - 1st

## npm run seed:players

    Populates the db with players. Players are added into the players collection & to the corresponding tournament - use 2d

# Tests

    the test command is NODE_OPTIONS="--experimental-vm-modules" npx jest under the hood

    it is so as Jest runs in ComonJS env, but we use ES modules with import/export

    --experimental-vm-modules flag tells Node.js to enable native ESM support inside Jest, which is still not fully supported by default

# 🚀 **Q-Manager Next.js + Cloud Run Deployment Guide**

This README explains the setup, configuration, and deployment process for the **Q-Manager Next.js app** and its integration with **Google Cloud Run** using **Terraform** and **GitHub Actions**.

---

## 🏆 **Goal**

- Deploy a Next.js app to Google Cloud Run
- Use Docker to containerize the app
- Automate deployment using Terraform and GitHub Actions
- Manage state using a Google Cloud Storage (GCS) backend

---

## 📁 **Project Structure**

```
├── src/nextjs-app/           # Next.js app source code
├── terraform/nextjs-app/     # Terraform config for Cloud Run
├── Dockerfile                # Docker config for containerizing Next.js app
├── .github/workflows/        # GitHub Actions workflows
└── README.md                 # This file
```

---

## 🌐 **Architecture Overview**

1. **Next.js App**

   - A Next.js app configured for standalone build mode
   - Uses `NEXT_PUBLIC_MONGO_URI` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` environment variables

2. **Docker**

   - Build Next.js app using Docker
   - Push image to Google Artifact Registry

3. **Google Cloud Run**

   - Runs the containerized Next.js app
   - Maps dynamic `$PORT` to `8080`

4. **Terraform**

   - Defines Cloud Run service
   - Configures environment variables
   - Manages state in a GCS bucket

5. **GitHub Actions**
   - Automates build + deployment using Terraform and Docker
   - Secures secrets via GitHub repository settings

---

## 🔨 **Setup & Configuration**

### ✅ **1. Create a Service Account for Terraform**

Create a service account with the correct permissions:

```bash
gcloud iam service-accounts create cloud-run-invoker \
    --display-name "Cloud Run Invoker"
```

Grant necessary roles:

```bash
gcloud projects add-iam-policy-binding q-manager-453001 \
    --member="serviceAccount:cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding q-manager-453001 \
    --member="serviceAccount:cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding q-manager-453001 \
    --member="serviceAccount:cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"
```

---

### ✅ **2. Generate a Service Account Key**

Create a service account key and store it locally:

```bash
gcloud iam service-accounts keys create ~/.gcp/q-manager-453001.json \
    --iam-account cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com
```

Set it for Terraform and gcloud:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=~/.gcp/q-manager-453001.json
```

---

### ✅ **3. Create a Google Cloud Storage Bucket for State**

Create a bucket for storing Terraform state:

```bash
gcloud storage buckets create gs://q-manager-terraform-state \
    --location=australia-southeast2
```

Grant storage permissions:

```bash
gcloud projects add-iam-policy-binding q-manager-453001 \
    --member="serviceAccount:cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

---

### ✅ **4. Configure Terraform Backend**

In `terraform/nextjs-app/backend.tf`:

```hcl
terraform {
  backend "gcs" {
    bucket = "q-manager-terraform-state"
    prefix = "cloud-run/nextjs"
  }
}
```

---

### ✅ **5. Configure Terraform for Cloud Run**

In `terraform/nextjs-app/main.tf`:

```hcl
provider "google" {
  credentials = file("~/.gcp/q-manager-453001.json")
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_run_service" "nextjs_app" {
  name     = "nextjs-app-${var.env}"
  location = var.region
  project  = var.project_id

  template {
    spec {
      service_account_name = "cloud-run-invoker@q-manager-453001.iam.gserviceaccount.com"

      containers {
        image = var.image_tag

        ports {
          container_port = 8080
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "NEXT_PUBLIC_MONGO_URI"
          value = var.mongo_uri
        }

        env {
          name  = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
          value = var.clerk_publishable_key
        }

        startup_probe {
          http_get {
            path = "/api/health"
            port = 8080
          }
          failure_threshold = 30
          period_seconds    = 20
          timeout_seconds   = 15
          initial_delay_seconds = 5
        }
      }

      timeout_seconds = 600
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
```

---

### ✅ **6. Set Up GitHub Secrets**

Set the following secrets in GitHub:

| Secret                  | Description                         |
| ----------------------- | ----------------------------------- |
| `GCLOUD_SERVICE_KEY`    | Contents of `q-manager-453001.json` |
| `MONGO_URI`             | MongoDB connection string           |
| `CLERK_PUBLISHABLE_KEY` | Clerk API key                       |

---

### ✅ **7. Create GitHub Workflow**

In `.github/workflows/deploy-nextjs.yml`:

```yaml
name: Deploy Next.js App to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - "/**"
      - "terraform/nextjs/**"
      - ".github/workflows/deploy-nextjs.yml"
      - "!src/websocket-server/**"
      - "!terraform/websocket-server/**"
      - "!.github/workflows/deploy-websocket-server.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Authenticate with Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCLOUD_SERVICE_KEY }}

      - name: Build and Push Docker Image
        run: |
          IMAGE_NAME="australia-southeast2-docker.pkg.dev/q-manager-453001/q-manager-nextjs/nextjs-app:${{ github.sha }}"
          docker buildx build --platform=linux/amd64 \
            --build-arg NEXT_PUBLIC_MONGO_URI="${{ secrets.MONGO_URI }}" \
            --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${{ secrets.CLERK_PUBLISHABLE_KEY }}" \
            -t "$IMAGE_NAME" -f Dockerfile . --push

      - name: Terraform Apply
        working-directory: terraform/nextjs-app
        run: |
          terraform apply -var="image_tag=$IMAGE_NAME" \
                          -var="project_id=q-manager-453001" \
                          -var="region=australia-southeast2" \
                          -var="mongo_uri=${{ secrets.MONGO_URI }}" \
                          -var="clerk_publishable_key=${{ secrets.CLERK_PUBLISHABLE_KEY }}" \
                          -auto-approve
```

---

## ✅ **8. Trigger the Workflow**

To trigger the workflow:

1. Push changes to `main` branch
2. GitHub will automatically trigger the workflow
3. Monitor progress in the **Actions** tab

---

## ✅ **9. Debugging Tips**

### 🔎 View Cloud Run Logs:

```bash
gcloud run services logs read nextjs-app-staging --region=australia-southeast2
```

### 🔎 Check Cloud Run Status:

```bash
gcloud run services describe nextjs-app-staging --region=australia-southeast2
```

### 🔎 List Terraform State:

```bash
gsutil ls gs://q-manager-terraform-state/cloud-run/nextjs
```

---

## 🚀 **Result:**

✅ Next.js app deployed to Cloud Run  
✅ Docker image pushed to Artifact Registry  
✅ Terraform state stored in GCS  
✅ Deployment fully automated with GitHub Actions

---

👉 **We have lift off!** 😎
