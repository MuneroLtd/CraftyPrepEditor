# Task Plan: Basic UI Layout and Routing

**Task ID**: task-002
**Status**: PLANNED
**Estimated Effort**: 3 hours
**Created**: 2025-10-04

---

## Overview

Create the foundational application layout with responsive design using Tailwind CSS. Set up shadcn/ui component library and establish the basic page structure that will host all features.

---

## 5-Phase TDD Implementation

### Phase 1: Test Setup (RED)

**Objective**: Write failing tests for layout components

1. **Create test file structure**:
   - `src/tests/unit/components/Layout.test.tsx`
   - `src/tests/unit/components/Header.test.tsx`
   - `src/tests/unit/components/Footer.test.tsx`

2. **Write failing tests**:
   - **Layout Component Tests**:
     - Renders with semantic HTML5 structure (`<header>`, `<main>`, `<footer>`)
     - Applies correct Tailwind classes for responsive grid
     - Contains proper ARIA landmarks
     - Accepts and renders children

   - **Header Component Tests**:
     - Renders application title
     - Has correct semantic structure
     - Accessible navigation landmarks

   - **Footer Component Tests**:
     - Renders footer content
     - Has correct semantic structure
     - Responsive layout

   - **Responsive Design Tests**:
     - Mobile viewport (320px): Single column layout
     - Tablet viewport (768px): Adjusted spacing
     - Desktop viewport (1024px): Full layout

3. **Run tests → confirm they fail (RED)**:
   ```bash
   npm run test
   ```

---

### Phase 2: Minimal Implementation (GREEN)

**Objective**: Create minimal code to pass tests

1. **Install shadcn/ui**:
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button
   npx shadcn@latest add slider
   ```

2. **Create component files**:
   - `src/components/Layout.tsx`
   - `src/components/Header.tsx`
   - `src/components/Footer.tsx`

3. **Minimal implementation**:
   - Layout: Basic semantic structure with slots for header, main, footer
   - Header: Simple header with app title
   - Footer: Basic footer element
   - Use Tailwind utility classes for basic styling

4. **Update App.tsx**:
   - Replace placeholder with Layout component
   - Import and use new layout structure

5. **Run tests → confirm they pass (GREEN)**:
   ```bash
   npm run test
   ```

---

### Phase 3: Refactor & Edge Cases

**Objective**: Improve quality, handle responsive design, accessibility

1. **Code Quality**:
   - Extract common Tailwind classes to constants/config
   - Ensure single responsibility per component
   - TypeScript types for all props
   - Clear component interfaces

2. **Responsive Design**:
   - Mobile-first approach (start with 320px)
   - Breakpoints:
     - `sm`: 640px (Tailwind default)
     - `md`: 768px
     - `lg`: 1024px
   - Test at each breakpoint
   - Flexbox/Grid for layout
   - Fluid typography

3. **Accessibility (WCAG 2.2 AAA)**:
   - Semantic HTML5 elements
   - ARIA landmarks:
     - `<header>` with `role="banner"`
     - `<main>` with `role="main"`
     - `<footer>` with `role="contentinfo"`
   - Keyboard navigation support
   - Focus indicators (≥3:1 contrast)
   - Skip links for keyboard users
   - Proper heading hierarchy (h1 → h2 → h3)
   - Color contrast ≥7:1 (AAA)

4. **Tailwind Theme Customization**:
   - Customize `tailwind.config.js`:
     - Brand colors
     - Custom fonts
     - Extended spacing scale
     - Custom breakpoints if needed

5. **Edge Cases**:
   - Very small screens (320px)
   - Very large screens (1920px+)
   - Portrait vs landscape orientation
   - Content overflow handling
   - Empty content states

---

### Phase 4: Integration

**Objective**: Integrate with existing app structure

1. **Update App.tsx**:
   - Import Layout, Header, Footer
   - Wrap application content in Layout
   - Ensure proper component hierarchy

2. **Test integration**:
   - Components render correctly together
   - No CSS conflicts
   - Responsive behavior maintained
   - Accessibility maintained

3. **Visual verification**:
   - Run dev server: `npm run dev`
   - Test at multiple viewport sizes
   - Verify responsive breakpoints
   - Check color contrast
   - Test keyboard navigation

4. **Integration tests**:
   - Full layout rendering
   - Component composition
   - Props passing correctly

---

### Phase 5: Documentation & Validation

**Objective**: Document components and validate acceptance criteria

1. **Code Documentation**:
   - JSDoc comments for components
   - Explain WHY for complex logic
   - Props documentation
   - Usage examples

2. **Component documentation**:
   - Document component API
   - List available props
   - Show usage examples
   - Note accessibility features

3. **Validate Acceptance Criteria**:
   - [ ] App root component created with proper TypeScript types
   - [ ] Basic layout structure: header, main content area, footer
   - [ ] Responsive grid/flexbox layout using Tailwind
   - [ ] shadcn/ui components installed and configured (Button, Slider minimum)
   - [ ] Tailwind theme customized (colors, fonts matching design)
   - [ ] Mobile-first responsive design working (breakpoints: 320px, 768px, 1024px)
   - [ ] Semantic HTML5 structure (`<header>`, `<main>`, `<footer>`)
   - [ ] Accessible layout (keyboard navigation, ARIA landmarks)
   - [ ] Tests written and passing (≥80% coverage)
   - [ ] Code review passed

4. **Final testing**:
   - Run full test suite: `npm run test`
   - Check coverage: `npm run test:coverage`
   - Type checking: `npm run typecheck`
   - Linting: `npm run lint`

---

## Files to Create

### Components
- `src/components/Layout.tsx` - Main layout wrapper
- `src/components/Header.tsx` - Application header
- `src/components/Footer.tsx` - Application footer
- `src/components/ui/button.tsx` - shadcn/ui Button (via CLI)
- `src/components/ui/slider.tsx` - shadcn/ui Slider (via CLI)

### Tests
- `src/tests/unit/components/Layout.test.tsx`
- `src/tests/unit/components/Header.test.tsx`
- `src/tests/unit/components/Footer.test.tsx`

### Configuration
- Update `tailwind.config.js` - Custom theme
- Create `src/lib/utils.ts` - Utility functions (if needed by shadcn/ui)

### Modifications
- `src/App.tsx` - Use new Layout components

---

## Dependencies

### External Packages
- shadcn/ui components (Button, Slider)
- No additional npm packages needed (Tailwind already installed)

### Internal Dependencies
- Existing Tailwind CSS configuration
- Existing Vite + React setup

---

## Success Criteria

1. **Functionality**:
   - Layout renders correctly
   - Responsive design works at all breakpoints
   - Components are reusable

2. **Quality**:
   - Test coverage ≥80%
   - No TypeScript errors
   - No linting errors
   - Accessible (WCAG 2.2 AAA)

3. **Performance**:
   - Fast initial render
   - No layout shifts
   - Optimized Tailwind bundle

---

## Risks & Mitigation

**Risk**: shadcn/ui setup complexity
- **Mitigation**: Follow official documentation exactly, test incrementally

**Risk**: Responsive design edge cases
- **Mitigation**: Test at multiple viewport sizes, use browser DevTools

**Risk**: Accessibility violations
- **Mitigation**: Use semantic HTML, test with keyboard, run axe-core

---

## Timeline Breakdown

- Phase 1 (Test Setup): 30 minutes
- Phase 2 (Implementation): 45 minutes
- Phase 3 (Refactor): 45 minutes
- Phase 4 (Integration): 30 minutes
- Phase 5 (Documentation): 30 minutes

**Total**: 3 hours
