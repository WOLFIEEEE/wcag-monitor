# WCAG Monitor - Accessibility Testing Platform

A production-ready accessibility monitoring platform built with Next.js, Hapi.js, MongoDB, and Pa11y. Designed for easy deployment on Coolify with Docker Compose.

## Features

- **Automated Accessibility Testing** - WCAG 2.0/2.1 compliance testing with Pa11y
- **User Authentication** - JWT-based auth with email/password
- **Modern Dashboard** - Built with Next.js 16 and Mantine UI
- **Scheduled Scans** - Automated cron-based scanning
- **Detailed Reports** - Issue tracking, trends, and exportable reports
- **Advanced Configuration** - Custom actions, headers, authentication, and more
- **Docker Ready** - Optimized for Coolify deployment

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, TypeScript, Mantine UI |
| Backend | Node.js 22, Hapi.js, JWT (jose) |
| Database | MongoDB 7.0 |
| Testing | Pa11y (headless Chrome) |
| Deployment | Docker Compose, Coolify |

## Quick Start with Coolify

### Prerequisites

- Coolify instance with Docker support
- GitHub/GitLab repository access
- Domain name (optional, Coolify provides subdomain)

### Deployment Steps

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Coolify**
   - Log into your Coolify dashboard
   - Click "New Resource" → "Docker Compose"
   - Select your Git repository
   - Choose the branch (main/master)
   - Coolify will auto-detect `docker-compose.yml`

3. **Configure Environment Variables**
   
   In Coolify UI, add these environment variables:
   
   **Required:**
   ```env
   JWT_SECRET=your-secure-random-string-here
   JWT_REFRESH_SECRET=another-secure-random-string-here
   FRONTEND_URL=https://your-domain.com
   NEXT_PUBLIC_API_URL=https://your-domain.com
   ```

   **Optional:**
   ```env
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   RESEND_API_KEY=re_...
   FREE_URL_LIMIT=2
   CRON=0 30 0 * * *
   ```

4. **Configure Domains**
   - Set your custom domain or use Coolify's subdomain
   - Coolify handles SSL/HTTPS automatically
   - Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to match your domain

5. **Deploy**
   - Click "Deploy" in Coolify
   - Coolify will build and start all services
   - Monitor logs during deployment
   - Access your app at the configured domain

### First Time Setup

After deployment:

1. Visit your domain
2. Click "Sign Up" to create an account
3. Add your first site to monitor
4. Configure scan settings (actions, headers, etc.)
5. Run your first accessibility scan

## Local Development

### Using Docker Compose

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local values
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Local URLs:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### Using Docker Compose Dev Mode

For development with hot reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Without Docker

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Coolify (Reverse Proxy)         │
│              SSL/HTTPS                  │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼────┐          ┌───▼────┐
│Frontend│          │Backend │
│Next.js │◄────────►│Hapi.js │
│:3001   │          │:3000   │
└────────┘          └───┬────┘
                        │
                    ┌───▼────┐
                    │MongoDB │
                    │:27017  │
                    └────────┘
```

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for signing JWT tokens | Generated random string |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Generated random string |
| `FRONTEND_URL` | Frontend public URL | https://monitor.example.com |
| `NEXT_PUBLIC_API_URL` | Backend API URL (for browser) | https://monitor.example.com |

### Automatic (Docker Network)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE` | MongoDB connection string | mongodb://mongodb:27017/wcag-monitor |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe API key for billing | - |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - |
| `RESEND_API_KEY` | Resend API key for emails | - |
| `FREE_URL_LIMIT` | URLs free users can monitor | 2 |
| `CRON` | Scan schedule (cron format) | 0 30 0 * * * |
| `NUM_WORKERS` | Concurrent scan workers | 2 |
| `NODE_ENV` | Environment mode | production |
| `FRONTEND_PORT` | Frontend port | 3001 |

## API Reference

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/forgot` - Request password reset
- `POST /auth/reset` - Reset password
- `PATCH /auth/profile` - Update profile
- `PATCH /auth/password` - Change password

### Tasks (Sites)

- `GET /tasks` - Get all tasks for user
- `POST /tasks` - Create new task
- `GET /tasks/stats` - Get user statistics
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/run` - Run accessibility scan
- `GET /tasks/:id/results` - Get task results
- `GET /tasks/:id/trend` - Get weekly trend

### Billing

- `POST /billing/checkout` - Create Stripe checkout
- `POST /billing/portal` - Open customer portal
- `POST /billing/webhook` - Stripe webhook handler
- `GET /billing/usage` - Get usage info

### Health

- `GET /health` - Health check endpoint (for Docker)

## Advanced Features

### Custom Actions

Configure pre-test actions like logging in:

```javascript
[
  "navigate to https://example.com/login",
  "set field #username to testuser",
  "set field #password to testpass",
  "click element #submit",
  "wait for element #dashboard to be visible"
]
```

### Custom Headers

Add authorization or custom headers:

```json
{
  "Authorization": "Bearer token123",
  "X-Custom-Header": "value"
}
```

### Hide Elements

Hide dynamic content that causes false positives:

```css
.ad-banner, #chat-widget, .cookie-notice
```

### HTTP Basic Auth

Configure username/password for protected pages

## Monitoring & Maintenance

### Health Checks

- Backend: `GET /health`
- Frontend: `GET /` (Next.js)
- MongoDB: Internal health check

### Logs

View logs in Coolify:
```
Coolify Dashboard → Your App → Logs
```

Or with Docker:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Backups

MongoDB data is persisted in Docker volumes:
- `mongodb_data` - Database files
- `mongodb_config` - MongoDB configuration

To backup:
```bash
docker run --rm --volumes-from wcag-mongodb -v $(pwd):/backup \
  mongo:7.0 mongodump --out /backup/dump
```

## Troubleshooting

### Build Fails

- Check environment variables are set correctly
- Ensure Docker has enough resources (memory/disk)
- Review build logs in Coolify

### Can't Connect to Services

- Verify services are running: `docker-compose ps`
- Check health status: `curl http://localhost:3000/health`
- Review service logs

### MongoDB Connection Issues

- Ensure MongoDB is healthy
- Check DATABASE environment variable
- Verify internal network connectivity

### Scans Failing

- Check backend logs for Pa11y errors
- Ensure Chrome is installed in backend container
- Verify target URL is accessible
- Check timeout and wait settings

## Security Considerations

1. **JWT Secrets** - Use strong random strings (32+ characters)
2. **Environment Variables** - Never commit .env files
3. **HTTPS** - Always use HTTPS in production (Coolify handles this)
4. **MongoDB** - Consider enabling authentication for production
5. **Rate Limiting** - Consider adding rate limiting for public APIs

## License

GPL-3.0 - See LICENSE file for details

## Support

- **Issues**: GitHub Issues
- **Documentation**: This README
- **Coolify Docs**: https://coolify.io/docs

## Acknowledgments

Built with [Pa11y](https://pa11y.org/) - the accessibility testing pal.
