# Dependencies: Professional Control Panel Redesign

## Task Dependencies

**No blocking task dependencies** - This task can start immediately.

### Related Tasks
- **task-022** (Design System): This task uses design tokens from task-022
- **task-023** (Layout System): May coordinate with layout system if in progress
- **task-024** (Image Editor Layout): Completed - ControlPanel will integrate with existing layout

## Technical Dependencies

### External Packages

**1. shadcn/ui Accordion Component** (NEW)
- **Package**: `@radix-ui/react-accordion` (via shadcn/ui)
- **Version**: Latest (^1.1.0+)
- **Installation**: `npx shadcn-ui@latest add accordion`
- **Reason**: Provides accessible, unstyled accordion primitives with built-in ARIA support
- **Risk**: Low - Standard shadcn/ui component installation
- **Mitigation**: Test installation in Docker environment first

**2. React** (EXISTING)
- **Package**: `react`
- **Version**: 19.x (already installed)
- **Reason**: Core framework
- **Status**: Already available

**3. TypeScript** (EXISTING)
- **Package**: `typescript`
- **Version**: 5.x (already installed)
- **Reason**: Type safety
- **Status**: Already available

### Internal Dependencies

**1. Existing Control Components** (REUSE)
- `src/components/BrightnessSlider.tsx`
- `src/components/ContrastSlider.tsx`
- `src/components/ThresholdSlider.tsx`
- `src/components/BackgroundRemovalControl.tsx`
- `src/components/MaterialPresetSelector.tsx`
- `src/components/UndoRedoButtons.tsx`
- `src/components/DownloadButton.tsx`
- `src/components/ResetButton.tsx`
- **Status**: All exist and functional
- **Action**: Reuse as-is, no modifications needed

**2. Design Tokens** (EXISTING)
- `src/lib/design-tokens.ts`
- **Tokens Used**:
  - `SPACING` (padding, margins, gaps)
  - `PANEL` (panel-specific tokens)
  - `ANIMATION` (durations, easings)
  - `COLORS` (border, background, hover states)
  - `RADIUS` (rounded corners)
  - `SHADOWS` (elevation)
- **Status**: Complete and available

**3. Utility Functions** (EXISTING)
- `src/lib/utils.ts` (cn helper for className merging)
- **Status**: Available

**4. shadcn/ui Base Components** (EXISTING)
- `src/components/ui/button.tsx`
- `src/components/ui/slider.tsx`
- `src/components/ui/select.tsx`
- **Status**: Already installed

## New Files to Create

### 1. Components
- `src/components/ControlPanel.tsx` - Main professional panel component
- `src/components/ui/accordion.tsx` - shadcn/ui accordion (auto-generated)

### 2. Utilities
- `src/lib/utils/panelStateStorage.ts` - localStorage utility for panel state persistence

### 3. Hooks
- `src/hooks/usePanelState.ts` - Custom hook for panel state management

### 4. Tests
- `src/tests/unit/components/ControlPanel.test.tsx`
- `src/tests/unit/components/ui/accordion.test.tsx`
- `src/tests/unit/lib/utils/panelStateStorage.test.ts`
- `src/tests/unit/hooks/usePanelState.test.ts`
- `src/tests/integration/ControlPanel.integration.test.tsx`
- `src/tests/e2e/control-panel.spec.ts`
- `src/tests/accessibility/control-panel.a11y.test.ts`

### 5. Styles
- Add accordion animations to `src/styles/index.css` (append to existing)

## Files to Modify

### 1. App.tsx (MAJOR CHANGE)
- **File**: `src/App.tsx`
- **Changes**:
  - Remove RefinementControls usage
  - Add ControlPanel import and usage
  - Pass all props to ControlPanel (brightness, contrast, threshold, etc.)
  - Remove separate DownloadButton rendering (now inside ControlPanel)
  - Remove separate UndoRedoButtons rendering (now inside ControlPanel)
- **Risk**: High - Central app file
- **Mitigation**: Comprehensive testing, gradual rollout

