# Dependencies: Settings Persistence (localStorage)

**Task ID**: task-022
**Title**: Settings Persistence (localStorage)

---

## Technical Dependencies

### 1. React Hooks

**Required**:
- `useState` - State management
- `useEffect` - Side effects (save/load from localStorage)
- `useCallback` - Memoization for functions
- `useRef` - Debounce timeout reference

**Source**: `react` (already in project)

**Version**: React 19.x (already installed)

**Usage**:
- `useSettingsPersistence` hook
- `useInitialSettings` hook
- Component state management in App.tsx

---

### 2. TypeScript

**Required**: TypeScript 5.x (already in project)

**Usage**:
- Type definitions for `PersistedSettings`
- Type guards (`isValidPersistedSettings`)
- Strict type checking for localStorage data

**Files**:
- `src/lib/utils/settingsStorage.ts`
- `src/hooks/useSettingsPersistence.ts`
- `src/hooks/useInitialSettings.ts`

---

### 3. Existing Hooks

#### useCustomPresetPersistence

**Location**: `/opt/workspaces/craftyprep.com/src/hooks/useCustomPresetPersistence.ts`

**Relationship**:
- Current implementation (partial persistence)
- May be deprecated or integrated into new `useSettingsPersistence`
- Shares same pattern (debounced writes, error handling)

**Integration Point**:
- Review for pattern consistency
- Possibly replace with new hook
- Or keep for backward compatibility

#### useHistory

**Location**: `/opt/workspaces/craftyprep.com/src/hooks/useHistory.ts`

**Relationship**:
- Undo/redo functionality
- NOT persisted (design decision)
- Must work correctly with persisted settings

**Integration Point**:
- Ensure undo/redo works after restoring settings
- Test interaction between persistence and undo/redo
- No conflicts or race conditions

**Testing**:
- Integration test: Adjust → Undo → Reload → Verify no undo history

---

### 4. Existing Utilities

#### presetValidation.ts

**Location**: `/opt/workspaces/craftyprep.com/src/lib/utils/presetValidation.ts`

**Exports**:
- `CustomPresetData` interface
- `isValidCustomPreset()` function
- `loadCustomPreset()` function

**Relationship**:
- Similar validation pattern
- Similar storage/loading pattern
- May be reused or extended

**Integration Point**:
- Reuse validation patterns
- Create similar `isValidPersistedSettings()` function
- Create similar `loadSettings()` function

---

### 5. Type Definitions

#### MaterialPresetName

**Location**: `/opt/workspaces/craftyprep.com/src/lib/types/presets.ts`

**Type**:
```typescript
type MaterialPresetName = 'auto' | 'wood' | 'leather' | 'acrylic' | 'glass' | 'metal' | 'custom';
```

**Usage**: Type for `selectedPreset` in `PersistedSettings`

#### HistoryState

**Location**: `/opt/workspaces/craftyprep.com/src/lib/types/history.ts`

**Type**:
```typescript
interface HistoryState {
  brightness: number;
  contrast: number;
  threshold: number;
  preset: MaterialPresetName;
}
```

**Relationship**: Similar structure to `PersistedSettings`

---

## Component Dependencies

### 1. App.tsx

**Location**: `/opt/workspaces/craftyprep.com/src/App.tsx`

**Current State Management**:
- `selectedPreset` state
- `brightness` state
- `contrast` state
- `threshold` state
- `otsuThreshold` state (calculated, not persisted)

**Required Changes**:
1. Add `useSettingsPersistence` hook call
2. Add `useInitialSettings` hook call on mount
3. Apply restored settings to state
4. Add `clearSettings()` function to handle clear button

**Integration Point**:
- Restore settings on initial mount (before any user interaction)
- Pass settings to persistence hook for auto-save
- Connect clear button to `clearSettings()` function

---

### 2. Footer.tsx

**Location**: `/opt/workspaces/craftyprep.com/src/components/Footer.tsx`

**Required Changes**:
1. Add `ClearSettingsButton` component
2. Add `PrivacyDisclosure` component

