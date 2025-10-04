# Acceptance Criteria: Project Setup and Configuration

**Task ID**: task-001
**Last Updated**: 2025-10-04

---

## Functional Criteria

### 1. Project Structure Created
- [ ] `./src/` directory exists and contains all application files
- [ ] Root directory contains ONLY: .autoflow/, .claude/, .git/, .gitignore, README.md
- [ ] Directory structure matches PROJECT_STRUCTURE.md standards
- [ ] All configuration files located in `./src/`

### 2. Dependencies Installed
- [ ] package.json exists in `./src/` with all required dependencies
- [ ] React 18.3+ installed
- [ ] TypeScript 5.x installed
- [ ] Vite 5.x installed
- [ ] Tailwind CSS 3.x installed
- [ ] All dev dependencies installed (testing, linting, formatting)
- [ ] node_modules directory exists in `./src/`

### 3. Configuration Files Working
- [ ] `./src/vite.config.ts` - Vite configured with React plugin and path aliases
- [ ] `./src/tsconfig.json` - TypeScript strict mode enabled, paths configured
- [ ] `./src/tailwind.config.js` - Tailwind configured for ./src/ content
- [ ] `./src/.eslintrc.json` - ESLint configured with TypeScript and React rules
- [ ] `./src/.prettierrc` - Prettier configured
- [ ] `./src/playwright.config.ts` - Playwright E2E test config

### 4. Development Server
- [ ] `npm run dev` starts Vite dev server successfully
- [ ] Server runs on port 5173 (as per LOCAL_CONFIG.md)
- [ ] Hot Module Replacement (HMR) works
- [ ] App renders "CraftyPrep" title
- [ ] Tailwind CSS styles applied correctly

### 5. Build System
- [ ] `npm run build` creates production bundle successfully
- [ ] Build output in `./src/dist/` directory
- [ ] `npm run preview` serves production build
- [ ] Bundle size reasonable (<500KB initial load)

### 6. Testing Framework
- [ ] Vitest configured and working
- [ ] `npm test` runs unit tests successfully
- [ ] Test setup file exists: `./src/tests/setup.ts`
- [ ] Sample unit test passes: `./src/tests/unit/setup.test.ts`
- [ ] Playwright configured for E2E tests
- [ ] `npm run test:e2e` runs E2E tests successfully
- [ ] Sample E2E test passes: `./src/tests/e2e/app.spec.ts`

### 7. Code Quality Tools
- [ ] ESLint configured with TypeScript support
- [ ] `npm run lint` checks code with no errors
- [ ] Prettier configured
- [ ] `npm run format` formats code successfully
- [ ] `npm run typecheck` validates TypeScript with no errors
- [ ] Pre-commit hook prevents commits with errors

### 8. UI Framework
- [ ] Tailwind CSS utility classes working in components
- [ ] Global styles file exists: `./src/src/styles/index.css`
- [ ] Tailwind directives (@tailwind base, components, utilities) loaded
- [ ] shadcn/ui dependencies installed (Radix UI primitives)

---

## Technical Criteria

### Performance
- [ ] Dev server starts in <5 seconds
- [ ] HMR updates in <500ms
- [ ] Production build completes in <30 seconds
- [ ] Initial bundle size <500KB (gzipped <150KB)

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] No ESLint errors or warnings
- [ ] All files formatted with Prettier
- [ ] No unused imports or variables
- [ ] Type coverage: 100% (strict mode)

### Testing
- [ ] Test coverage ≥80% for setup files
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Test execution time <10 seconds (unit)
- [ ] E2E test execution time <30 seconds

### Browser Compatibility
- [ ] App runs in Chrome 90+
- [ ] App runs in Firefox 88+
- [ ] App runs in Safari 14+
- [ ] App runs in Edge 90+

---

## Definition of Done

### Code Complete
- [ ] All code written and reviewed
- [ ] All configuration files created
- [ ] No placeholder or TODO comments
- [ ] Code follows project conventions

### Tests Passing
- [ ] All unit tests passing (100%)
- [ ] All E2E tests passing (100%)
- [ ] No flaky tests
- [ ] Test coverage ≥80%

