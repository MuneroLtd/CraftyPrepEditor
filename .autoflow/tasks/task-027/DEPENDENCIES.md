# Dependencies: Dark/Light Theme System

## Task Dependencies

**None** - This task has no dependencies on other tasks and can be implemented independently.

### Blocking Tasks
- None

### Blocked By
- None

### Related Tasks (Not Blocking)
- Future tasks may build on this theme system (e.g., custom color themes, high contrast mode)

## Technical Dependencies

### Runtime Dependencies (Already Installed)

#### React 19
- **Purpose**: Context API and hooks for theme state management
- **Version**: 19.x (from package.json)
- **Usage**:
  - `createContext()` for ThemeContext
  - `useState()` for theme state
  - `useEffect()` for system theme listener
  - `useContext()` for useTheme hook
- **Status**: ✅ Installed and configured

#### lucide-react
- **Purpose**: Icons for theme toggle (Sun, Moon, Monitor)
- **Version**: 0.544.0 (from package.json)
- **Usage**:
  - `<Sun />` icon for light mode indicator
  - `<Moon />` icon for dark mode indicator
  - `<Monitor />` icon for system mode indicator
- **Status**: ✅ Installed and configured
- **Alternative**: @heroicons/react (also installed) could be used if preferred

#### Tailwind CSS 4
- **Purpose**: Dark mode variants and CSS variable system
- **Configuration**: `darkMode: ['class']` in tailwind.config.js
- **Usage**:
  - `dark:` variant for conditional styling
  - CSS variables (--background, --foreground, etc.)
  - Utility classes for theme-aware styling
- **Status**: ✅ Installed and configured

#### TypeScript 5.x
- **Purpose**: Type safety for theme system
- **Usage**:
  - Type definitions for ThemeMode, EffectiveTheme
  - Type-safe context and hooks
  - Props typing for components
- **Status**: ✅ Installed and configured

### Browser APIs (Built-in)

#### localStorage API
- **Purpose**: Persist user's theme preference across sessions
- **Browser Support**: All modern browsers (IE8+)
- **Fallback**: Graceful degradation (theme resets on refresh)
- **Usage**:
  ```typescript
  localStorage.getItem('craftyprep-theme')
  localStorage.setItem('craftyprep-theme', 'dark')
  ```
- **Error Handling**: Try-catch for QuotaExceededError, SecurityError

#### matchMedia API
- **Purpose**: Detect system color scheme preference
- **Browser Support**: All modern browsers (IE10+)
- **Fallback**: Defaults to 'light' if not supported
- **Usage**:
  ```typescript
  window.matchMedia('(prefers-color-scheme: dark)')
  ```
- **Event Listener**: Responds to system theme changes

#### classList API
- **Purpose**: Add/remove 'dark' class on document root
- **Browser Support**: All modern browsers (IE10+)
- **Usage**:
  ```typescript
  document.documentElement.classList.add('dark')
  document.documentElement.classList.remove('dark')
  ```

### Build Dependencies (Already Installed)

#### Vite 7
- **Purpose**: Build tool and dev server
- **Usage**: No special configuration needed for theme system
- **Status**: ✅ Installed and configured

#### Vitest
- **Purpose**: Unit testing framework
- **Usage**: Test theme utilities, context, hooks, components
- **Status**: ✅ Installed and configured

#### Playwright
- **Purpose**: E2E testing framework
- **Usage**: Test theme toggle interaction, persistence, accessibility
- **Status**: ✅ Installed and configured

#### @axe-core/playwright
- **Purpose**: Accessibility testing
- **Usage**: Verify WCAG AAA contrast in both themes
- **Status**: ✅ Installed and configured

## Infrastructure Dependencies

### Development Environment
- **Node.js**: 20.19+ (from project requirements)
- **npm**: For package management
- **Docker**: For containerized development (optional)

### Deployment Environment
- **nginx:alpine**: Serves static files (no server-side theme logic needed)
- **Traefik**: Reverse proxy (no special configuration needed)

### External Services
- **None**: Theme system is fully client-side
- No API calls required
- No external CDNs needed (all assets bundled)

## CSS Architecture Dependencies

### Existing Design System (Already Complete)

#### CSS Custom Properties
- **File**: src/styles/index.css
- **Status**: ✅ Complete - Both light and dark themes defined
- **Variables Used**:
  - Colors: --background, --foreground, --primary, --muted, etc.
  - Typography: --text-*, --leading-*, --font-*, --tracking-*
  - Spacing: --space-*
  - Borders: --radius-*
  - Shadows: --shadow-*
  - Transitions: --duration-*, --ease-*

