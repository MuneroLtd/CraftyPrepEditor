# Research: Basic UI Layout and Routing

**Task ID**: task-002
**Status**: PLANNED
**Created**: 2025-10-04

---

## shadcn/ui Setup

### Official Documentation
- **URL**: https://ui.shadcn.com/docs/installation/vite
- **Framework**: React + Vite (our stack)
- **Styling**: Tailwind CSS (already configured)

### Installation Process

#### Step 1: Initialize shadcn/ui
```bash
npx shadcn@latest init
```

**Interactive Prompts** (expected):
- TypeScript: Yes (we're using TypeScript)
- Style: Default
- Base color: Slate (or custom)
- CSS variables: Yes (recommended)
- Tailwind config: `tailwind.config.js` (already exists)
- Components directory: `src/components`
- Utils: `src/lib/utils.ts`
- React Server Components: No (we're using client-side React)
- Import alias: `@/` (standard)

**Files Created**:
- `src/lib/utils.ts` - Utility functions (cn helper)
- `src/components/ui/` - UI components directory
- Updates to `tailwind.config.js` (adds content paths, theme)

#### Step 2: Install Components
```bash
# Button component
npx shadcn@latest add button

# Slider component
npx shadcn@latest add slider
```

**Files Created per Component**:
- `src/components/ui/button.tsx` - Button component with variants
- `src/components/ui/slider.tsx` - Slider component

### Component Architecture

#### Button Component Features
- Multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: default, sm, lg, icon
- TypeScript props interface
- Accessible: ARIA attributes, keyboard support
- Styled with Tailwind + cva (class-variance-authority)

#### Slider Component Features
- Based on Radix UI Slider
- Accessible: ARIA attributes, keyboard support (arrow keys)
- Customizable: min, max, step
- TypeScript props interface
- Styled with Tailwind

---

## Responsive Design Patterns

### Mobile-First Approach

**Philosophy**: Start with mobile (320px), progressively enhance for larger screens

**Tailwind Breakpoints** (default):
- No prefix: 0px+ (mobile)
- `sm:`: 640px+ (large mobile / small tablet)
- `md:`: 768px+ (tablet)
- `lg:`: 1024px+ (desktop)
- `xl:`: 1280px+ (large desktop)
- `2xl:`: 1536px+ (extra large)

**Our Target Breakpoints**:
- 320px: Base mobile (minimum)
- 768px: Tablet
- 1024px: Desktop

### Layout Patterns

#### Flexbox Layout (Recommended for this task)
```tsx
// Mobile: vertical stack
<div className="flex flex-col">
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>

// Desktop: possible adjustments
<div className="flex flex-col min-h-screen">
  <header className="sticky top-0">...</header>
  <main className="flex-1">...</main>
  <footer className="mt-auto">...</footer>
</div>
```

#### CSS Grid Alternative
```tsx
<div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>
```

### Responsive Typography
```tsx
// Mobile-first fluid typography
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Title
</h1>

// With line-height for readability
<p className="text-base leading-relaxed md:text-lg">
  Content
</p>
```

### Container Patterns
```tsx
// Max-width container with padding
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* Content */}
</div>

// Alternative: direct max-width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## Tailwind CSS Configuration

### Custom Theme

**Current Configuration** (`tailwind.config.js`):
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

**Recommended Customizations**:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // ... more colors
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        // ... custom fonts
      },
      spacing: {
        // Custom spacing if needed
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

**Note**: shadcn/ui init will add CSS variables for theming

---

## Accessibility (WCAG 2.2 AAA)

### Semantic HTML5 Elements

**Header**:
```tsx
<header role="banner" className="...">
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation */}
  </nav>
</header>
```

**Main**:
```tsx
<main role="main" id="main-content" className="...">
  {/* Main content */}
</main>
```

**Footer**:
```tsx
<footer role="contentinfo" className="...">
  {/* Footer content */}
</footer>
```

### Skip Link Pattern
```tsx
// At top of layout, before header
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
>
  Skip to main content
</a>
```

### Focus Indicators
```css
/* In Tailwind config or global CSS */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-600;
}
```

Or with Tailwind classes:
```tsx
<button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
  Button
</button>
```

### Color Contrast Requirements

**AAA Level**:
- Normal text (< 18pt): 7:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 4.5:1 contrast ratio
- Focus indicators: 3:1 contrast ratio

**Testing Tools**:
- Chrome DevTools (Inspect → Contrast ratio)
- WebAIM Contrast Checker
- Lighthouse audit

### ARIA Landmarks

Modern semantic HTML provides implicit landmarks, but explicit roles ensure compatibility:

```tsx
<div className="layout">
  {/* Skip link */}
  <a href="#main-content" className="skip-link">Skip to main content</a>

  {/* Header with implicit banner role */}
  <header className="...">
    <nav aria-label="Main navigation">...</nav>
  </header>

  {/* Main with explicit role for clarity */}
  <main id="main-content" role="main" className="...">
    {children}
  </main>

  {/* Footer with implicit contentinfo role */}
  <footer className="...">
    ...
  </footer>
