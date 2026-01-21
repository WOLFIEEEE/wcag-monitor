# Coolify Deployment Guide

## Quick Deployment Checklist

### 1. Prerequisites
- [ ] Coolify instance running
- [ ] Git repository (GitHub/GitLab) created
- [ ] Domain name (optional)

### 2. Repository Setup
```bash
cd wcag-monitor
git init
git add .
git commit -m "Initial commit: WCAG Monitor for Coolify"
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Coolify Configuration

**Step 1:** Create New Resource
- Go to Coolify Dashboard
- Click "New Resource" → "Docker Compose"
- Select your Git repository
- Choose branch: `main`
- Coolify auto-detects `docker-compose.yml` ✓

**Step 2:** Environment Variables (REQUIRED)

Generate secure secrets:
```bash
# Generate JWT secrets
openssl rand -base64 32
openssl rand -base64 32
```

In Coolify, add these variables:

```env
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
```

Optional variables:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FREE_URL_LIMIT=2
CRON=0 30 0 * * *
NUM_WORKERS=2
```

**Step 3:** Domain Configuration
- Configure custom domain or use Coolify subdomain
- Coolify handles SSL/HTTPS automatically
- Update environment variables with final domain

**Step 4:** Deploy
- Click "Deploy"
- Monitor build logs
- Wait for all services to be healthy (~2-3 minutes)

### 4. Post-Deployment

**Verify Services:**
```bash
# Health check
curl https://your-domain.com/health

# API info
curl https://your-domain.com/api
```

**Create First User:**
1. Visit https://your-domain.com
2. Click "Sign Up"
3. Create account
4. Add first site to monitor

## Architecture

```
Internet
    │
    ▼
┌─────────────────────┐
│ Coolify Proxy       │
│ (SSL/HTTPS)         │
└──────────┬──────────┘
           │
    ┌──────┴───────┐
    │              │
┌───▼───┐      ┌──▼────┐
│Frontend│      │Backend│
│:3001   │◄────►│:3000  │
└────────┘      └───┬───┘
                    │
                ┌───▼────┐
                │MongoDB │
                │:27017  │
                └────────┘
```

## Services

1. **MongoDB** (mongodb:27017)
   - Database storage
   - Persistent volumes
   - Health checked

2. **Backend** (backend:3000)
   - Hapi.js API
   - Pa11y scanner
   - JWT authentication
   - Health endpoint: `/health`

3. **Frontend** (frontend:3001)
   - Next.js app
   - Mantine UI
   - SSR + standalone mode
   - Exposed to internet via Coolify

## Internal Networking

All services communicate via Docker internal network:
- Frontend → Backend: `http://backend:3000`
- Backend → MongoDB: `mongodb://mongodb:27017/wcag-monitor`
- Public URL (browser) → Backend: `https://your-domain.com`

## Volumes

Persistent data in Docker volumes:
- `mongodb_data` - Database files
- `mongodb_config` - MongoDB configuration

## Health Checks

All services have health checks:
- MongoDB: `mongosh --eval "db.adminCommand('ping')"`
- Backend: `wget http://localhost:3000/health`
- Frontend: `wget http://localhost:3001`

## Troubleshooting

### Build Fails
- Check Coolify build logs
- Verify all environment variables are set
- Ensure Docker has resources (4GB+ RAM recommended)

### Services Not Starting
```bash
# Check service status
docker ps

# Check logs
docker logs wcag-backend
docker logs wcag-frontend
docker logs wcag-mongodb
```

### Can't Access Frontend
- Verify domain is configured in Coolify
- Check SSL certificate status
- Ensure FRONTEND_URL matches domain

### Database Connection Errors
- Verify MongoDB is healthy
- Check DATABASE environment variable
- Review backend logs

## Scaling

To handle more load:

1. **Increase workers:**
   ```env
   NUM_WORKERS=4
   ```

2. **Add resources in Coolify:**
   - CPU: 2+ cores recommended
   - RAM: 4GB+ recommended
   - Storage: 20GB+ recommended

3. **Optimize cron:**
   ```env
   # Run scans every 6 hours instead of daily
   CRON=0 0 */6 * * *
   ```

## Backup & Recovery

### Backup MongoDB
```bash
# Create backup
docker exec wcag-mongodb mongodump --out /backup

# Copy from container
docker cp wcag-mongodb:/backup ./mongodb-backup
```

### Restore MongoDB
```bash
# Copy to container
docker cp ./mongodb-backup wcag-mongodb:/backup

# Restore
docker exec wcag-mongodb mongorestore /backup
```

## Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS enabled (Coolify handles)
- [ ] Environment variables in Coolify (not in code)
- [ ] MongoDB not exposed to internet
- [ ] Regular backups configured
- [ ] Strong user passwords enforced

## Updates

To update the application:

1. Push changes to Git repository
2. Coolify auto-deploys (if enabled)
3. Or manually trigger deploy in Coolify UI

## Support

- Coolify Docs: https://coolify.io/docs
- Pa11y Docs: https://pa11y.org
- MongoDB Docs: https://www.mongodb.com/docs
