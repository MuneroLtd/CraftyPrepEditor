# Dependencies: Project Setup and Configuration

**Task ID**: task-001
**Last Updated**: 2025-10-04

---

## Task Dependencies

### Prerequisite Tasks
- **None** - This is the first task in Sprint 1

### Dependent Tasks
- **task-002**: Basic UI Layout and Routing (depends on project structure from task-001)
- **task-003**: File Upload Component (depends on React setup from task-001)
- **All subsequent tasks**: Entire sprint depends on this foundation

---

## Technical Dependencies

### System Requirements

**Required Software**:
- Node.js 18+ (LTS recommended)
- npm 9+ (comes with Node.js)
- Git 2.x

**Optional But Recommended**:
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
  - Playwright Test for VS Code

**Operating System**:
- Linux (primary - current environment)
- macOS (supported)
- Windows with WSL2 (supported)

### npm Packages

**Production Dependencies** (installed in ./src/):
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

**Development Dependencies** (installed in ./src/):

**Build & Tooling**:
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "typescript": "^5.3.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/node": "^20.0.0"
}
```

**Styling**:
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "@tailwindcss/forms": "^0.5.7",
  "@tailwindcss/typography": "^0.5.10"
}
```

**Testing**:
```json
{
  "vitest": "^1.0.0",
  "@vitest/ui": "^1.0.0",
  "jsdom": "^23.0.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "@playwright/test": "^1.40.0"
}
```

**Code Quality**:
```json
{
  "eslint": "^8.55.0",
  "@typescript-eslint/eslint-plugin": "^6.14.0",
  "@typescript-eslint/parser": "^6.14.0",
  "eslint-plugin-react": "^7.33.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^3.1.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-prettier": "^5.0.0"
}
```

**Git Hooks**:
```json
{
  "husky": "^8.0.0",
  "lint-staged": "^15.2.0"
}
```

**UI Components (shadcn/ui foundation)**:
```json
{
  "@radix-ui/react-slot": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### External Dependencies

**CDN/External Resources**:
- **None** - All dependencies bundled locally per security requirements

**APIs**:
- **None** - MVP is fully client-side

**Services**:
- **None** - No backend or external services required

---

## Infrastructure Dependencies

### Deployment Infrastructure

**Current Environment**:
- Docker support (for future deployment)
- Traefik reverse proxy (traefik_demosrv network)
- Domain: craftyprep.demosrv.uk

**Required for Deployment** (Sprint 3):
- nginx:alpine Docker image
- Traefik network access
- TLS certificates (via Traefik/Let's Encrypt)

**Not Required for Task-001**:
- Docker (dev work happens locally with Vite)
- Deployment will be configured in Sprint 3

### Development Environment

**Local Development**:
- Vite dev server (no Docker needed)
- Port 5173 available
- File system access for hot-reload

**Testing Environment**:
- Headless browser support (for Playwright)
- Sufficient RAM for parallel tests (2GB+ recommended)

---

## Configuration Dependencies

### Environment Variables

**Not required for task-001** - No .env files needed yet

**Future tasks may require**:
- `VITE_APP_TITLE` - App title
- `VITE_APP_VERSION` - Version number

### Configuration Files

**Must be created in ./src/**:
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `playwright.config.ts` - E2E test configuration

**Auto-generated**:
- `tsconfig.node.json` - Node TypeScript config (by Vite)
- `postcss.config.js` - PostCSS config (by Tailwind init)

---

## Knowledge Dependencies

### Required Knowledge

**Essential**:
- React fundamentals (components, hooks, JSX)
- TypeScript basics (types, interfaces)
- Vite configuration
- npm/package management

**Helpful**:
- Tailwind CSS utility classes
- Vitest testing framework
- Playwright E2E testing
- ESLint and Prettier configuration

### Documentation References

**Must Read**:
- `.autoflow/docs/ARCHITECTURE.md` - Technology stack decisions
- `.autoflow/docs/ARCHITECTURE.md#development-environment` - Dev tools setup
- `.autoflow/LOCAL_CONFIG.md` - Project-specific configuration
- `PROJECT_STRUCTURE.md` - File organization standards

