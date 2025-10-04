# Local Development Configuration

**Purpose**: Store project-specific development variables that commands should use instead of defaults.

**Last Updated**: 2025-10-04

**Git Tracking**:
- ✅ **COMMIT THIS FILE** if URLs/config are shared across team
- ❌ **DON'T COMMIT** if contains sensitive credentials
- Consider: `.autoflow/LOCAL_CONFIG.local.md` for truly local overrides (add to .gitignore)

**How Commands Use This**:
- All auto-flow commands read this file first
- Values here override hardcoded defaults
- Update this file when environment changes
- Commands will reference specific sections (e.g., "Primary Dev URL:", "Test commands:")

---

## Application URLs

### Development Environment
```
Primary Dev URL: https://craftyprep.demosrv.uk
Local Dev URL: http://localhost:5173 (Docker)
Port: 5173
```

**Development Deployment**: craftyprep.demosrv.uk (via Traefik on traefik_demosrv network)
**Production**: Configured via .env (not in scope for current build)

**IMPORTANT**: Commands will use Primary Dev URL by default!
- ✅ `/verify-implementation` → https://craftyprep.demosrv.uk
- ✅ E2E/Playwright tests → https://craftyprep.demosrv.uk
- ✅ Accessibility testing → https://craftyprep.demosrv.uk
- ⚠️  Local Docker development → http://localhost:5173

**To change the URL**:
1. Edit "Primary Dev URL:" line above
2. Update to your staging/test environment
3. Commands will automatically use the new URL

### API Endpoints
```
API Base URL: N/A (client-side only)
```

---

## Common Commands

### Docker-Based Development (Recommended)

**Start Development Server**:
```bash
cd src && docker-compose -f docker-compose.dev.yml up
```

**Stop Development Server**:
```bash
cd src && docker-compose -f docker-compose.dev.yml down
```

**Rebuild After Dependency Changes**:
```bash
cd src && docker-compose -f docker-compose.dev.yml up --build
```

**Run Tests in Docker**:
```bash
cd src && docker-compose -f docker-compose.dev.yml exec app npm run test
cd src && docker-compose -f docker-compose.dev.yml exec app npm run test:coverage
```

**Run Linting/Type Checking in Docker**:
```bash
cd src && docker-compose -f docker-compose.dev.yml exec app npm run lint
cd src && docker-compose -f docker-compose.dev.yml exec app npm run typecheck
```

### Local Development (Alternative - Node.js 20.19+ Required)

**Start Application**:
```bash
# Development server (Vite)
cd src && npm run dev

# Alternative: Docker compose (when configured)
docker compose up
```

### Run Tests
```bash
# All tests (Vitest)
cd src && npm test

# Unit tests with coverage
cd src && npm run test:coverage

# E2E tests (Playwright - requires app running)
cd src && npm run test:e2e

# Watch mode for development
cd src && npm run test:watch
```

### Build Commands
```bash
# Production build
cd src && npm run build

# Preview production build
cd src && npm run preview

# Type checking
cd src && npm run typecheck

# Linting
cd src && npm run lint
```

### Docker Operations
```bash
# Build Docker image
docker build -f src/Dockerfile -t craftyprep:latest src/

# Run with Traefik network
docker run -d \
  --name craftyprep \
  --network traefik_demosrv \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.craftyprep.rule=Host(\`craftyprep.demosrv.uk\`)" \
  -l "traefik.http.routers.craftyprep.entrypoints=websecure" \
  -l "traefik.http.routers.craftyprep.tls.certresolver=letsencrypt" \
  craftyprep:latest

# Or use docker-compose (when configured)
docker compose up -d
```

---

## Project Structure

### Source Code Location
```
./src/                  # Application root (to be created in Sprint 1)
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite configuration
├── index.html          # Entry HTML
├── src/                # Source code
│   ├── App.tsx         # Root component
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities & processing logic
│   └── styles/         # Global styles
└── tests/              # Test files
    ├── unit/           # Unit tests (Vitest)
    └── e2e/            # E2E tests (Playwright)
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript 5.x
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui
- **State**: React Context API + Custom Hooks

### Image Processing
- **Canvas API**: Native browser Canvas API
- **Algorithms**: Custom implementations (grayscale, histogram equalization, Otsu threshold)

### Testing
- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright
- **Coverage Target**: ≥80%

### Deployment
- **Container**: Docker + nginx:alpine
- **Reverse Proxy**: Traefik (traefik_demosrv network)
- **Domain**: craftyprep.demosrv.uk
- **TLS**: Let's Encrypt (via Traefik)

---

## Environment Variables

### Development (.env.development)
```bash
# Not needed for MVP (client-side only)
# Future: API keys, analytics, etc.
```

### Production (.env.production)
```bash
# Public variables only (embedded in build)
VITE_APP_TITLE=CraftyPrep
VITE_APP_VERSION=1.0.0
```

---

## Browser Requirements

### Supported Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Safari (iOS 14+) ✅
- Mobile Chrome (Android 10+) ✅

### Required APIs
- Canvas API
- File API
- Blob API
- ES2020 features

---

## Performance Targets

### Load Time
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <200KB (gzipped)

### Processing Time
- 2MB image auto-prep: <3s
- Slider adjustment response: <100ms
- Canvas rendering: 60fps

---

## Security Configuration

### Content Security Policy (nginx)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Input Validation
- File types: image/jpeg, image/png only
- Max file size: 10MB
- MIME type verification required
- Filename sanitization enforced

---

## Development Workflow

### Initial Setup (Sprint 1 - Task 1.1)
```bash
# Create src directory structure
mkdir -p src/src/{components,hooks,lib,styles}
mkdir -p src/tests/{unit,e2e}

