# Frontend Dockerfile for WCAG Monitor
# Updated for Coolify 2025/2026 best practices

FROM node:22-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variable for backend proxy
ARG BACKEND_URL=http://backend:3000
ENV BACKEND_URL=$BACKEND_URL

# Build the Next.js app
RUN npm run build

# Production image
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Use port 3000 - Coolify default expected port
EXPOSE 3000

# Environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check - matches the port we expose
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
