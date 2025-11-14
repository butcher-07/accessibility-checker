# Deployment Guide

This guide covers deploying the Accessibility Scanner to free hosting platforms.

## Quick Deploy

### Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy?referralCode=butcher-07)

Click the button above, then:
1. Sign in to Railway (if not already)
2. Click "Deploy from GitHub repo"
3. Select `butcher-07/accessibility-checker`
4. Railway will auto-detect `railway.toml` and configure everything

> **Note**: To create a true one-click deploy:
> 1. Deploy the app to Railway first
> 2. Go to your Railway project → Settings → Template
> 3. Click "Publish Template"
> 4. Get your template ID from the URL
> 5. Update the button to: `https://railway.com/deploy/YOUR_TEMPLATE_ID`

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/butcher-07/accessibility-checker)

Click the button to deploy directly from the `render.yaml` blueprint.

---

## Render.com Deployment

### Method 1: Blueprint (Easiest)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will automatically detect `render.yaml` and set up everything

### Method 2: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: accessibility-scanner
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free
5. Click "Create Web Service"

**Free Tier**: 750 hours/month, sleeps after 15min inactivity, wakes on request

---

## Railway.app Deployment

### Quick Deploy
1. Push your code to GitHub
2. Go to [Railway](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect `railway.json` and deploy

**Configuration** (auto-detected from railway.json):
- Build: `npm install && npm run build`
- Start: `npm run start`

**Free Tier**: $5/month credit (usually enough for hobby projects)

---

## Docker Deployment (Any Platform)

The included `Dockerfile` can be used on any platform that supports Docker:
- Render.com (Docker)
- Railway (Docker)
- Google Cloud Run
- AWS Fargate
- Azure Container Apps

### Build and Run Locally
```bash
# Build the image
docker build -t accessibility-scanner .

# Run the container
docker run -p 5000:5000 accessibility-scanner
```

---

## Important Notes

### Database
- Currently uses SQLite (`accessibility.db`)
- For production, consider using PostgreSQL:
  - Render: Free PostgreSQL (90 days, then requires upgrade)
  - Railway: PostgreSQL add-on (included in free credit)

### Puppeteer Requirements
- All configs include Chrome/Chromium dependencies
- Render.yaml includes proper Puppeteer environment variables
- Dockerfile installs all necessary system dependencies

### Environment Variables
No environment variables are required for basic operation. The app works out of the box.

---

## Troubleshooting

### Puppeteer Fails to Launch
If you see "Failed to launch chrome":
1. Ensure platform has Chrome installed
2. Check Puppeteer environment variables
3. On Render: Use the provided `render.yaml` config

### Build Timeouts
If build times out on free tier:
- Render: 15min build timeout (should be enough)
- Railway: Generally no timeout issues

### Cold Starts
Free tiers sleep after inactivity:
- First request after sleep takes 30-60s
- Subsequent requests are fast
