# Dependencies: Basic UI Layout and Routing

**Task ID**: task-002
**Status**: PLANNED
**Created**: 2025-10-04

---

## External Dependencies

### Already Installed ✅

#### Core Framework
- **React**: 19.1.1
  - Purpose: UI framework
  - Status: Installed
  - Usage: All components

- **React DOM**: 19.1.1
  - Purpose: DOM rendering
  - Status: Installed
  - Usage: Root rendering

#### Styling
- **Tailwind CSS**: 4.1.14
  - Purpose: Utility-first CSS framework
  - Status: Installed
  - Usage: All styling, responsive design
  - Config: `tailwind.config.js`, `postcss.config.js`

- **Tailwind Merge**: 3.3.1
  - Purpose: Merge Tailwind classes
  - Status: Installed
  - Usage: Component class merging

- **class-variance-authority**: 0.7.1
  - Purpose: Component variants
  - Status: Installed
  - Usage: shadcn/ui components

- **clsx**: 2.1.1
  - Purpose: Conditional class names
  - Status: Installed
  - Usage: Dynamic styling

#### UI Components (Radix UI)
- **@radix-ui/react-slot**: 1.2.3
  - Purpose: Component composition
  - Status: Installed
  - Usage: shadcn/ui base

---

### To Be Installed 📦

#### shadcn/ui Components
- **shadcn/ui CLI**
  - Purpose: Install UI components
  - Installation: `npx shadcn@latest init`
  - Required: Yes

- **Button Component**
  - Purpose: Accessible button component
  - Installation: `npx shadcn@latest add button`
  - Required: Yes (per acceptance criteria)

- **Slider Component**
  - Purpose: Accessible slider component
  - Installation: `npx shadcn@latest add slider`
  - Required: Yes (per acceptance criteria)

---

## Internal Dependencies

### Prerequisite Tasks

#### task-001: Project Initialization ✅
- **Status**: COMMITTED
- **Required Files**:
  - Tailwind CSS configuration
  - TypeScript configuration
  - Vite configuration
  - Package.json with dependencies
- **Dependency Type**: Hard (must be complete)
- **Notes**: Already complete, all configurations in place

---

### Project Files

#### Configuration Files ✅
- `tailwind.config.js` - Tailwind configuration (exists, will be modified)
- `tsconfig.json` - TypeScript configuration (exists)
- `vite.config.ts` - Vite configuration (exists)
- `package.json` - Dependencies (exists)

#### Existing Components
- `src/App.tsx` - Root component (exists, will be modified)
- `src/main.tsx` - Entry point (exists, should not need changes)
- `src/styles/index.css` - Global styles (exists, may need updates)

---

## Directory Structure

### To Be Created

```
src/
├── components/              # New directory for UI components
│   ├── Layout.tsx           # Main layout component
│   ├── Header.tsx           # Header component
│   ├── Footer.tsx           # Footer component
│   └── ui/                  # shadcn/ui components (auto-created)
│       ├── button.tsx       # Button component (via CLI)
│       └── slider.tsx       # Slider component (via CLI)
├── lib/                     # New directory for utilities
│   └── utils.ts             # Utility functions (may be created by shadcn/ui)
└── tests/
    └── unit/
        └── components/      # New directory for component tests
            ├── Layout.test.tsx
            ├── Header.test.tsx
            └── Footer.test.tsx
```

---

## Tool Dependencies

### Development Tools ✅
- **Vitest**: 3.2.4
  - Purpose: Unit testing
  - Status: Installed
  - Usage: Component tests

- **@testing-library/react**: 16.3.0
  - Purpose: React testing utilities
  - Status: Installed
  - Usage: Component testing

- **@testing-library/jest-dom**: 6.9.1
  - Purpose: DOM matchers
  - Status: Installed
  - Usage: Test assertions

- **TypeScript**: 5.9.3
  - Purpose: Type checking
  - Status: Installed
  - Usage: Type safety

- **ESLint**: 9.37.0
  - Purpose: Code linting
  - Status: Installed
  - Usage: Code quality

---

## Browser Dependencies

### Target Browsers
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Android
- **Accessibility**: Screen readers (NVDA, JAWS, VoiceOver)

### Browser APIs Required
- CSS Grid & Flexbox (widely supported)
- CSS Custom Properties (widely supported)
- ES6+ JavaScript (handled by Vite transpilation)

---

## Design Documentation Dependencies

### Documentation References
- `.autoflow/docs/FUNCTIONAL.md#responsive-user-interface`
  - Purpose: UI requirements and specifications
  - Status: Available
  - Usage: Design reference

- `.autoflow/docs/ARCHITECTURE.md#ui-framework-and-styling`
  - Purpose: Architecture decisions
  - Status: Available
  - Usage: Technical implementation guidance

- `.autoflow/docs/ACCESSIBILITY.md`
  - Purpose: WCAG 2.2 AAA requirements
  - Status: Available
  - Usage: Accessibility compliance

---

## Installation Order

1. **Initialize shadcn/ui** (one-time setup):
   ```bash
   npx shadcn@latest init
   ```
   - Creates `components/ui` directory
   - Creates `lib/utils.ts`
   - Updates `tailwind.config.js` if needed

2. **Install Button component**:
   ```bash
   npx shadcn@latest add button
   ```
   - Creates `src/components/ui/button.tsx`
   - Installs any missing Radix UI dependencies

3. **Install Slider component**:
   ```bash
   npx shadcn@latest add slider
   ```
   - Creates `src/components/ui/slider.tsx`
   - Installs any missing Radix UI dependencies

---

## Dependency Validation

### Pre-Implementation Checklist
- [x] React 19+ installed
- [x] Tailwind CSS 4+ installed and configured
- [x] TypeScript configured
- [x] Testing library installed
- [x] Vite configured
- [ ] shadcn/ui initialized
- [ ] Button component installed
- [ ] Slider component installed

### Post-Implementation Validation
- [ ] All components import correctly
- [ ] No missing dependency errors
- [ ] Build succeeds: `npm run build`
- [ ] Tests run: `npm run test`
- [ ] Type check passes: `npm run typecheck`

---

## Potential Issues & Solutions

### Issue: shadcn/ui initialization conflicts
**Solution**: Follow official docs exactly, don't modify generated files initially

### Issue: Tailwind class conflicts
**Solution**: Use `tailwind-merge` for class merging, already installed

### Issue: TypeScript type errors with shadcn/ui
**Solution**: Ensure `@types/react` version compatible, already on 19.1.16

### Issue: CSS not applying
**Solution**: Verify Tailwind directives in `src/styles/index.css`, PostCSS configured

---

## Notes

- All major dependencies already installed (task-001 complete)
- Only shadcn/ui components need to be added
- No additional npm packages required
- Focus is on component creation and configuration