</div>
```

---

## Component Patterns

### Layout Component
```tsx
// src/components/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
```

### Header Component
```tsx
// src/components/Header.tsx
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          CraftyPrep
        </h1>
      </div>
    </header>
  );
}
```

### Footer Component
```tsx
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-gray-600 text-center">
          © 2025 CraftyPrep. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

---

## Testing Patterns

### Component Testing with Vitest + Testing Library

```tsx
// src/tests/unit/components/Layout.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from '@/components/Layout';

describe('Layout', () => {
  it('renders with semantic structure', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    // Check for semantic elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('renders skip link', () => {
    render(<Layout><div>Test</div></Layout>);

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders children in main element', () => {
    render(
      <Layout>
        <div data-testid="child">Test content</div>
      </Layout>
    );

    const main = screen.getByRole('main');
    const child = screen.getByTestId('child');
    expect(main).toContainElement(child);
  });
});
```

### Responsive Testing
```tsx
it('applies responsive classes', () => {
  render(<Layout><div>Test</div></Layout>);

  const main = screen.getByRole('main');
  // Check for Tailwind classes (exact implementation will vary)
  expect(main.className).toMatch(/container/);
  expect(main.className).toMatch(/mx-auto/);
});
```

---

## Performance Considerations

### CSS Optimization
- Tailwind automatically purges unused CSS in production
- Use JIT mode (enabled by default in Tailwind 3+)
- Minimize custom CSS

### Component Optimization
- Use React.memo() for components that don't change often
- Avoid unnecessary re-renders
- Keep components small and focused

### Bundle Size
- shadcn/ui uses copy-paste approach (no runtime dependencies beyond Radix UI)
- Tree-shaking removes unused code
- Vite optimizes bundles automatically

---

## Common Pitfalls & Solutions

### Pitfall 1: Tailwind Classes Not Applying
**Cause**: Content paths in `tailwind.config.js` don't include all files
**Solution**: Ensure `content: ["./src/**/*.{js,ts,jsx,tsx}"]` includes all component files

### Pitfall 2: Focus Indicators Not Visible
**Cause**: Browser default outline removed without replacement
**Solution**: Always provide focus styles, use `:focus-visible` for better UX

### Pitfall 3: Layout Shifts on Load
**Cause**: Unstyled content flash, images without dimensions
**Solution**: Use `min-h-screen` on layout, set image dimensions

### Pitfall 4: Accessibility Issues
**Cause**: Missing semantic HTML, no ARIA labels
**Solution**: Use semantic elements first, ARIA as supplement

### Pitfall 5: Responsive Design Not Working
**Cause**: Missing viewport meta tag
**Solution**: Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` in `index.html`

---

## Resources

### Official Documentation
- shadcn/ui: https://ui.shadcn.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/docs/primitives
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/

### Tools
- Tailwind Play: https://play.tailwindcss.com/
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Lighthouse (Chrome DevTools): Built-in
- axe DevTools: Browser extension

### Examples
- shadcn/ui Examples: https://ui.shadcn.com/examples
- Tailwind UI: https://tailwindui.com/ (paid, but has free examples)

---

## Decision Log

### Decision 1: Use Flexbox over Grid for Layout
**Rationale**: Simpler for this basic layout, better browser support, easier to understand
**Alternative Considered**: CSS Grid
**Trade-offs**: Grid more powerful for complex layouts, but overkill here

### Decision 2: Use shadcn/ui over Other Libraries
**Rationale**: Copy-paste approach (no bloat), accessible, Tailwind-native, TypeScript support
**Alternative Considered**: Headless UI, Radix UI directly, Chakra UI
**Trade-offs**: Less comprehensive than full libraries, but better control and smaller bundle

### Decision 3: Mobile-First Responsive Design
**Rationale**: Industry best practice, better performance on mobile, easier to enhance upward
**Alternative Considered**: Desktop-first
**Trade-offs**: None significant; mobile-first is standard

### Decision 4: Semantic HTML5 Over ARIA Roles
**Rationale**: Modern HTML5 elements provide implicit roles, cleaner code, better semantics
**Alternative Considered**: Divs with explicit ARIA roles
**Trade-offs**: Some older screen readers may benefit from explicit roles, but modern practice favors semantic HTML

---

## Next Steps After Research

1. Initialize shadcn/ui: `npx shadcn@latest init`
2. Install Button and Slider components
3. Create Layout, Header, Footer components
4. Write tests (TDD approach)
5. Customize Tailwind theme
6. Validate accessibility
7. Test responsiveness at all breakpoints