# Initialize project
cd src
npm create vite@latest . -- --template react-ts
npm install

# Install dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @shadcn/ui
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
npm install -D eslint prettier husky

# Initialize Tailwind
npx tailwindcss init -p

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

### Daily Development
```bash
# Start dev server
cd src && npm run dev

# Run tests in watch mode
cd src && npm run test:watch

# Type check
cd src && npm run typecheck
```

### Pre-Deployment
```bash
# Run all checks
cd src && npm run lint
cd src && npm run typecheck
cd src && npm run test:coverage
cd src && npm run build

# Build Docker image
docker build -f src/Dockerfile -t craftyprep:latest src/

# Test locally
docker run -p 8080:80 craftyprep:latest
# Visit: http://localhost:8080
```

---

## Deployment Configuration

### Traefik Labels (docker-compose.yml)
```yaml
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
      - "traefik.enable=true"
      - "traefik.http.routers.craftyprep.rule=Host(`craftyprep.demosrv.uk`)"
      - "traefik.http.routers.craftyprep.entrypoints=websecure"
      - "traefik.http.routers.craftyprep.tls.certresolver=letsencrypt"
      - "traefik.http.services.craftyprep.loadbalancer.server.port=80"

networks:
  traefik_demosrv:
    external: true
```

### Nginx Configuration (nginx.conf in src/)
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing (fallback to index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Important Notes

1. **Always use Primary Dev URL** (https://craftyprep.demosrv.uk) for:
   - E2E testing with Playwright
   - Accessibility testing
   - Manual testing
   - Demonstration/verification

2. **Use Local URL** (http://localhost:5173) only when:
   - Running Vite dev server locally
   - Debugging with breakpoints
   - Development without internet

3. **No Backend Required**:
   - All processing client-side
   - No API endpoints needed
   - No database configuration
   - Privacy-focused (data never leaves browser)

4. **Traefik Network**:
   - Container must join `traefik_demosrv` network
   - TLS certificates managed by Traefik
   - Automatic HTTPS redirect

5. **File Storage**:
   - No persistent storage needed (MVP)
   - localStorage for settings (Sprint 3)
   - All files processed in-memory

---

## Custom Project Variables

### Image Processing Defaults
```javascript
// Default processing settings
const DEFAULT_SETTINGS = {
  brightness: 0,      // Range: -100 to 100
  contrast: 0,        // Range: -100 to 100
  threshold: 128,     // Range: 0 to 255 (auto-calculated by Otsu)
  maxFileSize: 10485760,  // 10MB in bytes
  allowedTypes: ['image/jpeg', 'image/png']
};
```

### Material Presets (Sprint 3)
```javascript
// Example presets for different materials
const MATERIAL_PRESETS = {
  wood: { brightness: 10, contrast: 20, threshold: 'auto' },
  acrylic: { brightness: -5, contrast: 30, threshold: 'auto' },
  leather: { brightness: 15, contrast: 15, threshold: 'auto' }
};
```

---

## Troubleshooting

### Common Issues

**Issue**: Vite dev server not starting
```bash
# Solution: Clear node_modules and reinstall
cd src
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Issue**: Docker container not accessible
```bash
# Solution: Verify Traefik network exists
docker network ls | grep traefik_demosrv

# If not exists, create it:
docker network create traefik_demosrv
```

**Issue**: Canvas not rendering
```bash
# Solution: Check browser console for errors
# Ensure Canvas API is supported
# Verify CORS headers if loading images from external source
```

---

**Usage in Commands**:
- All auto-flow commands should read this file
- Use these values instead of hardcoded defaults
- Update this file when environment changes
- Reference: `Read .autoflow/LOCAL_CONFIG.md for URLs and configuration`

---

**Created by**: /setup-local-config command
**Project**: CraftyPrep - Laser Engraving Image Prep Tool
**Date**: 2025-10-04
