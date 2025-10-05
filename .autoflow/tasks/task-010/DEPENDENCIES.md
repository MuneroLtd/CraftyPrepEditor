# Dependencies: CI Pipeline and Testing Setup

**Task ID**: task-010
**Created**: 2025-10-05

---

## Task Dependencies

### Completed Tasks (Required)

- ✅ **task-001**: Project Setup and Configuration
  - **Why**: Provides npm scripts (lint, typecheck, test) that CI executes
  - **Files Used**: `src/package.json`, `src/tsconfig.json`, `src/vite.config.ts`

- ✅ **task-002**: Basic UI Layout and Routing
  - **Why**: Provides UI components tested by E2E
  - **Files Used**: `src/components/*`

- ✅ **task-003**: File Upload Component
  - **Why**: E2E test uploads image via file input
  - **Files Used**: `src/components/FileUpload/*`

- ✅ **task-004**: Image Canvas and Preview Display
  - **Why**: E2E test verifies preview canvases
  - **Files Used**: `src/components/ImageCanvas.tsx`

- ✅ **task-005**: Grayscale Conversion Algorithm
  - **Why**: Part of auto-prep pipeline tested by E2E
  - **Files Used**: `src/lib/processing/grayscale.ts`

- ✅ **task-006**: Histogram Equalization Algorithm
  - **Why**: Part of auto-prep pipeline tested by E2E
  - **Files Used**: `src/lib/processing/histogram.ts`

- ✅ **task-007**: Otsu's Threshold Algorithm
  - **Why**: Part of auto-prep pipeline tested by E2E
  - **Files Used**: `src/lib/processing/otsu.ts`

- ✅ **task-008**: Auto-Prep Button and Processing Flow
  - **Why**: E2E test clicks Auto-Prep button
  - **Files Used**: `src/components/AutoPrepButton.tsx`

- ✅ **task-009**: PNG Export and Download
  - **Why**: E2E test triggers and verifies download
  - **Files Used**: `src/components/DownloadButton.tsx`

---

## Technical Dependencies

### GitHub Repository

- **Requirement**: GitHub repository exists and is accessible
- **Purpose**: Host GitHub Actions workflows
- **Setup**: Repository should be created and code pushed
- **Verification**: `git remote -v` shows GitHub URL

### Node.js and npm

- **Requirement**: Node.js 20.x LTS
- **Purpose**: CI workflow execution environment
- **Setup**: GitHub Actions uses `actions/setup-node@v4`
- **Verification**: Workflow specifies `node-version: '20'`

### npm Scripts

- **Requirement**: All npm scripts defined in `src/package.json`
- **Scripts Used**:
  - `npm run lint` - ESLint checking
  - `npm run typecheck` - TypeScript type checking
  - `npm test` - Vitest unit tests
  - `npm run test:coverage` - Vitest with coverage
  - `npm run test:e2e` - Playwright E2E tests
- **Verification**: Run each script locally to ensure working

### Playwright

- **Requirement**: Playwright already installed in `package.json`
- **Version**: Latest stable (currently ~1.40+)
- **Purpose**: E2E testing framework
- **Setup**: `npx playwright install --with-deps chromium`
- **Verification**: `npx playwright --version`

### Development Server

- **Requirement**: Live development server at `https://craftyprep.demosrv.uk`
- **Purpose**: Target URL for E2E tests
- **Setup**: Docker container running and accessible via Traefik
- **Verification**: `curl https://craftyprep.demosrv.uk` returns 200 OK

### Test Fixtures

- **Requirement**: Test image files for E2E tests
- **Files Needed**: `src/tests/fixtures/sample-image.jpg` (500KB)
- **Purpose**: Upload test for E2E workflow
- **Setup**: Create fixtures directory and add test image
- **Verification**: File exists and is valid JPEG

---

## External Service Dependencies

### GitHub Actions

- **Service**: GitHub Actions (free for public repos, limited for private)
- **Purpose**: CI/CD execution environment
- **Limits**: 2,000 minutes/month for free tier
- **Cost**: Free for public repos
- **Availability**: 99.9% uptime SLA

### GitHub Artifacts

- **Service**: GitHub Actions Artifacts
- **Purpose**: Store test results, screenshots, videos
- **Limits**: 500MB per artifact, 90-day retention
- **Cost**: Included in GitHub Actions
- **Usage**: Upload Playwright reports on failure

---

## Configuration Dependencies

### Environment Variables

**CI Environment**:
- `CI=true` - Set automatically by GitHub Actions
- `NODE_ENV=test` - For test-specific configurations

**No Secrets Required**: This task doesn't require any GitHub Secrets

### File Structure Dependencies

**Required Directories**:
- `.github/workflows/` - CI workflow files
- `src/tests/e2e/` - E2E test files
- `src/tests/fixtures/` - Test fixtures
- `src/playwright-report/` - Playwright output (created automatically)

