# Acceptance Criteria: Dark/Light Theme System

## Functional Requirements

### FR1: Theme Toggle UI
- [ ] Theme toggle button visible in header toolbar (top right)
- [ ] Button size ≥44×44px for touch accessibility
- [ ] Icons display correctly:
  - Sun icon when in light mode (indicates dark mode available)
  - Moon icon when in dark mode (indicates light mode available)
  - Monitor icon when in system mode (indicates system preference active)
- [ ] Click cycles through themes: Light → Dark → System → Light
- [ ] Visual feedback on hover (background color change)
- [ ] Visual feedback on active/press state
- [ ] Smooth icon transition (200ms)

### FR2: Theme Application
- [ ] Light theme applied correctly (no .dark class on html)
- [ ] Dark theme applied correctly (.dark class on html)
- [ ] System theme resolves to light or dark based on OS preference
- [ ] All UI components visible in light theme
- [ ] All UI components visible in dark theme
- [ ] No visual glitches during theme transition
- [ ] Transitions respect prefers-reduced-motion (instant if enabled)

### FR3: Theme Persistence
- [ ] Theme choice saved to localStorage (`craftyprep-theme` key)
- [ ] Theme restored from localStorage on page load
- [ ] Theme persists across browser sessions
- [ ] Theme persists across page reloads
- [ ] Invalid stored values handled gracefully (fallback to 'system')

### FR4: System Theme Detection
- [ ] System theme detected via matchMedia on first visit
- [ ] System theme applied when user selects 'System' option
- [ ] System theme updates dynamically when OS preference changes
- [ ] System theme only updates when in 'system' mode (doesn't override explicit choice)

### FR5: FOUC Prevention
- [ ] No flash of incorrect theme on initial page load
- [ ] No flash of incorrect theme on page reload
- [ ] Theme applied before React renders
- [ ] Inline script in index.html executes correctly

## Non-Functional Requirements

### NFR1: Test Coverage
- [ ] Unit tests: Theme utilities (≥80% coverage)
- [ ] Unit tests: ThemeContext (≥80% coverage)
- [ ] Unit tests: useTheme hook (≥80% coverage)
- [ ] Unit tests: ThemeToggle component (≥80% coverage)
- [ ] E2E tests: Complete theme switching workflow
- [ ] E2E tests: Theme persistence across reload
- [ ] E2E tests: System theme detection
- [ ] Accessibility tests: Contrast verification (both themes)
- [ ] Accessibility tests: Keyboard navigation
- [ ] Overall test coverage ≥80%

### NFR2: Accessibility (WCAG 2.2 Level AAA)

#### Color Contrast
- [ ] Light theme: Normal text ≥7:1 contrast ratio
- [ ] Light theme: Large text ≥4.5:1 contrast ratio
- [ ] Light theme: UI components ≥3:1 contrast ratio
- [ ] Dark theme: Normal text ≥7:1 contrast ratio
- [ ] Dark theme: Large text ≥4.5:1 contrast ratio
- [ ] Dark theme: UI components ≥3:1 contrast ratio
- [ ] Theme toggle icon ≥3:1 contrast in both themes

#### Keyboard Navigation
- [ ] Theme toggle reachable via Tab key
- [ ] Theme toggle activates with Enter key
- [ ] Theme toggle activates with Space key
- [ ] Focus indicator visible on theme toggle (≥3:1 contrast, ≥3px width)
- [ ] Focus indicator visible in both themes
- [ ] Tab order remains logical with toggle in header

#### Screen Reader Support
- [ ] Theme toggle has descriptive aria-label
- [ ] Aria-label indicates current theme
- [ ] Aria-label indicates action (e.g., "Switch to dark theme")
- [ ] Theme change announced to screen readers (optional live region)

#### Reduced Motion
- [ ] Theme transitions disabled when prefers-reduced-motion
- [ ] Theme change instant when prefers-reduced-motion
- [ ] No animations on toggle when prefers-reduced-motion

### NFR3: Performance
- [ ] Theme toggle response time <50ms (from click to class update)
- [ ] No layout shift when toggle added to header
- [ ] No performance degradation from theme system
- [ ] Smooth 60fps transitions (when motion enabled)
- [ ] Lighthouse performance score ≥90 (both themes)

### NFR4: Browser Compatibility
- [ ] Works on Chrome 90+ (desktop & mobile)
- [ ] Works on Firefox 88+ (desktop & mobile)
- [ ] Works on Safari 14+ (desktop & mobile)
- [ ] Works on Edge 90+ (desktop)
- [ ] Graceful fallback when matchMedia not supported
- [ ] Graceful fallback when localStorage disabled

### NFR5: Error Handling
- [ ] localStorage write errors handled gracefully
- [ ] localStorage read errors handled gracefully
- [ ] Invalid theme values rejected with fallback
- [ ] matchMedia errors handled gracefully
- [ ] No console errors during normal operation
- [ ] No console errors when localStorage disabled

### NFR6: Code Quality
- [ ] TypeScript types defined for all theme-related code
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] Code follows project conventions
- [ ] DRY principle applied (no duplicate logic)
- [ ] SOLID principles followed
- [ ] Proper error boundaries (if applicable)