#### Design Tokens
- **File**: src/lib/design-tokens.ts
- **Status**: ✅ Complete - TypeScript exports for all tokens
- **Usage**: Components can import tokens for inline styles (if needed)

#### Tailwind Configuration
- **File**: src/tailwind.config.js
- **Status**: ✅ Complete - darkMode: ['class'] configured
- **Extended**: All CSS variables mapped to Tailwind utilities

### Component Dependencies
All existing components already use the CSS variable system via Tailwind classes. No modifications needed for theme support.

#### Verified Compatible Components
- ✅ Button (src/components/ui/button.tsx)
- ✅ Slider (src/components/ui/slider.tsx)
- ✅ Enhanced Slider (src/components/ui/enhanced-slider.tsx)
- ✅ Select (src/components/ui/select.tsx)
- ✅ Header (src/components/Header.tsx)
- ✅ ControlPanel (src/components/ControlPanel.tsx)
- ✅ ImagePreview (src/components/ImagePreview.tsx)
- ✅ Layout (src/components/Layout.tsx)
- ✅ All other components (verified via code review)

## Data Dependencies

### Persistent Data

#### localStorage Schema
```typescript
// Key: 'craftyprep-theme'
// Value: 'light' | 'dark' | 'system'
type StoredTheme = 'light' | 'dark' | 'system';
```

**Migration**: None needed (new feature)

**Validation**: Values validated on read, invalid values fallback to 'system'

**Size**: ~10 bytes (negligible)

### State Dependencies

#### Context State Schema
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
}
```

**Initial State**: Loaded from localStorage or defaults to 'system'

**Persistence**: Automatically saved to localStorage on change

## Documentation Dependencies

### Required Reading (See TASK_PLAN.md)
- ✅ .autoflow/docs/FUNCTIONAL.md#feature-5 - Accessibility requirements
- ✅ .autoflow/docs/ARCHITECTURE.md#ui-framework - Tailwind setup
- ✅ src/styles/index.css - CSS variable definitions
- ✅ src/lib/design-tokens.ts - Token exports
- ✅ src/components/Header.tsx - Integration point

### Reference Documentation
- React Context API: https://react.dev/reference/react/createContext
- matchMedia API: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
- WCAG 2.2 Contrast: https://www.w3.org/WAI/WCAG22/quickref/#contrast-enhanced
- Tailwind Dark Mode: https://tailwindcss.com/docs/dark-mode

## Risk Assessment

### Dependency Risks

#### Risk 1: localStorage Unavailable
- **Probability**: Low
- **Impact**: Medium (theme doesn't persist)
- **Mitigation**: Graceful fallback, try-catch wrappers
- **Workaround**: Theme works per-session, defaults to system

#### Risk 2: matchMedia Not Supported
- **Probability**: Very Low (IE9 and below only)
- **Impact**: Low (can't detect system theme)
- **Mitigation**: Feature detection, fallback to 'light'
- **Workaround**: User can explicitly choose theme

#### Risk 3: CSS Variables Not Supported
- **Probability**: Very Low (IE11 and below only)
- **Impact**: High (no theming at all)
- **Mitigation**: Browser requirement clearly stated
- **Workaround**: None - CSS variables are fundamental

#### Risk 4: Lucide React Icons Missing
- **Probability**: Very Low (already verified installed)
- **Impact**: Medium (toggle won't render)
- **Mitigation**: Icons are installed, verified in package.json
- **Workaround**: Could use Heroicons as alternative

### Dependency Updates

#### Strategy
- Follow project's existing dependency update strategy
- lucide-react: Update when project updates other deps
- React 19: Already on latest (no updates needed for MVP)
- Tailwind CSS: Already on latest (no updates needed)

#### Breaking Changes
- **Unlikely**: Theme system uses stable, core APIs
- **Monitor**: React context API changes (rare)
- **Monitor**: Tailwind dark mode syntax changes (rare)

## Conclusion

**Dependency Status**: ✅ All dependencies satisfied

**Ready to Implement**: Yes - All technical dependencies are:
1. Already installed and configured
2. Well-tested and stable
3. Have no known breaking changes planned
4. Have graceful fallbacks for unsupported environments

**New Dependencies Required**: None

**Configuration Changes Required**: None (all configuration already in place)