**Integration Point**:
- Pass `clearSettings()` function from App.tsx to button
- Ensure button is accessible (keyboard, screen reader)
- Ensure disclosure is visible and readable

---

### 3. MaterialPresetSelector.tsx

**Location**: `/opt/workspaces/craftyprep.com/src/components/MaterialPresetSelector.tsx`

**Current Behavior**:
- Dropdown for preset selection
- Triggers `onChange` callback

**Required Changes**: None (works via App.tsx state)

**Integration Point**:
- Preset changes trigger persistence via App.tsx
- Restored preset sets initial value

---

## Testing Dependencies

### 1. Vitest

**Purpose**: Unit testing

**Already Installed**: Yes

**Usage**:
- Test storage utilities
- Test hooks (renderHook from @testing-library/react)
- Test components

**Test Files**:
- `src/tests/unit/lib/utils/settingsStorage.test.ts`
- `src/tests/unit/hooks/useSettingsPersistence.test.ts`
- `src/tests/unit/hooks/useInitialSettings.test.ts`
- `src/tests/unit/components/ClearSettingsButton.test.ts`
- `src/tests/unit/components/PrivacyDisclosure.test.ts`

---

### 2. @testing-library/react

**Purpose**: React component testing

**Already Installed**: Yes

**Usage**:
- `renderHook` for testing custom hooks
- `render` for testing components
- `fireEvent` / `userEvent` for interaction testing
- `waitFor` for async testing

---

### 3. Playwright

**Purpose**: E2E testing

**Already Installed**: Yes

**Usage**:
- Test persistence across page reloads
- Test with localStorage disabled
- Test clear settings workflow
- Test privacy disclosure visibility

**Test File**:
- `src/tests/e2e/settingsPersistence.e2e.test.ts`

---

## External Dependencies

### None

**Rationale**: This task uses only browser-native localStorage API and existing project dependencies.

**localStorage API** (browser-native):
- `localStorage.setItem(key, value)`
- `localStorage.getItem(key)`
- `localStorage.removeItem(key)`
- `JSON.stringify()` / `JSON.parse()`

**No new npm packages required** ✅

---

## Data Flow Dependencies

### 1. State Flow

```
User Interaction
    ↓
State Update (App.tsx)
    ↓
useSettingsPersistence (auto-save)
    ↓
localStorage.setItem()
    ↓
Debounced Write (500ms)
```

### 2. Restoration Flow

```
Page Load
    ↓
useInitialSettings (mount)
    ↓
localStorage.getItem()
    ↓
Validate Data
    ↓
Apply to State (App.tsx)
    ↓
UI Updates
```

### 3. Clear Flow

```
User Clicks "Clear Settings"
    ↓
clearSettings() function
    ↓
localStorage.removeItem()
    ↓
Reset State to Defaults
    ↓
UI Updates
```

---

## Integration Points Summary

### Required Modifications

1. **App.tsx**
   - Add `useSettingsPersistence` hook
   - Add `useInitialSettings` hook
   - Add `clearSettings()` function
   - Apply restored settings to state

2. **Footer.tsx**
   - Add `<ClearSettingsButton />` component
   - Add `<PrivacyDisclosure />` component

### New Files to Create

1. **Utilities**
   - `src/lib/utils/settingsStorage.ts`

2. **Hooks**
   - `src/hooks/useSettingsPersistence.ts`
   - `src/hooks/useInitialSettings.ts`

3. **Components**
   - `src/components/ClearSettingsButton.tsx`
   - `src/components/PrivacyDisclosure.tsx`

4. **Tests**
   - `src/tests/unit/lib/utils/settingsStorage.test.ts`
   - `src/tests/unit/hooks/useSettingsPersistence.test.ts`
   - `src/tests/unit/hooks/useInitialSettings.test.ts`
   - `src/tests/unit/components/ClearSettingsButton.test.ts`
   - `src/tests/unit/components/PrivacyDisclosure.test.ts`
   - `src/tests/integration/settingsPersistence.integration.test.ts`
   - `src/tests/e2e/settingsPersistence.e2e.test.ts`