## User Experience Requirements

### UX1: Discoverability
- [ ] Theme toggle immediately visible in header
- [ ] Icon clearly indicates theme functionality
- [ ] Hover state makes toggle interactive nature clear
- [ ] No confusion about current theme

### UX2: Feedback
- [ ] Immediate visual feedback on click (<50ms)
- [ ] Smooth transition between themes (200-300ms)
- [ ] No jarring color flashes
- [ ] Clear indication of which theme is active

### UX3: Consistency
- [ ] Toggle behavior consistent across all pages
- [ ] Theme persists across entire app
- [ ] No components that ignore theme
- [ ] Design tokens used consistently

### UX4: Responsiveness
- [ ] Toggle works on desktop (mouse)
- [ ] Toggle works on tablet (touch)
- [ ] Toggle works on mobile (touch)
- [ ] Touch target ≥44×44px
- [ ] No layout issues on any screen size

## Integration Requirements

### INT1: App Integration
- [ ] ThemeProvider wraps entire app
- [ ] ThemeProvider at root level (before ErrorBoundary or after)
- [ ] No theme context errors in console
- [ ] All components have access to theme

### INT2: Header Integration
- [ ] ThemeToggle added to Header component
- [ ] Header layout updated to accommodate toggle (flex justify-between)
- [ ] No layout shift from original header design
- [ ] Toggle aligns properly with header content
- [ ] Responsive: Toggle visible on all screen sizes

### INT3: Component Compatibility
- [ ] All existing components work in light theme
- [ ] All existing components work in dark theme
- [ ] No visual regressions in light theme
- [ ] No visual regressions in dark theme
- [ ] Sliders visible and functional in both themes
- [ ] Buttons visible and functional in both themes
- [ ] Forms visible and functional in both themes
- [ ] Images/canvas visible in both themes

## Definition of Done

### Code Complete
- [ ] All code written and committed
- [ ] All tests passing (unit + integration + E2E)
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] Code reviewed (self-review against checklist)

### Testing Complete
- [ ] Unit test coverage ≥80%
- [ ] All E2E tests passing
- [ ] All accessibility tests passing
- [ ] Manual testing in all supported browsers
- [ ] Manual testing on mobile devices
- [ ] Lighthouse accessibility score ≥95 (both themes)

### Accessibility Verified
- [ ] axe-core scan: Zero violations (light theme)
- [ ] axe-core scan: Zero violations (dark theme)
- [ ] Keyboard navigation verified
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Contrast ratios verified with tools
- [ ] Reduced motion preference tested

### Documentation Complete
- [ ] Code comments added where needed
- [ ] Complex logic explained
- [ ] Architecture decisions documented in TASK_PLAN.md
- [ ] No need for additional user documentation (UI is self-explanatory)

### Integration Verified
- [ ] ThemeProvider integrated without errors
- [ ] ThemeToggle integrated without errors
- [ ] No regressions in existing features
- [ ] Full app tested in both themes
- [ ] Theme persists across all app interactions

### Production Ready
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance acceptable (<50ms toggle response)
- [ ] Works with production build
- [ ] Works in Docker container
- [ ] Ready for deployment

## Edge Cases Handled

- [ ] **localStorage disabled**: Falls back to system theme, no errors
- [ ] **Invalid stored theme**: Validates and falls back to 'system'
- [ ] **matchMedia not supported**: Falls back to 'light' theme
- [ ] **System theme changes mid-session**: Updates theme (if in system mode)
- [ ] **Rapid toggle clicking**: No visual glitches, state consistent
- [ ] **Page load race conditions**: FOUC script prevents flash
- [ ] **Browser zoom to 200%**: Layout remains functional
- [ ] **Very wide screens**: Toggle remains visible and functional
- [ ] **Very narrow screens**: Toggle remains accessible

## Success Metrics

### Quantitative
- Test coverage: ≥80%
- E2E pass rate: 100%
- Lighthouse accessibility: ≥95
- axe-core violations: 0
- Toggle response time: <50ms
- Zero console errors

### Qualitative
- Theme toggle is intuitive to use
- Theme switching feels smooth and professional
- Both themes are visually appealing
- Users can easily find and use the toggle
- Theme preference respects user's choice

---

**Review Checklist**: Use this criteria during `/code-review` phase to ensure quality standards met.
