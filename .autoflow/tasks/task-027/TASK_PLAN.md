# Task Plan: Dark/Light Theme System

## Objective

Implement a complete dark/light theme system with theme toggle, CSS custom properties, system preference detection, and localStorage persistence. All components must support both themes with proper WCAG AAA contrast (≥7:1 for normal text).

**User Value**: Users can choose their preferred theme (light, dark, or auto) for comfortable viewing in different lighting conditions, with their preference remembered across sessions.

## Approach

### TDD Methodology
1. Write tests for theme utilities (system detection, localStorage, class application)
2. Implement theme utilities
3. Write tests for ThemeContext (state management, persistence, system listener)
4. Implement ThemeContext and ThemeProvider
5. Write tests for useTheme hook
6. Implement useTheme hook
7. Write tests for ThemeToggle component
8. Implement ThemeToggle component
9. Integration: Add ThemeProvider to App.tsx root
10. Integration: Update Header.tsx to include ThemeToggle
11. Update index.html with FOUC prevention script
12. E2E tests for complete theme switching workflow
13. Accessibility tests for both themes (contrast, focus, keyboard)

### Architecture Foundation (Already Complete!)

**Excellent news**: The theme system foundation is ~70% complete:
- ✅ Tailwind configured with `darkMode: ['class']`
- ✅ CSS variables defined for both light and dark themes
- ✅ Dark theme has WCAG AAA contrast (verified in styles/index.css)
- ✅ All components use CSS variable system via Tailwind
- ✅ Transitions defined (200ms default)
- ✅ Reduced motion support already implemented
- ✅ Icon libraries installed (lucide-react)

**What's needed**: Theme state management and UI controls

## Architecture Rules

### State Management
- **Pattern**: React Context API (no Redux needed for simple theme state)
- **Provider**: Single `<ThemeProvider>` at app root
- **Consumer**: `useTheme()` hook for components
- **State Shape**:
  ```typescript
  {
    theme: 'light' | 'dark' | 'system',
    setTheme: (theme: ThemeMode) => void,
    effectiveTheme: 'light' | 'dark' // Resolves 'system' to actual
  }
  ```

### Theme Detection Priority
1. **Stored preference** (localStorage) - User's explicit choice
2. **System preference** (matchMedia) - OS/browser default
3. **Fallback** ('light') - If neither available

### Class Application
- Dark theme: Add `.dark` class to `document.documentElement`
- Light theme: Remove `.dark` class from `document.documentElement`
- Tailwind's `dark:` variant handles all styling automatically

### FOUC Prevention
- **Critical**: Inline script in index.html runs before React
- Reads localStorage and applies theme class immediately
- Prevents flash on page load

## Implementation Steps

### Phase 1: Theme Utilities (TDD)
**Files**: `src/lib/theme.ts`, `src/tests/unit/theme.test.ts`

**Tests**:
1. System theme detection (matchMedia)
2. localStorage read/write with validation
3. Theme class application (add/remove .dark)
4. Graceful fallbacks for missing APIs

**Implementation**:
```typescript
// Theme types
type ThemeMode = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

// Utilities
getSystemTheme(): EffectiveTheme
getStoredTheme(): ThemeMode | null
setStoredTheme(theme: ThemeMode): void
applyTheme(theme: EffectiveTheme): void
isValidTheme(value: unknown): value is ThemeMode
```

### Phase 2: Theme Context (TDD)
**Files**: `src/contexts/ThemeContext.tsx`, `src/tests/unit/ThemeContext.test.tsx`

**Tests**:
1. Provider initializes with stored or system theme
2. setTheme updates state and localStorage
3. effectiveTheme resolves 'system' correctly
4. System theme listener responds to OS changes
5. Cleanup removes event listeners

**Implementation**:
```typescript
interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: EffectiveTheme;
}

export function ThemeProvider({ children })
export const ThemeContext = createContext<ThemeContextType>()
```

**Key behaviors**:
- Initialize: Read localStorage → fallback to 'system'
- On mount: Apply theme, add system listener
- On theme change: Update state, localStorage, apply class
- On unmount: Remove system listener

