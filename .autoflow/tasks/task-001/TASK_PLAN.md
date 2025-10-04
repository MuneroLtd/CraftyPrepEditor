# Task Plan: Project Setup and Configuration

**Task ID**: task-001
**Priority**: HIGH
**Estimated Effort**: 4 hours
**Status**: PLANNED

---

## Overview

Initialize the React + TypeScript + Vite project with complete development tooling including Tailwind CSS, shadcn/ui, testing frameworks, and code quality tools.

**Critical Requirement**: ALL files must be created in `./src/` directory per PROJECT_STRUCTURE.md. The root directory should contain ONLY: .autoflow/, .claude/, .git/, .gitignore, README.md

---

## Implementation Approach: 5-Phase TDD

### Phase 1: Red (Write Failing Tests)

**Objective**: Define expected behavior through tests before implementation

**Steps**:
1. Create test structure in `./src/tests/`
2. Write tests for project initialization validation:
   - Test that package.json exists with correct dependencies
   - Test that TypeScript config is valid
   - Test that Vite can build successfully
   - Test that Tailwind CSS is configured

**Test Files** (to be created):
- `./src/tests/unit/setup.test.ts` - Project setup validation tests
- `./src/tests/e2e/app.spec.ts` - Basic E2E smoke test

**Expected Result**: All tests fail (red) because implementation doesn't exist yet

---

### Phase 2: Green (Minimal Implementation)

**Objective**: Make tests pass with minimal code

**Step 1: Create Project Structure**
```bash
# Create src directory (application root)
mkdir -p ./src

# Create application subdirectories inside src
mkdir -p ./src/src/{components,hooks,lib,styles}
mkdir -p ./src/tests/{unit,e2e}
mkdir -p ./src/public
```

**Step 2: Initialize Vite + React + TypeScript**
```bash
cd ./src
npm create vite@latest . -- --template react-ts
```

**Step 3: Install Core Dependencies**
```bash
cd ./src

# Production dependencies
npm install

# Development dependencies - Styling
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography

# Development dependencies - Testing
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test

# Development dependencies - Code Quality
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D husky lint-staged

# Development dependencies - UI Components (shadcn/ui)
npm install -D @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

**Step 4: Initialize Tailwind CSS**
```bash
cd ./src
npx tailwindcss init -p
```

**Step 5: Configure Files** (create in ./src/)

Create `./src/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `./src/vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
```

Create `./src/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `./src/.eslintrc.json`:
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

Create `./src/.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Create `./src/playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 6: Update package.json scripts** (in ./src/package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "typecheck": "tsc --noEmit",
    "prepare": "cd .. && husky install src/.husky"
  }
}
```

**Step 7: Initialize Git Hooks**
```bash
cd ./src
npx husky init
echo "npm run lint && npm run typecheck" > .husky/pre-commit
```

**Step 8: Create Basic App Structure**

Create `./src/src/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `./src/src/App.tsx`:
```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">
        CraftyPrep - Laser Engraving Image Prep
      </h1>
    </div>
  );
}

export default App;
```

Update `./src/src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Expected Result**: Tests now pass (green)

---

### Phase 3: Refactor (Improve Code Quality)

**Objective**: Improve code organization and maintainability

**Steps**:
1. Run linter and fix issues:
   ```bash
   cd ./src
   npm run lint:fix
   ```

2. Run formatter:
   ```bash
   cd ./src
   npm run format
   ```

3. Verify type checking:
   ```bash
   cd ./src
   npm run typecheck
   ```

4. Run tests to ensure nothing broke:
   ```bash
   cd ./src
   npm test
   ```

**Expected Result**: Clean code, no lint/type errors, all tests passing

---

### Phase 4: Integrate (Connect Components)

**Objective**: Ensure all tools work together

**Steps**:
1. Build production bundle:
   ```bash
   cd ./src
   npm run build
   ```

2. Test production preview:
   ```bash
   cd ./src
   npm run preview
   ```