**Reference During Implementation**:
- [Vite Documentation](https://vitejs.dev/guide/) - Build tool config
- [React Documentation](https://react.dev/) - React 18 features
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript syntax
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility classes
- [Vitest Guide](https://vitest.dev/guide/) - Testing framework
- [Playwright Docs](https://playwright.dev/) - E2E testing

---

## Dependency Installation Order

### Step-by-Step Installation

**1. Create Directory Structure**:
```bash
mkdir -p ./src
```

**2. Initialize Vite Project**:
```bash
cd ./src
npm create vite@latest . -- --template react-ts
```
This installs:
- React 18+
- TypeScript 5+
- Vite 5+
- Basic dev server setup

**3. Install Styling Dependencies**:
```bash
cd ./src
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init -p
```

**4. Install Testing Dependencies**:
```bash
cd ./src
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npx playwright install chromium
```

**5. Install Code Quality Tools**:
```bash
cd ./src
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

**6. Install Git Hooks**:
```bash
cd ./src
npm install -D husky lint-staged
npx husky init
```

**7. Install UI Component Dependencies**:
```bash
cd ./src
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

**Total Installation Time**: ~5-10 minutes (depending on network speed)

---

## Dependency Conflicts

### Known Conflicts

**None expected** - All dependencies are compatible

**Potential Issues**:
- **Node.js version**: Must be 18+ for Vite 5
  - Solution: Use nvm to install Node 18 or higher
- **npm version**: Must be 9+ for package-lock v3
  - Solution: `npm install -g npm@latest`

### Version Pinning

**Strategy**: Use caret (^) ranges for flexibility
- Allows patch and minor updates
- Prevents breaking major updates
- Lock file (`package-lock.json`) ensures consistency

**Critical Pins** (if issues arise):
- React 18.x - Don't upgrade to 19 until stable
- TypeScript 5.x - Stay on 5.x for compatibility
- Vite 5.x - Major versions can have breaking changes

---

## Dependency Verification

### Post-Installation Checks

**Verify installations**:
```bash
cd ./src

# Check Node version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Check installed packages
npm list --depth=0
# Expected: All dependencies listed, no warnings

# Check for vulnerabilities
npm audit
# Expected: 0 critical vulnerabilities
```

**Verify scripts work**:
```bash
cd ./src

npm run dev        # Dev server starts
npm run build      # Build succeeds
npm test          # Tests run
npm run lint      # Linting works
npm run typecheck # Type checking works
```

---

## Dependency Updates

### Update Strategy

**For task-001**: Use latest stable versions at time of implementation

**Future updates**:
- Run `npm outdated` monthly
- Update patch versions automatically (via dependabot/renovate)
- Review minor/major updates before applying
- Test thoroughly after updates

**Security Updates**:
- Apply immediately if critical
- Run `npm audit fix` for automated fixes
- Manual review for breaking changes

---

## Troubleshooting

### Common Dependency Issues

**Issue**: npm install fails
```bash
# Solution 1: Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Use legacy peer deps
npm install --legacy-peer-deps
```

**Issue**: Playwright browsers not installed
```bash
# Solution: Install browsers manually
cd ./src
npx playwright install
```

**Issue**: Husky hooks not working
```bash
# Solution: Reinstall hooks
cd ./src
npm run prepare
```

**Issue**: TypeScript errors in node_modules
```bash
# Solution: Skip lib check
# Already configured in tsconfig.json with "skipLibCheck": true
```

---

## Dependency Checklist

### Before Starting Implementation

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Git configured
- [ ] Sufficient disk space (2GB+)
- [ ] Internet connection for package downloads

### During Implementation

- [ ] All packages installed successfully
- [ ] No critical vulnerabilities in `npm audit`
- [ ] package-lock.json committed to git
- [ ] All npm scripts working

### After Implementation

- [ ] Dependencies documented in package.json
- [ ] Version ranges appropriate (^ for flexibility)
- [ ] No unused dependencies
- [ ] Dependency tree reasonable size (<500MB node_modules)

---

**Next Step**: Execute task plan with `/build` command
