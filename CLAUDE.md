# CraftyPrep - Claude Context

Project context and configuration loaded in every Claude session.

---

## Project Overview

**Description**: A simple React-based image editor for laser engraving preparation. Upload an image, auto-prep it with one click, then refine with sliders and options. No login required, fully client-side processing.

**Tech Stack**:
- Frontend: React 19 + TypeScript 5.x + Vite 7
- Styling: Tailwind CSS 4 + shadcn/ui components
- Testing: Vitest (unit) + Playwright (E2E)
- Deployment: Docker + nginx:alpine + Traefik reverse proxy
- Image Processing: Canvas API (client-side, privacy-focused)

---

## Environment URLs

### Development
```
Primary Dev URL: https://craftyprep.demosrv.uk
Local Dev URL: http://localhost:5173
Port: 5173
```

**IMPORTANT**: Commands use Primary Dev URL by default:
- ✅ `/verify-implementation` → https://craftyprep.demosrv.uk
- ✅ E2E/Playwright tests → https://craftyprep.demosrv.uk
- ✅ Accessibility testing → https://craftyprep.demosrv.uk
- ⚠️  Local Docker development → http://localhost:5173

### Staging
```
Staging URL: N/A
```

### Production
```
Production URL: Configured via .env (not in scope for current build)
```

---

## Common Commands

### Docker-Based Development (Recommended)

**Start Development Server**:
```bash
cd src && docker compose -f docker compose.dev.yml up
```

**Stop Development Server**:
```bash
cd src && docker compose -f docker compose.dev.yml down
```

**Rebuild After Dependency Changes**:
```bash
cd src && docker compose -f docker compose.dev.yml up --build
```

**Run Tests in Docker**:
```bash
cd src && docker compose -f docker compose.dev.yml exec app npm test
cd src && docker compose -f docker compose.dev.yml exec app npm run test:coverage
```

**Run Linting/Type Checking in Docker**:
```bash
cd src && docker compose -f docker compose.dev.yml exec app npm run lint
cd src && docker compose -f docker compose.dev.yml exec app npm run typecheck
```

### Local Development (Alternative - Node.js 20.19+ Required)

**Start Application**:
```bash
# Development server (Vite)
cd src && npm run dev
```

**Run Tests**:
```bash
# All tests (Vitest)
cd src && npm test

# Unit tests with coverage
cd src && npm run test:coverage

# E2E tests (Playwright - requires app running)
cd src && npm run test:e2e

# E2E with UI
cd src && npm run test:e2e:ui
```

**Build Commands**:
```bash
# Production build
cd src && npm run build

# Preview production build
cd src && npm run preview

# Type checking
cd src && npm run typecheck

# Linting
cd src && npm run lint
cd src && npm run lint:fix

# Formatting
cd src && npm run format
```

### Docker Operations

**Build Docker Image**:
```bash
docker build -f src/Dockerfile -t craftyprep:latest src/
```

**Run with Traefik Network**:
```bash
docker run -d \
  --name craftyprep \
  --network traefik_demosrv \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.craftyprep.rule=Host(\`craftyprep.demosrv.uk\`)" \
  -l "traefik.http.routers.craftyprep.entrypoints=websecure" \
  -l "traefik.http.routers.craftyprep.tls.certresolver=letsencrypt" \
  craftyprep:latest
```

---

## Multi-Stage Docker Environments

This project uses Docker for development:

**Development Stage**:
- Hot reload with Vite
- Exposed debugger port: 9229
- Volume mounts for live code updates
- Connected to Traefik network

**Configuration**: `src/docker compose.dev.yml`

---

## Project Structure

```
./
├── .autoflow/              # Auto-flow workflow state and docs
├── .claude/                # Claude Code configuration (global)
├── src/                    # ALL application code, configs, Docker, tests
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── vite.config.ts      # Vite configuration
│   ├── Dockerfile.dev      # Development Docker image
│   ├── docker compose.dev.yml  # Docker compose for dev
│   ├── index.html          # Entry HTML
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities & processing logic
│   ├── styles/             # Global styles
│   └── tests/              # Test files
│       ├── unit/           # Unit tests (Vitest)
│       └── e2e/            # E2E tests (Playwright)
├── README.md
└── CLAUDE.md               # This file (project-specific context)
```

---

## Important Context

### Architecture
- **Client-Side Only**: All image processing in browser (Canvas API)
- **No Backend**: No API, no database, no server-side logic
- **Privacy-Focused**: Data never leaves the browser
- **SPA**: Single-page React application

### Image Processing
- **Algorithms**: Grayscale, histogram equalization, Otsu threshold
- **File Types**: image/jpeg, image/png only
- **Max File Size**: 10MB
- **Default Settings**:
  - Brightness: 0 (Range: -100 to 100)
  - Contrast: 0 (Range: -100 to 100)
  - Threshold: 128 (Range: 0 to 255, auto-calculated by Otsu)

### Deployment
- **Reverse Proxy**: Traefik (traefik_demosrv network)
- **Domain**: craftyprep.demosrv.uk
- **TLS**: Let's Encrypt (via Traefik)
- **Container**: nginx:alpine serving static build

### Browser Requirements
- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required APIs**: Canvas API, File API, Blob API, ES2020 features

### Performance Targets
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <200KB (gzipped)
- 2MB image auto-prep: <3s
- Slider adjustment response: <100ms

### Security
- **Input Validation**: File type and size validation
- **CSP**: Strict Content Security Policy via nginx
- **Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **MIME Type Verification**: Required for all uploads
- **Filename Sanitization**: Enforced

---

## Development Workflow

This project uses Auto-Flow with Claude Code:

```bash
/plan          # Plan next task
/build         # Implement with TDD
/code-review   # Review quality
/test          # Run tests
/commit        # Commit work

# Or automated:
/auto-flow     # Runs full workflow
```

---

## Session Notes

**Always remember**:
- Use Primary Dev URL (https://craftyprep.demosrv.uk) for all testing
- All processing is client-side (Canvas API)
- No backend required (privacy-focused design)
- Container must join `traefik_demosrv` network
- Accessibility: WCAG 2.2 Level AAA compliance required

**Current Sprint**: See .autoflow/TASK.md

**Documentation**: See .autoflow/docs/ for all specifications

---

## Troubleshooting

### Common Issues

**Vite dev server not starting**:
```bash
cd src
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Docker container not accessible**:
```bash
# Verify Traefik network exists
docker network ls | grep traefik_demosrv

# Create if needed
docker network create traefik_demosrv
```

**Canvas not rendering**:
- Check browser console for errors
- Ensure Canvas API is supported
- Verify CORS headers if loading external images

---

**Migrated from**: .autoflow/LOCAL_CONFIG.md
**Last Updated**: 2025-10-04
