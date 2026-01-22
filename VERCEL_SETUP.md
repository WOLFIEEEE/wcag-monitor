# WCAG Monitor - Vercel Deployment Guide

Deploy the Next.js frontend to Vercel for global edge deployment.

## Prerequisites

- Vercel account
- Backend API deployed on Coolify (see `COOLIFY_SETUP.txt`)
- Custom domain configured (recommended)

## Quick Start

### 1. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 2. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` | Your backend API URL on Coolify |

### 3. Domain Configuration

1. Add your domain in Vercel Dashboard → Settings → Domains
2. Configure DNS according to Vercel instructions
3. SSL is automatic

## Backend Configuration

Your Coolify backend must be configured to accept requests from Vercel:

```bash
# In Coolify environment variables:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Architecture

```
┌─────────────────────────────────────┐
│           VERCEL (Edge)             │
│  Frontend: https://yourdomain.com   │
└─────────────────┬───────────────────┘
                  │ API calls
                  ▼
┌─────────────────────────────────────┐
│            COOLIFY (VPS)            │
│  Backend: https://api.yourdomain.com│
│  MongoDB: internal                  │
└─────────────────────────────────────┘
```

## Troubleshooting

**CORS Errors**: Ensure `ALLOWED_ORIGINS` in Coolify includes your Vercel domain(s).

**API Not Found**: Verify `NEXT_PUBLIC_API_URL` is set correctly (no trailing slash).

**Build Fails**: Check Node.js version compatibility (requires Node 22+).