### Phase 3: useTheme Hook (TDD)
**Files**: `src/hooks/useTheme.ts`, `src/tests/unit/useTheme.test.ts`

**Tests**:
1. Returns theme context values
2. Throws error when used outside ThemeProvider

**Implementation**:
```typescript
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Phase 4: Theme Toggle Component (TDD)
**Files**: `src/components/ThemeToggle.tsx`, `src/tests/unit/ThemeToggle.test.tsx`

**Tests**:
1. Renders correct icon for each theme (Sun/Moon/Monitor)
2. Click cycles through themes (Light → Dark → System → Light)
3. Proper ARIA labels
4. Keyboard accessible (Enter/Space)
5. Focus indicator visible

**Implementation**:
- Uses lucide-react icons: Sun, Moon, Monitor
- Button with transparent background, hover effect
- Size: 40×40px (44px with padding for touch target)
- Cycles through all three theme options
- Tooltip shows current theme (optional enhancement)

**Component structure**:
```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const cycleTheme = () => {
    const next = { light: 'dark', dark: 'system', system: 'light' }[theme];
    setTheme(next);
  };
  
  // Return button with appropriate icon
}
```

### Phase 5: Integration
**Files**: `src/App.tsx`, `src/components/Header.tsx`, `index.html`

**Changes**:
1. **App.tsx**: Wrap root with `<ThemeProvider>`
   ```tsx
   <ThemeProvider>
     <ErrorBoundary>
       <Layout>...</Layout>
     </ErrorBoundary>
   </ThemeProvider>
   ```

2. **Header.tsx**: Add flex layout with ThemeToggle
   ```tsx
   <header className="...">
     <div className="container mx-auto flex items-center justify-between">
       <div>
         <h1>CraftyPrep</h1>
         <p>Laser Engraving...</p>
       </div>
       <ThemeToggle />
     </div>
   </header>
   ```

3. **index.html**: Add FOUC prevention script
   ```html
   <script>
     (function() {
       const stored = localStorage.getItem('craftyprep-theme');
       const theme = stored || 'system';
       if (theme === 'dark' || 
           (theme === 'system' && 
            window.matchMedia('(prefers-color-scheme: dark)').matches)) {
         document.documentElement.classList.add('dark');
       }
     })();
   </script>
   ```

### Phase 6: E2E Testing
**Files**: `src/tests/e2e/theme-system.spec.ts`

**Test scenarios**:
1. Theme toggle visible and accessible in header
2. Clicking toggle cycles through themes
3. Theme persists across page reload
4. System theme detected on first visit
5. All UI elements visible in both themes
6. Smooth transitions (if not reduced motion)
7. Keyboard navigation works (Tab to toggle, Enter to activate)

### Phase 7: Accessibility Testing
**Files**: `src/tests/e2e/theme-accessibility.spec.ts`

**Test scenarios**:
1. Light theme: Contrast ≥7:1 for all text (WCAG AAA)
2. Dark theme: Contrast ≥7:1 for all text (WCAG AAA)
3. Focus indicators visible in both themes (≥3:1 contrast, 3px width)
4. Theme toggle has clear ARIA label
5. Theme toggle keyboard accessible
6. axe-core scan passes in both themes (zero violations)
7. Reduced motion respected (no transitions)

## Required Reading

### Primary Documentation
- **[.autoflow/docs/FUNCTIONAL.md#feature-5]**: Responsive UI and accessibility requirements
  - Why: Defines WCAG 2.2 Level AAA standards (≥7:1 contrast)
  - Why: Specifies reduced motion support
  - Why: Keyboard navigation requirements

- **[.autoflow/docs/ARCHITECTURE.md#ui-framework-and-styling]**: Tailwind + shadcn/ui setup
  - Why: Understand existing CSS variable system
  - Why: Tailwind darkMode configuration
  - Why: Component styling patterns

### Implementation References
- **src/styles/index.css**: Complete CSS variable definitions
  - Why: Verify dark theme colors and contrast ratios
  - Why: Understand transition timing variables
  - Why: See reduced motion implementation

- **src/lib/design-tokens.ts**: TypeScript design token exports
  - Why: Understand how components access theme variables
  - Why: Verify no direct color usage (all via variables)

- **src/components/Header.tsx**: Current header implementation
  - Why: Integration point for ThemeToggle
  - Why: Understand layout structure

## Technical Decisions

### Decision 1: Theme State Type
**Choice**: Three-state system ('light' | 'dark' | 'system')

**Rationale**:
- 'light' and 'dark' are explicit user preferences
- 'system' respects OS preference (best UX for most users)
- Allows user to override OS preference when needed
- Common pattern in modern applications (GitHub, VS Code, etc.)

**Alternative Considered**: Two-state (light/dark only)
- Rejected: Doesn't respect OS preference
- User would need to manually match their OS theme

### Decision 2: Toggle UI Pattern
**Choice**: Cycling button with three states (Sun → Moon → Monitor → Sun)

**Rationale**:
- Single button keeps UI simple and uncluttered
- Icons are universally understood (Sun=light, Moon=dark, Monitor=auto)
- One click to any theme (max 2 clicks to reach desired state)
- Consistent with mobile app patterns
- Accessible: Clear ARIA labels, keyboard support

**Alternative Considered**: Dropdown menu with radio buttons
- Rejected: Requires extra click (open menu → select option)
- More complex implementation
- Advantage: More explicit, better for first-time users
- Mitigation: Tooltip on hover shows "Theme: Light/Dark/Auto"

### Decision 3: FOUC Prevention
**Choice**: Inline script in index.html before React loads

**Rationale**:
- Runs immediately, before any React rendering
- Zero flash on page load (critical for UX)
- Small script (~10 lines), minimal performance impact
- Standard practice for theme systems (Next.js, Gatsby, etc.)

**Alternative Considered**: useLayoutEffect hook
- Rejected: Runs after React mount, can still flash
- Would need server-side rendering to fully eliminate flash
- This is a client-only app (no SSR), so inline script is best

### Decision 4: localStorage Key
**Choice**: 'craftyprep-theme'

**Rationale**:
- Namespaced to avoid conflicts
- Clear, descriptive name
- Lowercase with hyphen (web convention)

### Decision 5: Default Theme
**Choice**: 'system' (respect OS preference)

**Rationale**:
- Best UX: Matches user's system-wide preference
- No unnecessary light/dark flash on first visit
- User can override if desired
- Modern web standard (most sites default to system)

**Alternative Considered**: 'light' default
- Rejected: Ignores user's explicit OS preference
- Dark mode users would see unwanted light flash

### Decision 6: Transition Duration
**Choice**: Use existing CSS variable (--duration-base = 200ms)

**Rationale**:
- Consistent with existing UI transitions
- 200ms is proven good timing (not too fast, not too slow)
- Already respects prefers-reduced-motion
- No additional CSS needed

### Decision 7: Icon Library
**Choice**: lucide-react (already installed)

**Rationale**:
- Already in package.json (no new dependency)
- Consistent with shadcn/ui ecosystem
- Clean, modern icons
- Tree-shakeable (only import what we use)
- Icons needed: Sun, Moon, Monitor

## Test Examples

### Unit Test: Theme Utilities
```typescript
describe('getSystemTheme', () => {
  it('returns "dark" when system prefers dark', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    expect(getSystemTheme()).toBe('dark');
  });
  
  it('returns "light" when system prefers light', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    expect(getSystemTheme()).toBe('light');
  });
});
```

### Unit Test: Theme Context
```typescript
describe('ThemeProvider', () => {
  it('initializes with system theme when no stored preference', () => {
    localStorage.removeItem('craftyprep-theme');
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    expect(result.current.theme).toBe('system');
  });
  
  it('restores stored theme preference', () => {
    localStorage.setItem('craftyprep-theme', 'dark');
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    expect(result.current.theme).toBe('dark');
  });
  
  it('updates localStorage when theme changes', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(localStorage.getItem('craftyprep-theme')).toBe('dark');
  });
});
```

### E2E Test: Theme Persistence
```typescript
test('theme persists across page reload', async ({ page }) => {
  // Navigate to app
  await page.goto('https://craftyprep.demosrv.uk');
  
  // Switch to dark theme
  await page.click('[aria-label*="theme"]');
  await page.click('[aria-label*="theme"]'); // Cycle to dark
  
  // Verify dark theme applied
  await expect(page.locator('html')).toHaveClass(/dark/);
  
  // Reload page
  await page.reload();
  
  // Verify theme persisted
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

### Accessibility Test: Contrast
```typescript
test('dark theme meets WCAG AAA contrast', async ({ page }) => {
  await page.goto('https://craftyprep.demosrv.uk');
  
  // Switch to dark theme
  const toggle = page.locator('[aria-label*="theme"]');
  await toggle.click();
  await toggle.click(); // Cycle to dark
  
  // Run axe accessibility scan
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa', 'wcag2aaa', 'wcag21aa', 'wcag21aaa'])
    .analyze();
  
  // Should have zero violations
  expect(results.violations).toHaveLength(0);
});
```

## Dependencies

### Task Dependencies
- **None**: This is a standalone feature
- No blocking tasks
- Can be implemented independently

### Technical Dependencies
- **React 19**: Context API, hooks (already installed)
- **lucide-react**: Icons for toggle (already installed)
- **Tailwind CSS 4**: Dark mode variants (already configured)
- **Browser APIs**:
  - localStorage (for persistence)
  - matchMedia (for system theme detection)
  - classList (for theme class management)

### External Services
- **None**: Fully client-side implementation

## Risks and Mitigations

### Risk 1: Flash of Unstyled Content (FOUC)
**Impact**: HIGH - Poor UX, unprofessional appearance
**Probability**: HIGH - Without mitigation, will definitely flash

**Mitigation**:
- Inline script in index.html (before React)
- Reads localStorage and applies theme immediately
- Zero flash on page load

**Verification**:
- E2E test: Assert no flash on reload
- Manual testing in both themes

### Risk 2: localStorage Disabled/Blocked
**Impact**: MEDIUM - Theme won't persist across sessions
**Probability**: LOW - Rare, but privacy extensions can block

**Mitigation**:
- Graceful fallback to 'system' theme
- Wrap localStorage calls in try-catch
- App still functional, just no persistence

**Verification**:
- Unit test: localStorage throws error
- Manual test: Disable localStorage in DevTools

### Risk 3: Invalid Stored Theme Value
**Impact**: LOW - Could break theme system
**Probability**: LOW - Only if localStorage corrupted

**Mitigation**:
- Validate stored value with isValidTheme()
- Fallback to 'system' if invalid
- Clear invalid value from storage

**Verification**:
- Unit test: Invalid values in localStorage
- Test: Manually set invalid value, verify fallback

### Risk 4: System Theme Change While App Running
**Impact**: LOW - Theme becomes out of sync with OS
**Probability**: MEDIUM - User might change OS theme

**Mitigation**:
- Listen to matchMedia change events
- Auto-update when user has 'system' preference
- Don't override explicit light/dark choice

**Verification**:
- Unit test: matchMedia event fires
- Manual test: Change OS theme while app open

### Risk 5: Components Not Using CSS Variables
**Impact**: HIGH - Components wouldn't theme properly
**Probability**: VERY LOW - Already verified all components use variables

**Mitigation**:
- Already complete: All components use Tailwind classes
- Tailwind classes reference CSS variables
- Both light and dark variables defined

**Verification**:
- Code review: grep for hardcoded colors
- E2E test: Visual regression in both themes

### Risk 6: Icon Visibility in Both Themes
**Impact**: MEDIUM - Toggle might be hard to see
**Probability**: LOW - Using currentColor

**Mitigation**:
- Icons use currentColor (inherits from parent)
- Header has primary background with primary-foreground text
- High contrast in both themes (WCAG AAA)

**Verification**:
- Accessibility test: Check icon contrast
- Visual test: Manual verification in both themes

### Risk 7: Performance Impact
**Impact**: LOW - Theme switching could be sluggish
**Probability**: VERY LOW - Simple class toggle

**Mitigation**:
- Class toggle is instant (no re-render cascade)
- CSS transitions handle visual smoothness
- No expensive computations

**Verification**:
- Performance test: Measure toggle response time
- Target: <50ms from click to class update

## Success Criteria

### Functional Requirements
- ✅ Theme toggle visible in header toolbar
- ✅ Three theme options: Light, Dark, System
- ✅ Clicking toggle cycles through themes
- ✅ Theme persists across browser sessions
- ✅ System theme detected and applied on first visit
- ✅ System theme changes reflected when in 'system' mode
- ✅ All UI components visible and usable in both themes
- ✅ Smooth transitions between themes (200-300ms)

### Non-Functional Requirements
- ✅ Test coverage ≥80% (unit + integration)
- ✅ Zero E2E test failures
- ✅ WCAG 2.2 Level AAA contrast (≥7:1) in both themes
- ✅ Focus indicators visible in both themes (≥3:1 contrast)
- ✅ Theme toggle keyboard accessible (Tab, Enter/Space)
- ✅ Zero axe-core violations in both themes
- ✅ Reduced motion preference respected (no transitions)
- ✅ No FOUC on page load or reload
- ✅ Toggle response time <50ms
- ✅ localStorage errors handled gracefully

### User Experience
- ✅ Theme toggle intuitive and discoverable
- ✅ Icons clear and universally understood
- ✅ No visual glitches during theme switch
- ✅ Theme choice obvious (icons match current theme)
- ✅ Works on desktop, tablet, and mobile
- ✅ No layout shift when toggle added to header

## Architecture Rules Enforcement

### Rule 1: Theme State Must Be Centralized
**Test**: Verify single source of truth in ThemeContext
```typescript
test('theme state is centralized in context', () => {
  // Attempt to use useTheme outside provider
  expect(() => {
    renderHook(() => useTheme());
  }).toThrow('useTheme must be used within ThemeProvider');
});
```

### Rule 2: All Components Must Use CSS Variables
**Test**: Code review - no hardcoded colors
```bash
# Find any hardcoded hex colors (should be none)
grep -r "#[0-9a-fA-F]\{6\}" src/components --exclude-dir=tests
```

### Rule 3: Theme Must Apply Before React Renders
**Test**: Verify inline script in index.html
```typescript
test('index.html contains FOUC prevention script', async ({ page }) => {
  const content = await fs.readFile('index.html', 'utf-8');
  expect(content).toContain('craftyprep-theme');
  expect(content).toContain('prefers-color-scheme');
});
```

### Rule 4: localStorage Failures Must Be Graceful
**Test**: Verify fallback when localStorage throws
```typescript
test('handles localStorage errors gracefully', () => {
  // Mock localStorage to throw
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = vi.fn(() => {
    throw new Error('QuotaExceededError');
  });
  
  // Should not crash
  expect(() => {
    setStoredTheme('dark');
  }).not.toThrow();
  
  // Restore
  Storage.prototype.setItem = originalSetItem;
});
```

### Rule 5: System Theme Listener Must Clean Up
**Test**: Verify removeEventListener called on unmount
```typescript
test('removes system theme listener on unmount', () => {
  const removeListenerSpy = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: removeListenerSpy,
  });
  
  const { unmount } = render(<ThemeProvider><div /></ThemeProvider>);
  unmount();
  
  expect(removeListenerSpy).toHaveBeenCalled();
});
```

## Estimated Effort

**Total**: 8 hours

**Breakdown**:
- Phase 1 (Utilities): 1 hour
- Phase 2 (Context): 1.5 hours
- Phase 3 (Hook): 0.5 hours
- Phase 4 (Toggle): 1.5 hours
- Phase 5 (Integration): 1 hour
- Phase 6 (E2E Tests): 1.5 hours
- Phase 7 (A11y Tests): 1 hour

**Confidence**: HIGH - Foundation already complete, clear implementation path

## Notes

- **Foundation Complete**: CSS variables, dark theme colors, Tailwind config all done
- **No New Dependencies**: Everything needed is already installed
- **Standard Pattern**: React Context for theme is well-established pattern
- **Excellent UX**: Three-state toggle with system preference is modern standard
- **Accessibility First**: WCAG AAA compliance already in CSS, just need to verify
- **Future Enhancements**: Could add more themes (high contrast, custom colors) easily