**Required Files**:
- `.github/workflows/test.yml` - CI workflow (created in this task)
- `src/playwright.config.ts` - Playwright config (created in this task)
- `src/tests/e2e/happy-path.spec.ts` - E2E test (created in this task)
- `src/tests/fixtures/sample-image.jpg` - Test fixture (created in this task)

---

## Documentation Dependencies

### Reference Documentation

- **TESTING.md**: `.autoflow/docs/TESTING.md`
  - Section: Continuous Integration (CI)
  - Contains CI workflow example
  - Contains E2E test examples

- **ARCHITECTURE.md**: `.autoflow/docs/ARCHITECTURE.md`
  - Section: Development Tools
  - Describes testing stack

- **Docker Best Practices**: `~/.claude/DOCKER_BEST_PRACTICES.md`
  - Reference for CI Docker usage (if needed)

---

## Blocking Dependencies

### Critical Blockers

**None**: All dependencies are met. All previous tasks (001-009) are COMPLETE.

### Potential Blockers

1. **Development Server Down**:
   - **Impact**: E2E tests will fail
   - **Resolution**: Ensure Docker container running at `https://craftyprep.demosrv.uk`
   - **Verification**: `curl https://craftyprep.demosrv.uk`

2. **GitHub Repository Access**:
   - **Impact**: Cannot push workflows
   - **Resolution**: Ensure GitHub repo created and accessible
   - **Verification**: `git push origin main`

3. **Playwright Installation Failure**:
   - **Impact**: E2E tests cannot run
   - **Resolution**: Install browsers with `npx playwright install --with-deps`
   - **Verification**: `npx playwright test --list`

---

## Dependency Installation Steps

### Step 1: Verify Repository

```bash
# Check GitHub remote
git remote -v

# If not set, add GitHub remote
git remote add origin https://github.com/[username]/craftyprep.git
```

### Step 2: Verify Development Server

```bash
# Check server is accessible
curl -I https://craftyprep.demosrv.uk

# Expected: HTTP/2 200
```

### Step 3: Create Test Fixture

```bash
# Create fixtures directory
mkdir -p src/tests/fixtures

# Add test image (500KB JPEG)
# Copy a sample image or use curl to download
curl -o src/tests/fixtures/sample-image.jpg \
  https://via.placeholder.com/1024x768.jpg
```

### Step 4: Verify npm Scripts

```bash
cd src

# Verify all scripts work
npm run lint
npm run typecheck
npm test
npm run test:coverage

# All should pass
```

### Step 5: Install Playwright Browsers

```bash
cd src

# Install Playwright browsers
npx playwright install --with-deps chromium
```

---

## Dependency Matrix

| Dependency | Type | Status | Required For | Verification |
|------------|------|--------|--------------|--------------|
| task-001 to task-009 | Task | ✅ COMPLETE | All features | Task status |
| GitHub repo | External | ✅ EXISTS | CI workflow | `git remote -v` |
| Node.js 20 | Runtime | ✅ AVAILABLE | CI execution | GitHub Actions |
| Playwright | Package | ✅ INSTALLED | E2E tests | `package.json` |
| Dev server | Service | ✅ RUNNING | E2E tests | `curl` |
| Test fixtures | File | ⚠️ TO CREATE | E2E tests | File exists |
| npm scripts | Config | ✅ CONFIGURED | CI steps | Run locally |

---

## Post-Task Dependencies

**Tasks That Will Depend on This**:
- Future tasks requiring CI validation
- Deployment tasks (may reference CI status)
- Sprint 2 tasks (will use same CI infrastructure)

**Impact on Sprint**:
- This is the final task in Sprint 1
- Sprint 1 completion depends on this task
- Sprint 2 will build on CI infrastructure

---

## Dependency Risks

### Low Risk

- GitHub Actions availability (99.9% uptime)
- Playwright stability (mature, widely used)
- npm package availability (cached on CI)

### Medium Risk

- Development server availability (manual management)
  - **Mitigation**: Add health check before E2E tests
  - **Fallback**: Skip E2E tests if server unavailable (notify)

### No Risk

- All code dependencies met (tasks 001-009 complete)
- All technical dependencies available
- No external API dependencies

---

## Dependency Validation Checklist

Before starting implementation:

- [ ] All tasks 001-009 marked COMPLETE
- [ ] GitHub repository created and accessible
- [ ] Development server running at https://craftyprep.demosrv.uk
- [ ] npm scripts (lint, typecheck, test) all passing
- [ ] Playwright installed in package.json
- [ ] Test fixtures directory created
- [ ] Sample test image available (or ready to create)
- [ ] All documentation read (TESTING.md CI section)

---

**Status**: All dependencies satisfied ✅
**Ready to Implement**: YES
**Blockers**: None