3. Run E2E tests:
   ```bash
   cd ./src
   npm run test:e2e
   ```

4. Verify all scripts work:
   - `npm run dev` - Dev server starts on port 5173
   - `npm run build` - Production build succeeds
   - `npm test` - Unit tests pass
   - `npm run lint` - No errors
   - `npm run typecheck` - No type errors

**Expected Result**: Complete development environment working end-to-end

---

### Phase 5: Document (Add Comments and Docs)

**Objective**: Document setup and configuration

**Steps**:
1. Add comments to config files explaining key settings
2. Create `./src/README.md` with:
   - Project setup instructions
   - Available scripts
   - Development workflow
   - Testing guidelines

**Expected Result**: Well-documented setup for team members

---

## File Locations Summary

**ALL files created in ./src/ directory**:

```
./src/                          # Application root
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── playwright.config.ts        # Playwright E2E config
├── index.html                  # Entry HTML
├── .husky/                     # Git hooks
│   └── pre-commit              # Pre-commit hook
├── src/                        # Application source
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   └── styles/                 # Styles
│       └── index.css           # Global styles with Tailwind
├── tests/                      # Test files
│   ├── setup.ts                # Test setup
│   ├── unit/                   # Unit tests
│   │   └── setup.test.ts       # Setup validation tests
│   └── e2e/                    # E2E tests
│       └── app.spec.ts         # Basic smoke test
└── public/                     # Static assets
```

**Root directory remains minimal**:
```
./                              # Project root
├── .autoflow/                  # Auto-flow state
├── .claude/                    # Claude config
├── .git/                       # Git repository
├── .gitignore                  # Git ignores
├── README.md                   # Project overview
└── src/                        # ENTIRE APPLICATION
```

---

## Implementation Checklist

### Phase 1: Red (Tests)
- [ ] Create `./src/tests/unit/setup.test.ts`
- [ ] Create `./src/tests/e2e/app.spec.ts`
- [ ] Run tests - confirm they fail

### Phase 2: Green (Implementation)
- [ ] Create `./src/` directory structure
- [ ] Initialize Vite + React + TypeScript in `./src/`
- [ ] Install all dependencies
- [ ] Configure Tailwind CSS
- [ ] Create all config files in `./src/`
- [ ] Update package.json scripts
- [ ] Initialize Husky git hooks
- [ ] Create basic App structure
- [ ] Run tests - confirm they pass

### Phase 3: Refactor (Quality)
- [ ] Run `npm run lint:fix`
- [ ] Run `npm run format`
- [ ] Run `npm run typecheck`
- [ ] Verify all tests still pass

### Phase 4: Integrate (E2E)
- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` - app loads
- [ ] Run `npm run test:e2e` - E2E tests pass
- [ ] Verify all npm scripts work

### Phase 5: Document
- [ ] Add comments to configs
- [ ] Create `./src/README.md`
- [ ] Document development workflow

---

## Key Decisions

1. **Vite over Create React App**: Faster dev server, better DX, modern tooling
2. **Vitest over Jest**: Better Vite integration, faster, ESM native
3. **Playwright over Cypress**: Better performance, modern API, TypeScript first
4. **Tailwind over styled-components**: Utility-first, smaller bundle, faster development
5. **shadcn/ui over Material-UI**: Accessible, customizable, copy-paste (no bloat)

---

## Success Criteria

**Must achieve**:
- ✅ React 18 + TypeScript 5 + Vite 5 running
- ✅ Tailwind CSS working with Vite
- ✅ All config files in ./src/ directory
- ✅ ESLint + Prettier configured and working
- ✅ Vitest unit tests passing
- ✅ Playwright E2E tests passing
- ✅ Git hooks preventing bad commits
- ✅ `npm run dev` starts server on port 5173
- ✅ `npm run build` creates production bundle
- ✅ All tests green, no lint/type errors

**Next Step**: Run `/build` to execute this plan
