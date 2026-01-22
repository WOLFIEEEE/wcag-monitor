# Coolify Deployment Guide (2025/2026 Best Practices)

## ⚡ Quick Fix Checklist

If your deployment shows "healthy" but the URL doesn't work:

1. **Check Service Selection**: In Coolify, ensure the **frontend** service is selected as the main service
2. **Verify Domain Configuration**: Domain must be mapped to the frontend service specifically
3. **Check Port Configuration**: Coolify should route to port `3000` (container's internal port)
4. **Force Redeploy**: After any changes, use "Restart" not just "Deploy"

---

## Prerequisites

- [ ] Coolify v4+ instance running
- [ ] Git repository (GitHub/GitLab) created
- [ ] Domain name configured (or use Coolify auto-generated subdomain)

---

## Step-by-Step Deployment

### Step 1: Push to Git

```bash
cd wcag-monitor
git add .
git commit -m "Fix: Coolify port configuration and labels"
git push origin main
```

### Step 2: Create Docker Compose Resource in Coolify

1. Go to Coolify Dashboard
2. Click **"+ Create"** → **"Docker Compose"**
3. Select your Git source (GitHub/GitLab)
4. Choose repository and branch: `main`
5. Coolify auto-detects `docker-compose.yaml` ✓

### Step 3: Configure Service (CRITICAL)

After creating the resource, you must configure the frontend service:

1. Go to **"Services"** tab
2. Click on **"frontend"** service
3. Under **"Network"** settings:
   - **Port**: Set to `3000`
   - **Domain**: Enter your domain (e.g., `wcag.yourdomain.com`)
4. Enable **"Generate SSL"** if not already enabled

### Step 4: Set Environment Variables

Add these in Coolify under **"Environment Variables"**:

```env
# REQUIRED
JWT_SECRET=<generate-with: openssl rand -base64 32>
JWT_REFRESH_SECRET=<generate-with: openssl rand -base64 32>
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com

# OPTIONAL
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FREE_URL_LIMIT=2
CRON=0 30 0 * * *
NUM_WORKERS=2
```

### Step 5: Deploy

1. Click **"Deploy"** button
2. Monitor build logs for errors
3. Wait for all services to show healthy (~3-5 minutes)
4. Visit your domain!

---

## Architecture

```
                    Internet
                        │
                        ▼
┌─────────────────────────────────────────┐
│             Coolify Traefik             │
│         (SSL/HTTPS Termination)         │
└──────────────────┬──────────────────────┘
                   │
                   ▼ Port 3000
         ┌─────────────────────┐
         │      Frontend       │
         │    (Next.js SSR)    │
         └──────────┬──────────┘
                    │ http://backend:3000
                    ▼
         ┌─────────────────────┐
         │      Backend        │
         │  (Hapi.js + Pa11y)  │
         └──────────┬──────────┘
                    │ mongodb://mongodb:27017
                    ▼
         ┌─────────────────────┐
         │      MongoDB        │
         │   (Persistent)      │
         └─────────────────────┘
```

---

## Service Details

| Service | Internal Port | Exposed | Purpose |
|---------|--------------|---------|---------|
| MongoDB | 27017 | No | Database |
| Backend | 3000 | No | API, Pa11y Scanner |
| Frontend | 3000 | Yes (via Traefik) | Next.js Web App |

---

## Troubleshooting

### ❌ "Healthy" but URL doesn't work

**Cause**: Coolify is routing to the wrong service or port.

**Fix**:
1. In Coolify, go to your application → **"Services"** tab
2. Ensure **"frontend"** is the service with your domain configured
3. Set port to **3000** (not 4000 or 3001)
4. Click **"Restart"** (not just Deploy)

### ❌ Build fails

1. Check Coolify build logs for specific errors
2. Verify all environment variables are set
3. Ensure Docker has sufficient resources (4GB+ RAM)

### ❌ 502 Bad Gateway

**Cause**: Backend is not ready when frontend starts.

**Fix**: The docker-compose.yaml already handles this with `depends_on` + health checks. Wait 2-3 minutes for full startup.

### ❌ Cannot reach /health endpoint

```bash
# SSH into Coolify server and check:
docker ps | grep wcag

# Check frontend logs:
docker logs <frontend-container-id>

# Check backend logs:
docker logs <backend-container-id>
```

### ❌ MongoDB connection errors

1. Check MongoDB container is running
2. Verify `DATABASE` env var is `mongodb://mongodb:27017/wcag-monitor`
3. Check backend logs for connection errors

---

## Health Check Endpoints

```bash
# Frontend (via domain)
curl https://your-domain.com

# Backend health (via frontend proxy)
curl https://your-domain.com/health

# Internal (SSH into server)
docker exec <frontend-container> wget -qO- http://localhost:3000
docker exec <backend-container> wget -qO- http://localhost:3000/health
```

---

## Coolify v4+ Specific Settings

### Service Labels (Already configured in docker-compose.yaml)

```yaml
labels:
  - coolify.managed=true
  - coolify.portLabel=3000
```

### Network Mode

Coolify v4+ automatically creates a bridge network. Our `wcag-network` is for internal service communication.

### Health Checks

All services have health checks that Coolify monitors. If any service becomes unhealthy, Coolify will show warnings.

---

## Scaling & Performance

### Increase Workers
```env
NUM_WORKERS=4
```

### Add Resources (in Coolify)
- CPU: 2+ cores recommended
- RAM: 4GB+ recommended
- Storage: 20GB+ for MongoDB data

### Optimize Scan Schedule
```env
# Scan every 6 hours instead of daily
CRON=0 0 */6 * * *
```

---

## Backup MongoDB

```bash
# Create backup
docker exec <mongodb-container> mongodump --out /backup

# Copy from container
docker cp <mongodb-container>:/backup ./mongodb-backup-$(date +%Y%m%d)
```

---

## Updates

1. Push changes to Git repository
2. In Coolify: Click **"Redeploy"**
3. Or enable **"Auto Deploy"** for automatic deployments on push

---

## Security Checklist

- [ ] Strong JWT secrets (32+ characters, generated)
- [ ] HTTPS enabled (Coolify handles via Traefik)
- [ ] Environment variables in Coolify UI (not committed to code)
- [ ] MongoDB not exposed to internet
- [ ] Regular automated backups configured

---

## Support

- **Coolify Docs**: https://coolify.io/docs
- **Coolify Discord**: https://coollabs.io/discord
- **Pa11y Docs**: https://pa11y.org
- **MongoDB Docs**: https://www.mongodb.com/docs