### 2. RefinementControls.tsx (DEPRECATION)
- **File**: `src/components/RefinementControls.tsx`
- **Changes**:
  - **Option 1**: Mark as deprecated, add comment pointing to ControlPanel
  - **Option 2**: Delete entirely (after confirming no other usage)
- **Risk**: Low - Only used in App.tsx
- **Mitigation**: Search codebase for all usages first

### 3. Package.json (INDIRECT - via shadcn)
- **File**: `src/package.json`
- **Changes**: `@radix-ui/react-accordion` will be added automatically
- **Risk**: Low - Standard dependency addition
- **Mitigation**: Review package-lock.json changes

## Data Dependencies

### localStorage Schema

**Key**: `craftyprep_panel_state`

**Schema**:
```typescript
interface PanelState {
  materialPresets: boolean;      // Material Presets section expanded?
  backgroundRemoval: boolean;    // Background Removal section expanded?
  adjustments: boolean;          // Adjustments section expanded?
  history: boolean;              // History section expanded?
  export: boolean;               // Export section expanded?
  actions: boolean;              // Actions section expanded?
}
```

**Default State**: All sections expanded (true)

**Validation**: Schema validation in `loadPanelState()` function

**Backward Compatibility**: N/A (new feature)

**Migration**: N/A (no existing data to migrate)

## Browser API Dependencies

### Required Browser APIs
- **localStorage**: Used for state persistence
  - **Fallback**: Graceful degradation (no persistence, but no errors)
  - **Testing**: Mock localStorage in tests
  - **Support**: All target browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Optional Browser APIs
- **prefers-reduced-motion**: Used to disable animations
  - **Fallback**: Animations still work if not supported
  - **Testing**: Emulate in Playwright
  - **Support**: All modern browsers

## Development Environment Dependencies

### Build Tools (EXISTING)
- Vite 7.x - No changes needed
- TypeScript compiler - No changes needed
- PostCSS + Tailwind CSS - No changes needed

### Testing Tools (EXISTING)
- Vitest - For unit tests
- Testing Library - For component tests
- Playwright - For E2E tests
- jest-axe - For accessibility tests

### Docker Environment (EXISTING)
- Node 20.19+ LTS
- Development container already configured
- No Docker changes needed

## Risk Assessment

### High Risk Dependencies
**None** - All dependencies are stable, well-tested packages

### Medium Risk Dependencies
1. **shadcn/ui Accordion** - New component installation
   - **Mitigation**: Test installation first, verify TypeScript types work
   - **Rollback Plan**: Implement custom accordion if installation fails

### Low Risk Dependencies
1. **Existing Control Components** - Already stable and tested
2. **Design Tokens** - Already in use throughout app
3. **localStorage** - Well-supported browser API

## Dependency Installation Order

1. Install shadcn/ui Accordion component
2. Verify installation and imports work
3. Create panelStateStorage utility
4. Create usePanelState hook
5. Create ControlPanel component
6. Update App.tsx integration
7. Run tests to verify no regressions

## Blockers

**No known blockers** at planning time.

### Potential Blockers
1. **shadcn/ui installation fails** - Use manual Radix UI installation
2. **TypeScript type conflicts** - Update tsconfig.json or use type assertions
3. **localStorage unavailable** - Already handled with try/catch
4. **Test environment issues** - Mock localStorage in test setup

## Success Criteria

- [ ] All external dependencies installed successfully
- [ ] All new files created with correct structure
- [ ] All modified files updated without breaking changes
- [ ] No dependency conflicts
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Build completes successfully
- [ ] Docker development environment works correctly

---

**Total Dependencies**: 11 technical dependencies (1 new, 10 existing)

**Total New Files**: 11 files (3 components, 1 utility, 1 hook, 1 styles, 5 test suites)

**Total Modified Files**: 2-3 files (App.tsx required, RefinementControls optional, package.json indirect)

**Risk Level**: Low-Medium (new component installation, major App.tsx changes)

**Estimated Setup Time**: 30 minutes (included in 10-hour estimate)
