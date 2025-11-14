# Kontent.ai Custom App Setup Guide

This guide explains how to use the Accessibility Scanner as a Kontent.ai custom app with automatic space preview URL loading.

## Overview

When configured as a Kontent.ai custom app, the scanner will:
- ✅ Automatically detect it's running inside Kontent.ai (works from any deployment)
- ✅ Load all spaces with configured preview URLs
- ✅ Show a dropdown to select spaces instead of manually entering URLs
- ✅ Work from Railway, Render, or any hosting platform

## Prerequisites

1. **Deploy the app** to Railway, Render, or any hosting platform
   - Get your deployment URL (e.g., `https://your-app.up.railway.app`)

2. **Get a Kontent.ai Management API key**
   - Go to your Kontent.ai environment settings
   - Navigate to API keys → Management API
   - Copy your Management API key

3. **Configure preview URLs for your spaces** (if not already done)
   - Go to Environment settings → Spaces
   - For each space, configure a preview URL domain

## Setup Steps

### 1. Create Custom App in Kontent.ai

1. Navigate to your Kontent.ai environment
2. Go to **Environment settings** → **Custom apps**
3. Click **Create new custom app**
4. Fill in the details:
   - **Name**: `Accessibility Scanner` (or your preferred name)
   - **URL**: Your deployment URL (e.g., `https://your-app.up.railway.app`)
   - **Allowed origins**: Add your deployment domain

### 2. Configure API Key Parameter

In the custom app configuration:

1. Click **Add configuration parameter**
2. Set up the parameter:
   - **Parameter name**: `KONTENT_AI_MANAGEMENT_API_KEY`
   - **Type**: String
   - **Value**: Paste your Management API key
   - **Required**: Yes (recommended)

### 3. Enable the Custom App

1. **Activate** the custom app
2. The app should now appear in your Kontent.ai environment

### 4. Open and Test

1. Open the custom app in Kontent.ai
2. Open browser console (F12) to see initialization logs
3. You should see:
   ```
   [Kontent.ai] Detected iframe context - will attempt to load Kontent.ai integration
   [Kontent.ai] ✓ Management API key found - spaces dropdown will be available
   [Kontent.ai] ✓ Environment ID found: your-env-id
   [Spaces] Fetching spaces...
   [Spaces] Received spaces: [...]
   ```
4. The **"Select Space" / "Enter URL"** toggle should appear
5. Click **"Select Space"** to see your spaces with preview URLs

## Troubleshooting

### Dropdown doesn't appear

**Check console logs:**

1. **If you see**: `Running standalone - Kontent.ai integration disabled`
   - ❌ You're accessing the app directly (not through Kontent.ai)
   - ✅ Open it as a custom app in Kontent.ai instead

2. **If you see**: `✗ No Management API key found in config`
   - ❌ The API key parameter isn't configured
   - ✅ Add `KONTENT_AI_MANAGEMENT_API_KEY` parameter in custom app settings

3. **If you see**: `[Spaces] Received spaces: []`
   - ❌ No spaces have preview URLs configured
   - ✅ Configure preview URL domains for your spaces

### API returns empty array

This means:
- API key is working ✓
- But no spaces have preview URLs configured
- Go to **Environment settings** → **Spaces** → Configure preview domains

### "Failed to initialize custom app SDK" error

- Make sure your deployment URL is accessible
- Check CORS settings (should allow Kontent.ai domains)
- Verify the app is opened within Kontent.ai, not directly

## How It Works

1. **Detection**: App detects it's running in an iframe (`window.self !== window.top`)
2. **SDK Init**: Loads Kontent.ai Custom App SDK via postMessage
3. **Context**: Retrieves environment ID and configuration from Kontent.ai
4. **API Call**: Fetches spaces using Management API with the configured key
5. **Display**: Shows dropdown with all spaces that have preview URLs

## Deployment Platforms Tested

- ✅ Railway.app
- ✅ Render.com
- ✅ Replit
- ✅ Should work on any platform (Vercel, Heroku, AWS, etc.)

The SDK uses postMessage for communication, so the hosting location doesn't matter!

## Security Notes

- Management API key is stored securely in Kontent.ai custom app config
- Key is never exposed in client code or URLs
- App only receives the key when running inside Kontent.ai iframe
- API calls include environment ID validation
