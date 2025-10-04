# Research Notes: Project Setup and Configuration

**Task ID**: task-001
**Last Updated**: 2025-10-04

---

## Technology Decisions

### React 18 vs React 19

**Decision**: Use React 18.3+ (latest stable in 18.x line)

**Research**:
- React 19 is in canary/beta (as of 2025-10)
- React 18.3 is production-ready and stable
- Key features we need are in React 18:
  - Concurrent rendering
  - Automatic batching
  - Transitions
  - Suspense for data fetching (future)

**Rationale**:
- Stability over bleeding edge
- Ecosystem compatibility guaranteed
- Can upgrade to React 19 when stable

**Sources**:
- .autoflow/docs/ARCHITECTURE.md#frontend-framework
- React 18 is specified in architecture docs

---

### Vite vs Create React App vs Next.js

**Decision**: Use Vite 5+

**Comparison**:

| Feature | Vite | CRA | Next.js |
|---------|------|-----|---------|
| Dev server speed | ⚡ Instant | 🐌 Slow | ⚡ Fast |
| Build speed | ⚡ Fast | 🐌 Slow | ⚡ Fast |
| HMR | ⚡ <500ms | 🐌 1-3s | ⚡ <500ms |
| Bundle size | 📦 Small | 📦 Large | 📦 Small |
| Configuration | ✅ Simple | ❌ Eject needed | ⚙️ Complex |
| TypeScript | ✅ Native | ✅ Native | ✅ Native |
| SSR/SSG | ❌ No | ❌ No | ✅ Yes |

**Rationale**:
- We don't need SSR/SSG (client-side SPA)
- Vite's dev speed critical for productivity
- Smaller learning curve than Next.js
- CRA is deprecated and slow

**Key Features**:
- Native ESM in dev (no bundling)
- Rollup for production (optimized)
- Plugin ecosystem (React Fast Refresh)
- Out-of-box TypeScript support

**Sources**:
- .autoflow/docs/ARCHITECTURE.md#build-tool

---

### TypeScript Configuration

**Decision**: Strict mode enabled

**tsconfig.json Key Settings**:
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Rationale**:
- Catch errors at compile time, not runtime
- Self-documenting code via types
- Better IDE autocomplete and refactoring
- Easier maintenance long-term

**Trade-offs**:
- Slightly slower initial development
- Learning curve for TypeScript
- More verbose code

**Mitigation**:
- Use `any` sparingly and only when truly needed
- Leverage type inference where possible
- Document complex types with comments

---

### Tailwind CSS vs Styled Components vs CSS Modules

**Decision**: Tailwind CSS 3.x

**Comparison**:

| Aspect | Tailwind | Styled-Components | CSS Modules |
|--------|----------|-------------------|-------------|
| Bundle size | 📦 Small (purged) | 📦 Large (runtime) | 📦 Medium |
| Dev speed | ⚡ Fast | 🐌 Slower | 🐌 Slower |
| Learning curve | 📚 Medium | 📚 Low | 📚 Low |
| Customization | ✅ Excellent | ✅ Excellent | ⚙️ Manual |
| Responsive | ✅ Built-in | ⚙️ Manual | ⚙️ Manual |

**Rationale**:
- Utility-first speeds development
- Responsive design built-in (sm:, md:, lg:)
- Small production bundle via PurgeCSS
- Consistent design system
- No CSS-in-JS runtime overhead

**Configuration**:
- Purge unused styles in production
- Customize theme for brand colors (future)
- Use @apply for repeated patterns (sparingly)

**Sources**:
- .autoflow/docs/ARCHITECTURE.md#ui-framework-and-styling

---

### Vitest vs Jest

**Decision**: Vitest 1.x

**Comparison**:

| Feature | Vitest | Jest |
|---------|--------|------|
| Vite integration | ✅ Native | ⚙️ Config needed |
| Speed | ⚡ Fast | 🐌 Slower |
| ESM support | ✅ Native | ⚙️ Experimental |
| Watch mode | ✅ Instant | 🐌 Slow |
| TypeScript | ✅ No config | ⚙️ ts-jest needed |

**Rationale**:
- Native Vite integration (no transform overhead)
- Faster test execution (uses same Vite config)
- Better ESM support (no module mocking issues)
- Jest-compatible API (easy migration if needed)

**Key Features**:
- Instant watch mode (HMR for tests)
- UI mode for debugging
- Coverage via c8 (faster than istanbul)

---

### Playwright vs Cypress vs Selenium

**Decision**: Playwright 1.40+

**Comparison**:

| Feature | Playwright | Cypress | Selenium |
|---------|-----------|---------|----------|
| Multi-browser | ✅ Chrome, FF, Safari | ✅ Chrome, FF, Edge | ✅ All |
| Speed | ⚡ Fast | ⚡ Fast | 🐌 Slow |
| TypeScript | ✅ First-class | ✅ Good | ⚙️ Config |
| Debugging | ✅ Excellent | ✅ Excellent | 🐌 Poor |
| Auto-wait | ✅ Built-in | ✅ Built-in | ❌ Manual |

**Rationale**:
- Better performance than Cypress
- True multi-browser (including WebKit/Safari)
- Modern API with auto-waiting
- TypeScript-first design
- Better for CI/CD

**Configuration**:
- Test against Chromium only (MVP)
- Add Firefox/Safari in Sprint 2
- Use test generator for initial tests
- Parallel execution for speed

---

### ESLint + Prettier Configuration

**Decision**: ESLint with TypeScript + Prettier integration

**Why ESLint**:
- Industry standard for JavaScript/TypeScript
- Plugin ecosystem (React, TypeScript, a11y)
- Configurable rules for team standards
- Auto-fix capabilities

**Why Prettier**:
- Consistent code formatting
- Zero-config (opinionated)
- IDE integration
- Team consistency

**Integration**:
- `eslint-config-prettier` - Disable ESLint formatting rules
- `eslint-plugin-prettier` - Run Prettier as ESLint rule
- Single command: `npm run lint:fix` does both

**Key Rules**:
```json
{
  "react/react-in-jsx-scope": "off",  // Not needed in React 17+
  "prettier/prettier": "error",        // Formatting errors
  "@typescript-eslint/no-unused-vars": "error"
}
```

---

### Git Hooks with Husky

**Decision**: Husky 8.x + lint-staged

**Why Husky**:
- Prevent bad commits entering codebase
- Enforce code quality at commit time
- Zero-config for team members
- Works across OS (Linux, macOS, Windows)

**Pre-commit Hook Strategy**:
```bash
# .husky/pre-commit
npm run lint      # Check for errors
npm run typecheck # Verify types
```

**Trade-offs**:
- Slower commits (adds 2-5 seconds)
- Can be bypassed with --no-verify (intentional escape hatch)

**Best Practices**:
- Run fast checks only (not full test suite)
- Provide clear error messages
- Allow bypass for emergency commits

---

### shadcn/ui vs Material-UI vs Ant Design

**Decision**: shadcn/ui (Radix UI primitives)

**Comparison**:

| Feature | shadcn/ui | Material-UI | Ant Design |
|---------|-----------|-------------|------------|
| Bundle size | 📦 Minimal | 📦 Large | 📦 Large |
| Customization | ✅ Full control | ⚙️ Theme config | ⚙️ Theme config |
| Accessibility | ✅ WCAG AAA | ✅ WCAG AA | ⚙️ Partial |
| Dependencies | 📦 Copy-paste | 📦 Full library | 📦 Full library |

**Rationale**:
- **Copy-paste approach**: No library bloat, only use what you need
- **Built on Radix UI**: Accessible primitives (WCAG 2.2 AAA compliant)
- **Tailwind integration**: Consistent with our styling approach
- **Full customization**: Own the code, modify as needed

**Components We Need** (Sprint 1):
- Button (for Auto-Prep, Download)
- Slider (for refinement controls - Sprint 2)
- Dialog/Modal (for settings - Sprint 3)
- Toast/Alert (for error messages)

**Installation**:
```bash
# Install Radix primitives (foundation)
npm install @radix-ui/react-slot

# Install utility packages
npm install class-variance-authority clsx tailwind-merge

# Then copy/paste components as needed
# (No full library dependency)
```

---

### Directory Structure Research

**Decision**: ./src/ as application root

**Standard Approaches**:

1. **Monorepo style** (Nx, Turborepo):
   ```
   /packages/frontend
   /packages/backend
   ```
   - Overkill for single SPA

2. **Root as app** (most common):
   ```
   /src
   /public
   /tests
   package.json (in root)
   ```
   - Mixes app files with project files

3. **./src/ as app root** (our choice):
   ```
   /.autoflow/      # Project management
   /.claude/        # AI config
   /src/            # ENTIRE APPLICATION
     package.json
     src/
     tests/
   ```
   - Clean separation
   - Easy to deploy (just ./src/)
   - Aligns with PROJECT_STRUCTURE.md

**Rationale**:
- Minimal root directory (only meta-project files)
- All application code in ./src/
- Easy to containerize (COPY ./src/ /app/)
- Follows established PROJECT_STRUCTURE.md standards

---

## Implementation Decisions

### Testing Strategy

**Unit Tests** (Vitest):
- Test processing functions (Sprint 2)
- Test utility functions
- Test custom hooks
- Coverage target: ≥80%

