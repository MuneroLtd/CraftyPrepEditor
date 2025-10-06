# Research: Accessibility Audit and Fixes

**Task ID**: task-019
**Sprint**: Sprint 2

---

## WCAG 2.2 Level AAA Overview

### The Four Principles (POUR)

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: UI components and navigation must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must work with current and future assistive technologies

---

## Key WCAG 2.2 AAA Requirements

### 1. Perceivable

#### Text Alternatives (1.1)
- **1.1.1**: All non-text content has text alternatives
  - Images: Descriptive alt text
  - Decorative images: `alt=""`
  - Icons: ARIA labels
  - Canvas elements: aria-label or aria-describedby

#### Color & Contrast (1.4)
- **1.4.6 (AAA)**: Enhanced color contrast
  - Normal text: ≥7:1 ratio
  - Large text (≥18pt or ≥14pt bold): ≥4.5:1 ratio
  - Test with: Chrome DevTools, WebAIM Contrast Checker

- **1.4.11**: Non-text contrast ≥3:1
  - UI components (buttons, form inputs)
  - Graphical objects (icons, focus indicators)

- **1.4.13**: Content on hover/focus
  - Dismissible: Can close with Escape
  - Hoverable: Pointer can move over content
  - Persistent: Stays visible until dismissed

#### Adaptable Content (1.3)
- **1.3.1**: Info and relationships conveyed programmatically
  - Semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`
  - Heading hierarchy: h1 → h2 → h3 (no skips)
  - Form labels: `<label for="id">` or aria-labelledby
  - Lists: `<ul>`, `<ol>`, `<li>`

- **1.3.6 (AAA)**: Identify purpose of UI components
  - Autocomplete attributes on inputs
  - Clear button purposes

---

### 2. Operable

#### Keyboard Accessible (2.1)
- **2.1.1**: All functionality available via keyboard
  - Tab/Shift+Tab: Navigation
  - Enter/Space: Activation
  - Arrow keys: Sliders, menus
  - Escape: Close/cancel

- **2.1.2**: No keyboard traps
  - Can navigate in and out of all components
  - Focus never stuck

- **2.1.3 (AAA)**: No timing requirements for keyboard

#### Focus Indicators (2.4)
- **2.4.7**: Focus indicator visible
  - Minimum 3px outline
  - Minimum 3:1 contrast ratio
  - Visible on ALL focusable elements

- **2.4.11**: Focus not obscured by other content
- **2.4.12**: Focus appearance meets minimum requirements
- **2.4.13 (AAA)**: Focus appearance enhanced

#### Navigation (2.4)
- **2.4.1**: Bypass blocks mechanism (skip links)
- **2.4.2**: Pages have descriptive titles
- **2.4.3**: Focus order is logical
- **2.4.6**: Headings and labels are descriptive

#### Input Modalities (2.5)
- **2.5.5 (AAA)**: Target size ≥24×24 CSS pixels
- **2.5.8**: Target size minimum (baseline requirement)

---

### 3. Understandable

#### Readable (3.1)
- **3.1.1**: Page language identified (`<html lang="en">`)
- **3.1.5 (AAA)**: Reading level appropriate (lower secondary education)

#### Predictable (3.2)
- **3.2.1**: Focus doesn't trigger unexpected context changes
- **3.2.2**: Input doesn't trigger unexpected context changes
- **3.2.3**: Navigation consistent across pages
- **3.2.5 (AAA)**: Changes initiated by user request only

#### Input Assistance (3.3)
- **3.3.1**: Errors identified and described
- **3.3.2**: Labels/instructions provided for inputs
- **3.3.3**: Error suggestions provided
- **3.3.5 (AAA)**: Context-sensitive help available

---

### 4. Robust

#### Compatible (4.1)
- **4.1.1**: Valid HTML (no parsing errors)
- **4.1.2**: Name, role, value for all UI components
  - All interactive elements have accessible names
  - ARIA roles used correctly
  - States/properties updated (aria-pressed, aria-expanded, etc.)
- **4.1.3**: Status messages programmatically determined
  - Use aria-live regions for dynamic content
  - role="alert" for errors
  - aria-live="polite" for non-critical updates
  - aria-live="assertive" for critical updates

---

## Testing Tools

### Automated Tools

#### 1. Lighthouse (Chrome DevTools)
```bash
# Run Lighthouse audit
npx lighthouse https://craftyprep.demosrv.uk --only-categories=accessibility --output=html --output-path=./lighthouse-report.html
```

**Scoring**:
- Target: ≥95/100
- Checks: Color contrast, ARIA, semantic HTML, keyboard nav, labels

#### 2. axe-core (Playwright Integration)
```typescript
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessibility scan', async ({ page }) => {
  await page.goto('https://craftyprep.demosrv.uk');

  const results = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',      // Level A
      'wcag2aa',     // Level AA
      'wcag2aaa',    // Level AAA
      'wcag21a',     // WCAG 2.1 Level A
      'wcag21aa',    // WCAG 2.1 Level AA
      'wcag22aa'     // WCAG 2.2 Level AA
    ])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

**Coverage**:
- 90+ WCAG rules
- Color contrast
- ARIA usage
- Keyboard accessibility
- Form labels
- Semantic HTML

#### 3. Pa11y
```bash
npx pa11y https://craftyprep.demosrv.uk --standard WCAG2AAA --reporter html > pa11y-report.html
```

#### 4. WAVE (Browser Extension)
- Install: https://wave.webaim.org/extension/
- Visual feedback on accessibility issues
- Color contrast checker
- Structure analysis

---