---

## Potential Conflicts

### 1. useCustomPresetPersistence vs. useSettingsPersistence

**Issue**: Both hooks may try to save to localStorage

**Resolution Options**:
- **Option A**: Replace `useCustomPresetPersistence` with `useSettingsPersistence`
- **Option B**: Keep both, use different storage keys
- **Option C**: Deprecate old hook, migrate to new hook

**Recommended**: Option A (clean replacement)

### 2. Undo/Redo History Persistence

**Issue**: Should undo/redo history be persisted?

**Decision**: NO (complexity vs. value tradeoff)

**Rationale**:
- History state is complex (array of states)
- Low value (users rarely rely on history across sessions)
- Adds significant complexity to persistence logic

**Alternative**: Document that history is session-only

### 3. Multiple Tabs

**Issue**: Multiple tabs with same app open may conflict

**Decision**: Last write wins (acceptable)

**Future Enhancement**: Use `storage` event to sync between tabs (not in scope)

---

## Documentation Dependencies

### 1. Architecture Documentation

**File**: `.autoflow/docs/ARCHITECTURE.md`

**Update Required**: Document localStorage usage and data flow

### 2. Testing Documentation

**File**: `.autoflow/docs/TESTING.md`

**Update Required**: Add test coverage for persistence features

### 3. Security Documentation

**File**: `.autoflow/docs/SECURITY.md`

**Update Required**: Document privacy-focused storage approach

---

## Browser Compatibility

### localStorage API Support

**Required Browsers** (from CLAUDE.md):
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**localStorage Support**: All required browsers support localStorage fully

**Private Mode Handling**:
- Firefox: localStorage disabled in private mode
- Safari: localStorage limited quota in private mode
- Chrome: localStorage works in incognito mode

**Strategy**: Graceful fallback in all cases

---

## Performance Dependencies

### Debouncing

**Pattern**: Reuse from `useCustomPresetPersistence`

**Implementation**: `setTimeout` + `clearTimeout` with useRef

**Timing**: 500ms (proven to work well)

**No External Library Needed**: Use native browser APIs

---

## Accessibility Dependencies

### WCAG 2.2 AAA Compliance

**Required** (from ACCESSIBILITY.md):
- Color contrast ≥7:1 for normal text
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible

**Components Affected**:
- `ClearSettingsButton` - Must be keyboard accessible
- `PrivacyDisclosure` - Must have sufficient contrast and be readable

**Testing Tools**:
- Lighthouse (accessibility audit)
- axe-core (automated testing)
- Manual screen reader testing (NVDA, VoiceOver)

---

## Timeline Dependencies

**Estimated**: 3 hours total

**Phases**:
1. Storage utilities (30 min) - **No blockers**
2. Persistence hook (30 min) - **Depends on Phase 1**
3. Restoration hook (30 min) - **Depends on Phase 1**
4. App.tsx integration (30 min) - **Depends on Phase 2 & 3**
5. UI components (30 min) - **Depends on Phase 4**
6. E2E testing (30 min) - **Depends on Phase 5**

**Critical Path**: Sequential phases (TDD approach requires tests first)

---

## Risk Assessment

### Low Risk
- localStorage API is well-supported ✅
- Pattern already exists in codebase (`useCustomPresetPersistence`) ✅
- No external dependencies ✅

### Medium Risk
- Integration with undo/redo system (needs testing) ⚠️
- Multiple tabs scenario (acceptable behavior documented) ⚠️

### Mitigation
- Comprehensive testing (unit + integration + E2E)
- Clear documentation of behavior
- Graceful fallbacks for edge cases

---

## Success Criteria

- [ ] All new files created and tested
- [ ] All modifications to existing files completed
- [ ] All dependencies satisfied (no new npm packages needed)
- [ ] No conflicts with existing features
- [ ] Integration with undo/redo tested
- [ ] Browser compatibility verified
- [ ] Accessibility compliance verified
- [ ] Performance targets met (debouncing works)
