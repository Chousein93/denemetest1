# Sparlo.ai Deployment Guide

This guide covers deployment strategies for the Sparlo.ai application using **Google Cloud Run** and **Vercel (via GitHub)**.

## Prerequisites

*   **Google Cloud CLI (gcloud)** installed and authenticated.
*   **Git** installed.
*   A **GitHub** account.
*   A **Vercel** account.
*   A **Google Cloud Platform** project with billing enabled.

---

## Option 1: Deploying to Google Cloud Run

Cloud Run is a managed compute platform that lets you run containers directly on top of Google's scalable infrastructure. We will use a multi-stage Docker build to compile the React app and serve it using Nginx.

### 1. Configuration Files
Ensure the following files exist in your project root (already created by your engineer):
*   `Dockerfile`
*   `nginx.conf`
*   `.dockerignore`

### 2. Environment Variables
Since Vite embeds environment variables during the **build time**, you must pass your Supabase credentials during the Docker build.

### 3. Deployment Steps

1.  **Enable Container Registry & Cloud Run APIs** (if not already enabled):
    ```bash
    gcloud services enable containerregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com
    ```

2.  **Build and Submit the Container:**
    Replace `[PROJECT_ID]` with your GCP Project ID and `[APP_NAME]` with `sparlo-ai`.

    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/[APP_NAME] \
      --substitutions=_VITE_SUPABASE_URL="your-supabase-url",_VITE_SUPABASE_ANON_KEY="your-anon-key"
    ```

    *Note: You need to configure `cloudbuild.yaml` to accept these substitutions or create a `.env` file locally and copy it into the container during build if you prefer not to pass keys via CLI flags.*

    **Alternative (Simpler for manual deployment):**
    Create a `.env` file in the root with your production keys, then run:
    ```bash
    gcloud run deploy sparlo-ai --source .
    ```
    *Choose "N" if asked to use source.properties, and "Y" to allow unauthenticated invocations (for a public website).*

3.  **Verify Deployment:**
    The CLI will output a Service URL (e.g., `https://sparlo-ai-xyz-uc.a.run.app`).

---

## Option 2: Deploying to Vercel (via GitHub)

Vercel is the optimal platform for frontend frameworks like Vite/React. It offers zero-configuration deployment.

### 1. Push to GitHub
1.  Initialize git if you haven't: `git init`.
2.  Commit your changes:
    ```bash
    git add .
    git commit -m "Initial commit"
    ```
3.  Create a new repository on GitHub and push your code.

### 2. Connect Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"** and choose the `sparlo-ai` repository you just pushed.

### 3. Configure Build Settings
Vercel usually detects Vite automatically. Verify the following:

*   **Framework Preset:** Vite
*   **Root Directory:** `./` (or leave empty)
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`

### 4. Configure Environment Variables
Expand the **"Environment Variables"** section in the Vercel deployment screen and add:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `your_production_supabase_url` |
| `VITE_SUPABASE_ANON_KEY` | `your_production_anon_key` |

### 5. Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to complete (usually < 1 minute).
3.  Your app is now live at `https://your-repo-name.vercel.app`.

### 6. Handling Client-Side Routing
Vercel handles SPA routing automatically for Vite projects. However, if you encounter 404s on refresh, create a `vercel.json` in the root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Summary of Tech Stack

*   **Build Tool:** Vite
*   **Frontend:** React 18 + TypeScript
*   **Styling:** Tailwind CSS
*   **State/Logic:** React Context + Supabase Auth
*   **Routing:** React Router v6

Ensure your `metadata.json` permissions (camera, microphone, geolocation) are actually required by your hosting environment's policy headers if you plan to implement features using them.