### Manual Testing Tools

#### 1. Screen Readers

**VoiceOver (macOS)**:
```bash
# Activate: Cmd + F5
# Navigate: Ctrl + Option + Arrow keys
# Read all: Ctrl + Option + A
# Stop reading: Control
```

**NVDA (Windows)**:
- Download: https://www.nvaccess.org/download/
- Activate: Ctrl + Alt + N
- Navigate: Arrow keys
- Read all: Insert + Down arrow

**Testing Checklist**:
- [ ] All headings announced with level
- [ ] All buttons announced with name
- [ ] All form inputs announced with label
- [ ] Slider values announced on change
- [ ] Loading states announced
- [ ] Errors announced
- [ ] No redundant announcements

#### 2. Keyboard Navigation

**Test Steps**:
1. Tab through entire page (no mouse)
2. Verify focus order is logical
3. Test all keyboard shortcuts:
   - Enter: Activate buttons
   - Space: Activate buttons
   - Arrow keys: Adjust sliders
   - Escape: Clear errors, close modals
4. Verify no keyboard traps
5. Verify focus always visible

#### 3. Color Contrast Checkers

**Chrome DevTools**:
- Inspect element
- Styles panel → Accessibility
- View contrast ratio

**WebAIM Contrast Checker**:
- https://webaim.org/resources/contrastchecker/
- Input foreground/background colors
- Check AAA compliance

**Colour Contrast Analyser (Desktop)**:
- Download: https://www.tpgi.com/color-contrast-checker/
- Eyedropper tool for color picking

---

## Common Accessibility Patterns

### Skip Links
```html
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <header>...</header>

  <main id="main-content">...</main>
</body>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
```

### Focus Indicators
```css
*:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

### ARIA Live Regions
```html
<!-- Polite announcements (non-critical) -->
<div aria-live="polite" aria-atomic="true">
  Processing image...
</div>

<!-- Assertive announcements (critical, errors) -->
<div role="alert" aria-live="assertive">
  Error: Invalid file type
</div>

<!-- Status announcements -->
<div role="status" aria-live="polite" aria-busy="true">
  <span class="visually-hidden">Loading...</span>
  <div class="spinner" aria-hidden="true"></div>
</div>
```

### Form Labels
```html
<!-- Explicit label association -->
<label for="brightness">Brightness</label>
<input type="range" id="brightness" name="brightness"
       aria-valuemin="-100" aria-valuemax="100" aria-valuenow="0" />

<!-- With description -->
<label for="threshold">Threshold</label>
<input type="range" id="threshold"
       aria-describedby="threshold-help" />
<span id="threshold-help">Adjust the threshold for black/white conversion</span>
```

### Canvas Accessibility
```html
<!-- Descriptive label -->
<canvas aria-label="Original image preview"></canvas>

<!-- Or with description -->
<canvas aria-labelledby="canvas-title" aria-describedby="canvas-desc"></canvas>
<h3 id="canvas-title">Original Image</h3>
<p id="canvas-desc">Preview of your uploaded image before processing</p>
```

### Button Accessibility
```html
<!-- Text button -->
<button type="button">Auto-Prep Image</button>

<!-- Icon button with label -->
<button type="button" aria-label="Download processed image">
  <DownloadIcon aria-hidden="true" />
</button>

<!-- Button with loading state -->
<button type="button" aria-busy="true" disabled>
  Processing...
</button>
```

---

## CraftyPrep-Specific Considerations

### Image Processing Application
- **Canvas elements**: Need descriptive aria-labels (original vs processed)
- **Sliders**: Need value announcements, keyboard support (arrow keys)
- **Processing states**: Need aria-live announcements (polite)
- **Errors**: Need aria-live="assertive" for immediate attention

### User Flow Accessibility
1. **Upload**: Keyboard-accessible dropzone, clear instructions
2. **Auto-Prep**: Button with clear label, loading state announced
3. **Refinement**: Sliders keyboard-adjustable, values announced
4. **Download**: Button keyboard-accessible, action clear

### Critical Components to Audit
- FileDropzone: Keyboard activation, ARIA labels
- AutoPrepButton: Loading states, disabled states
- Sliders (brightness, contrast, threshold): Labels, values, keyboard
- BackgroundRemovalControl: Toggle keyboard-accessible, slider labeled
- ImageCanvas: Canvas aria-labels, descriptions
- DownloadButton: Keyboard-accessible, clear label
- Error/Progress displays: aria-live regions

---

## Resources

### Official Standards
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM**: https://webaim.org/

### Testing Tools
- **Lighthouse**: Chrome DevTools
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/extension/
- **Pa11y**: https://pa11y.org/
- **NVDA**: https://www.nvaccess.org/

### Learning Resources
- **A11y Project**: https://www.a11yproject.com/
- **Deque University**: https://dequeuniversity.com/
- **WebAIM Training**: https://webaim.org/training/

---

## Expected Issues (Based on Common Patterns)

### Likely Findings
1. **Canvas elements without aria-label**: Need descriptive labels
2. **Insufficient color contrast**: May need to darken some text colors
3. **Missing focus indicators**: Custom components may need explicit styles
4. **Slider ARIA**: May need aria-valuetext for formatted values
5. **Loading announcements**: May need explicit aria-live regions

### Quick Wins
1. Add `lang="en"` to HTML (already present ✓)
2. Add skip link if missing
3. Ensure heading hierarchy (h1 → h2 → h3)
4. Add aria-labels to icon buttons
5. Add aria-live regions for processing states

---

**Status**: Research complete
**Next**: Use this information during implementation phases