### Quality Gates
- [ ] `npm run lint` - 0 errors, 0 warnings
- [ ] `npm run typecheck` - 0 errors
- [ ] `npm run format` - all files formatted
- [ ] Pre-commit hook working

### Build & Deploy Ready
- [ ] `npm run build` succeeds
- [ ] Production bundle loads correctly
- [ ] No console errors in production build
- [ ] Assets optimized (images, fonts)

### Documentation
- [ ] Code comments explain WHY, not WHAT
- [ ] Complex logic documented
- [ ] Configuration files have explanatory comments
- [ ] README.md in ./src/ with setup instructions

### Integration
- [ ] All npm scripts working
- [ ] Git hooks configured and working
- [ ] Development workflow documented
- [ ] No broken imports or missing dependencies

---

## Validation Checklist

Run these commands to validate acceptance criteria:

```bash
# Navigate to application root
cd ./src

# 1. Install dependencies
npm install

# 2. Run type checking
npm run typecheck
# Expected: 0 errors

# 3. Run linting
npm run lint
# Expected: 0 errors, 0 warnings

# 4. Format code
npm run format
# Expected: All files formatted

# 5. Run unit tests
npm test
# Expected: All tests pass, coverage ≥80%

# 6. Run unit tests with coverage
npm run test:coverage
# Expected: Coverage report shows ≥80%

# 7. Build production bundle
npm run build
# Expected: Build succeeds, dist/ folder created

# 8. Preview production build
npm run preview
# Expected: Server starts, app loads at http://localhost:4173

# 9. Run E2E tests
npm run test:e2e
# Expected: All E2E tests pass

# 10. Start development server
npm run dev
# Expected: Server starts at http://localhost:5173, app renders
```

---

## User Acceptance

### Manual Testing
1. **Open app**: Navigate to http://localhost:5173
   - [ ] App loads without errors
   - [ ] "CraftyPrep" title displays
   - [ ] Page styled correctly (Tailwind working)

2. **Check console**: Open browser dev tools
   - [ ] No errors in console
   - [ ] No warnings in console
   - [ ] React DevTools shows React 18

3. **Test HMR**: Edit `./src/src/App.tsx`
   - [ ] Changes reflect immediately
   - [ ] No page refresh required
   - [ ] State preserved during HMR

4. **Build and preview**:
   - [ ] `npm run build` completes
   - [ ] `npm run preview` serves app
   - [ ] Production app works identically

---

## Non-Functional Requirements

### Maintainability
- [ ] Clear separation of concerns
- [ ] Consistent file naming conventions
- [ ] Logical directory structure
- [ ] No circular dependencies

### Scalability
- [ ] Configuration supports environment variables
- [ ] Easy to add new components/features
- [ ] Test structure supports growth
- [ ] Build system supports code splitting

### Developer Experience
- [ ] Fast dev server startup
- [ ] Quick HMR updates
- [ ] Helpful error messages
- [ ] Auto-formatting on save (recommended)
- [ ] Type checking in IDE

### Security
- [ ] No secrets in code
- [ ] Dependencies have no critical vulnerabilities
- [ ] TypeScript strict mode prevents common errors
- [ ] ESLint rules prevent security issues

---

## Success Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Dev server startup | <5s | ___ | ⏳ |
| HMR update time | <500ms | ___ | ⏳ |
| Production build time | <30s | ___ | ⏳ |
| Initial bundle size | <500KB | ___ | ⏳ |
| Gzipped bundle size | <150KB | ___ | ⏳ |
| Unit test coverage | ≥80% | ___ | ⏳ |
| Unit test execution | <10s | ___ | ⏳ |
| E2E test execution | <30s | ___ | ⏳ |
| Type errors | 0 | ___ | ⏳ |
| Lint errors | 0 | ___ | ⏳ |

---

## Acceptance Sign-Off

**Criteria Met**: ___ / ___ (to be filled after testing)

**Approved By**: (Auto-flow system)
**Date**: (After all criteria validated)

**Next Task**: task-002 (Basic UI Layout and Routing)