**Integration Tests** (Vitest + React Testing Library):
- Test component interactions
- Test upload → process → export flow
- Test settings persistence (Sprint 3)

**E2E Tests** (Playwright):
- Critical user paths only
- Smoke test for each sprint
- Accessibility checks (WCAG 2.2 AAA)
- Cross-browser (Chrome, Firefox, Safari)

**For task-001**:
- Basic smoke tests only
- Verify app renders
- Verify configs working
- Full testing in subsequent tasks

---

### Development Workflow

**Recommended Flow**:
1. Start dev server: `npm run dev`
2. Make changes to code
3. See instant updates via HMR
4. Run tests in watch mode: `npm test`
5. Pre-commit hook checks quality
6. Commit changes

**Quality Checks**:
```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier
npm test          # Vitest
```

**Build & Preview**:
```bash
npm run build    # Production build
npm run preview  # Test production locally
```

---

### Package.json Scripts

**Essential Scripts**:
```json
{
  "dev": "vite",                          // Dev server
  "build": "tsc && vite build",           // Production build
  "preview": "vite preview",              // Preview production
  "test": "vitest",                       // Unit tests
  "test:e2e": "playwright test",          // E2E tests
  "lint": "eslint . --ext ts,tsx",        // Linting
  "format": "prettier --write \"src/**\"", // Formatting
  "typecheck": "tsc --noEmit"             // Type checking
}
```

**Naming Convention**:
- Use colons for variants: `test:e2e`, `test:coverage`
- Keep names short and memorable
- Follow npm conventions where possible

---

## Alternative Approaches Considered

### Alternative 1: Next.js

**Why Not Next.js**:
- We don't need SSR/SSG (client-side only)
- More complex setup than needed
- Heavier bundle for same functionality
- File-based routing unnecessary (single page)

**When to Consider**:
- If we add server-side processing later
- If SEO becomes important
- If we need API routes

---

### Alternative 2: Create React App

**Why Not CRA**:
- Officially deprecated (React team recommends Vite)
- Slower dev server (webpack-based)
- Requires eject for advanced config
- Larger bundle sizes
- Slower HMR

**Legacy**:
- CRA was standard 2016-2022
- Vite is now the recommended approach

---

### Alternative 3: Parcel

**Why Not Parcel**:
- Less ecosystem support
- Fewer plugins than Vite
- Slower than Vite in benchmarks
- Less TypeScript integration

**When to Consider**:
- For zero-config projects (we need some config)

---

## Key Learnings for Future Tasks

### What Works Well

✅ **Vite + React + TypeScript**:
- Fast dev server critical for productivity
- TypeScript catches bugs early
- Modern tooling improves DX

✅ **Tailwind CSS**:
- Utility-first speeds up styling
- Responsive design built-in
- Small production bundle

✅ **Vitest**:
- Fast test execution
- Instant watch mode
- Great DX

### Potential Challenges

⚠️ **TypeScript Strict Mode**:
- Can slow initial development
- Mitigation: Use type inference, avoid `any`

⚠️ **Tailwind Learning Curve**:
- Utility class memorization needed
- Mitigation: Use Tailwind docs, IDE autocomplete

⚠️ **Playwright Browser Install**:
- Large download (300MB+)
- Mitigation: Only install Chromium initially

---

## Resources

### Documentation
- [Vite Guide](https://vitejs.dev/guide/) - Build tool
- [React Docs](https://react.dev/) - Framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Language
- [Tailwind Docs](https://tailwindcss.com/docs) - Styling
- [Vitest Guide](https://vitest.dev/guide/) - Testing
- [Playwright Docs](https://playwright.dev/) - E2E

### Examples & Templates
- [Vite React TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
- [shadcn/ui examples](https://ui.shadcn.com/examples)

### Community Resources
- [Vite Awesome](https://github.com/vitejs/awesome-vite) - Plugins & tools
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## Decision Log

| Decision | Rationale | Alternatives | Status |
|----------|-----------|--------------|--------|
| React 18 | Stable, ecosystem support | React 19 (beta) | ✅ Final |
| Vite 5 | Fast dev, modern tooling | CRA, Next.js | ✅ Final |
| TypeScript | Type safety, DX | JavaScript | ✅ Final |
| Tailwind | Utility-first, small bundle | styled-components | ✅ Final |
| Vitest | Vite integration, speed | Jest | ✅ Final |
| Playwright | Modern API, multi-browser | Cypress | ✅ Final |
| shadcn/ui | Copy-paste, accessible | Material-UI | ✅ Final |
| ./src/ root | Clean separation | Root as app | ✅ Final |

---

**Research Complete**: All decisions documented and justified
**Next Step**: Implement task plan with `/build` command
