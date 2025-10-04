# Deployment and Infrastructure

## Infrastructure Architecture

### Deployment Platform

**Target Environment**: Existing server infrastructure (demosrv.uk)

**Stack**:
- **Host**: demosrv.uk server
- **Reverse Proxy**: Traefik (existing traefik_demosrv network)
- **Web Server**: nginx (Alpine-based Docker container)
- **Domain**: craftyprep.demosrv.uk
- **Protocol**: HTTPS (TLS via Traefik Let's Encrypt)

**Architecture Diagram**:
```
Internet
   │
   ▼
[Traefik Reverse Proxy]
   │ traefik_demosrv network
   │ SSL/TLS Termination
   │ Let's Encrypt Auto-Renewal
   ▼
[nginx Container: craftyprep]
   │ Serves static files
   │ SPA routing (fallback to index.html)
   │ Security headers
   ▼
React SPA (static files)
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Deployment architecture defined

---

## Environment Strategy

### Development Environment

**Local Setup**:
```bash
# Prerequisites
- Node.js 18+
- npm 9+
- Git

# Setup
git clone <repository>
cd craftyprep.com/src
npm install

# Run dev server
npm run dev

# Access: http://localhost:5173
```

**Environment Variables** (`.env.development`):
```bash
VITE_APP_ENV=development
VITE_APP_VERSION=dev
```

**Features**:
- Hot Module Replacement (HMR)
- Fast startup (<1 second)
- Source maps enabled
- React DevTools support

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (Foundation & Core Processing)
- **Tasks**: To be planned
- **Status**: Local development environment specified

---

### Staging Environment (Optional)

**Purpose**: Pre-production testing

**Configuration**:
- Separate Docker container
- Subdomain: staging.craftyprep.demosrv.uk (optional)
- Production build, test data
- Manual testing before production deployment

---
**Implementation**: Not Tracked
- **Sprint**: Optional (not in MVP scope)
- **Status**: Staging environment optional for MVP

---

### Production Environment

**Domain**: craftyprep.demosrv.uk

**Environment Variables** (`.env.production`):
```bash
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

**Configuration**:
- Optimized production build
- Minified assets
- Source maps disabled (or external)
- Security headers enabled
- Monitoring enabled

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Production environment configuration defined

---

## Docker Configuration

### Dockerfile

```dockerfile
# Multi-stage build for optimal image size

# ============================================
# Stage 1: Build
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM nginx:alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name craftyprep.demosrv.uk;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json image/svg+xml;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;

    # Remove server version
    server_tokens off;

    # SPA routing (fallback to index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable cache for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.9'

services:
  craftyprep:
    build:
      context: ./src
      dockerfile: Dockerfile
    container_name: craftyprep
    restart: unless-stopped
    networks:
      - traefik_demosrv
    labels:
      # Traefik configuration
      - "traefik.enable=true"
      - "traefik.http.routers.craftyprep.rule=Host(`craftyprep.demosrv.uk`)"
      - "traefik.http.routers.craftyprep.entrypoints=websecure"
      - "traefik.http.routers.craftyprep.tls=true"
      - "traefik.http.routers.craftyprep.tls.certresolver=letsencrypt"
      - "traefik.http.services.craftyprep.loadbalancer.server.port=80"

      # Security headers (additional layer)
      - "traefik.http.middlewares.craftyprep-headers.headers.customFrameOptionsValue=DENY"
      - "traefik.http.middlewares.craftyprep-headers.headers.contentTypeNosniff=true"
      - "traefik.http.middlewares.craftyprep-headers.headers.browserXssFilter=true"
      - "traefik.http.middlewares.craftyprep-headers.headers.stsSeconds=31536000"
      - "traefik.http.middlewares.craftyprep-headers.headers.stsIncludeSubdomains=true"
      - "traefik.http.routers.craftyprep.middlewares=craftyprep-headers"

    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  traefik_demosrv:
    external: true
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Docker configuration complete

---

## CI/CD Pipeline

### Build Pipeline

```yaml
# .github/workflows/build.yml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: ./src/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: ./src

      - name: Lint
        run: npm run lint
        working-directory: ./src

      - name: Type check
        run: npm run typecheck
        working-directory: ./src

      - name: Unit tests
        run: npm test -- --coverage
        working-directory: ./src

      - name: Build
        run: npm run build
        working-directory: ./src

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: src/dist
```

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Registry (optional)
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: |
          docker build -t craftyprep:latest -f src/Dockerfile src/

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/craftyprep
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: CI/CD pipeline configuration defined

---

## Deployment Strategy

### Manual Deployment (Initial)

**Steps**:
1. **Build locally**:
   ```bash
   cd src
   npm run build
   ```

2. **Build Docker image**:
   ```bash
   docker build -t craftyprep:1.0.0 -f src/Dockerfile src/
   ```

3. **Deploy to server**:
   ```bash
   # SSH to server
   ssh user@demosrv.uk

   # Navigate to deployment directory
   cd /opt/craftyprep

   # Pull latest code
   git pull origin main

   # Start container
   docker-compose up -d --build
   ```

4. **Verify deployment**:
   ```bash
   # Check container status
   docker ps | grep craftyprep

   # Check logs
   docker logs craftyprep

   # Test health check
   curl http://localhost/health

   # Test HTTPS
   curl https://craftyprep.demosrv.uk
   ```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Manual deployment process defined

---

### Automated Deployment (Future)

**Options**:
1. **GitHub Actions**: Push to main → auto-deploy
2. **Watchtower**: Auto-update containers on image changes
3. **Portainer**: Web UI for container management

---
**Implementation**: Not Tracked
- **Sprint**: Post-MVP (optional)
- **Status**: Future automation options

---

## Rollback Strategy

### Rollback Procedure

**If deployment fails**:
1. **Stop new container**:
   ```bash
   docker-compose down
   ```

2. **Restore previous version**:
   ```bash
   git checkout <previous-commit>
   docker-compose up -d --build
   ```

3. **Verify restoration**:
   ```bash
   curl https://craftyprep.demosrv.uk
   ```

**Docker image rollback**:
```bash
# Tag images with version numbers
docker tag craftyprep:latest craftyprep:1.0.0

# Roll back to specific version
docker-compose down
docker run -d --name craftyprep craftyprep:1.0.0
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (document in runbook)
- **Tasks**: To be planned
- **Status**: Rollback procedure defined

---

## Monitoring & Alerting

### Monitoring Strategy

**Health Checks**:
- Docker healthcheck (every 30s)
- nginx health endpoint (`/health`)
- Traefik health dashboard

**Logs**:
- nginx access logs: `/var/log/nginx/access.log` (in container)
- nginx error logs: `/var/log/nginx/error.log`
- Docker logs: `docker logs craftyprep`

**Log Management**:
- Log rotation: Max 3 files × 10MB
- Retention: 30 days
- Format: JSON (for parsing)

### Metrics to Monitor

**Application Metrics**:
- Uptime
- Request count
- Response times
- Error rates (4xx, 5xx)

**System Metrics**:
- CPU usage
- Memory usage
- Disk space
- Network I/O

**Availability**:
- HTTP status codes
- SSL certificate expiry
- DNS resolution

### Alerting (Optional)

**Alert Conditions**:
- Container down for >5 minutes
- High error rate (>5% 5xx responses)
- SSL certificate expiring <30 days
- Disk space >80% full

**Alert Channels** (if implemented):
- Email
- Slack/Discord webhook
- SMS (critical only)

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (basic monitoring), Post-MVP (full alerting)
- **Tasks**: To be planned
- **Status**: Monitoring strategy defined, alerting optional

---

## Backup Strategy

### What to Backup

**Code**:
- Git repository (primary backup)
- GitHub remote (secondary backup)

**Configuration**:
- `docker-compose.yml`
- `nginx.conf`
- `.env` files

**No User Data** (by design):
- No database (no data to backup)
- No uploaded files (all client-side)

### Backup Procedure

**Automated** (Git):
```bash
# Daily commit and push (if changes)
git add .
git commit -m "Auto-backup: $(date +%Y-%m-%d)"
git push origin main
```

**Manual** (Configuration):
```bash
# Backup configuration files
tar -czf backup-$(date +%Y%m%d).tar.gz \
  docker-compose.yml \
  src/nginx.conf \
  src/Dockerfile \
  .env.production
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (setup backup script)
- **Tasks**: To be planned
- **Status**: Backup strategy defined (git-based)

---

## Disaster Recovery

### Recovery Scenarios

#### Scenario 1: Container Failure

**Symptoms**: Container crashes or stops

**Recovery**:
```bash
# Restart container
docker-compose restart craftyprep

# If restart fails, rebuild
docker-compose down
docker-compose up -d --build
```

**Recovery Time Objective (RTO)**: <5 minutes

---

#### Scenario 2: Server Failure

**Symptoms**: Server unreachable

**Recovery**:
1. Restore server from backup
2. Install Docker and Docker Compose
3. Clone repository
4. Run `docker-compose up -d`
5. Verify DNS and Traefik routing

**RTO**: <2 hours

---

#### Scenario 3: Data Corruption

**Symptoms**: Application broken, files corrupted

**Recovery**:
1. Git checkout last known good commit
2. Rebuild Docker image
3. Redeploy

**RTO**: <15 minutes

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (document in runbook)
- **Tasks**: To be planned
- **Status**: Disaster recovery procedures defined

---

## Scaling Strategy

### Horizontal Scaling

**Current**: Single container (sufficient for MVP)

**Future Scaling Options**:
1. **Multiple containers**: Docker Compose replicas
2. **Load balancer**: Traefik already supports it
3. **CDN**: Cloudflare or similar for static assets

**Scaling Trigger**:
- >10,000 users/day
- >1 million requests/month
- Response time degradation

### Vertical Scaling

**Current**: Default container resources

**Future Resource Limits**:
```yaml
services:
  craftyprep:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---
**Implementation**: Not Tracked
- **Sprint**: Post-MVP (if needed)
- **Status**: Scaling strategy for future growth

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved
- [ ] Security scan clean (`npm audit`)
- [ ] Lighthouse audits ≥90 (performance, accessibility, best practices)
- [ ] Build succeeds without errors/warnings
- [ ] Docker image builds successfully
- [ ] Environment variables configured

### Deployment

- [ ] Backup current version (git tag)
- [ ] Build Docker image with version tag
- [ ] Deploy to server
- [ ] Verify container starts successfully
- [ ] Check health endpoint (`/health`)
- [ ] Test HTTPS access (`https://craftyprep.demosrv.uk`)
- [ ] Verify Traefik routing
- [ ] Check SSL certificate

### Post-Deployment

- [ ] Smoke test: Upload → Auto-Prep → Download
- [ ] Verify all features functional
- [ ] Check browser console for errors
- [ ] Monitor logs for errors (first 15 minutes)
- [ ] Test on multiple browsers
- [ ] Verify accessibility (keyboard nav, screen reader)
- [ ] Update documentation (if needed)
- [ ] Announce deployment (if applicable)

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Deployment checklist for production launch

---

## Production URLs and Access

**Application**: https://craftyprep.demosrv.uk

**Health Check**: https://craftyprep.demosrv.uk/health

**Traefik Dashboard** (if enabled): https://traefik.demosrv.uk

**Server SSH**: `ssh user@demosrv.uk`

**Docker Logs**: `docker logs craftyprep`

**Docker Stats**: `docker stats craftyprep`

---

This deployment documentation provides everything needed to successfully deploy CraftyPrep to production on the demosrv.uk infrastructure using Docker, nginx, and Traefik.
