# Task Plan: Settings Persistence (localStorage)

**Task ID**: task-022
**Title**: Settings Persistence (localStorage)
**Priority**: LOW
**Estimated**: 3 hours
**Status**: PLANNED

---

## Overview

This task extends the existing `useCustomPresetPersistence` hook to persist ALL user settings to localStorage, not just the custom preset. The goal is to restore the user's last session state (preset selection, slider values) when they return to the application, improving UX across sessions.

**Current State**:
- `useCustomPresetPersistence.ts` already exists and handles custom preset persistence
- `loadCustomPreset()` utility already exists in `presetValidation.ts`
- The hook uses debounced writes (500ms) for performance
- Error handling is already implemented for localStorage failures

**What Needs to Change**:
- Extend persistence to include preset selection (not just custom values)
- Restore settings on initial page load
- Add UI for clearing localStorage (optional privacy feature)
- Add privacy disclosure in UI
- Ensure complete test coverage

---

## Objectives

1. Persist preset selection (auto, wood, leather, acrylic, glass, metal, custom)
2. Persist slider values (brightness, contrast, threshold adjustments)
3. Restore persisted settings on page load
4. Provide clear/reset localStorage option
5. Maintain privacy-focused approach (no sensitive data)
6. Add privacy disclosure in UI
7. Ensure robust error handling and graceful fallbacks

---

## Technical Approach

### 1. Storage Strategy

**Storage Key**: `craftyprep-settings` (new, distinct from `craftyprep-custom-preset`)

**Data Structure**:
```typescript
interface PersistedSettings {
  selectedPreset: MaterialPresetName;
  brightness: number;
  contrast: number;
  threshold: number; // Normalized to Otsu baseline
  version: number; // For future schema migrations
}
```

**Why a New Key?**
- Separate concerns: custom preset vs. full settings
- Allow for future migration/deprecation
- Clearer intent and easier to reason about

### 2. Hook Design

**New Hook**: `useSettingsPersistence.ts`

This hook will:
- Save all settings (preset + slider values) to localStorage
- Use debounced writes (500ms) to avoid performance issues
- Validate data before saving (defensive programming)
- Handle localStorage errors gracefully
- Return a `clearSettings()` function for UI integration

**Integration with Existing Code**:
- Keep `useCustomPresetPersistence` for backward compatibility (or deprecate)
- `useSettingsPersistence` will be the primary persistence mechanism
- Both hooks can coexist during migration

### 3. Restoration Logic

**Location**: `App.tsx` (or new `useInitialSettings.ts` hook)

**Timing**: On initial mount (useEffect with empty dependency array)

**Process**:
1. Attempt to load persisted settings from localStorage
2. Validate loaded data
3. If valid, apply to state (selectedPreset, brightness, contrast, threshold)
4. If invalid or unavailable, use defaults (auto preset, 0/0/128 values)
5. Handle edge cases (localStorage disabled, quota exceeded, corrupted data)

### 4. UI Integration

**Clear Settings Button**:
- Location: Footer or Settings panel
- Label: "Clear Saved Settings" or "Reset to Defaults"
- Confirmation dialog (optional, for UX safety)
- Action: Clears localStorage + resets state to defaults

**Privacy Disclosure**:
- Location: Footer (small text) or Help/Info tooltip
- Content: "Settings are saved locally in your browser. No data leaves your device."
- WCAG 2.2 AAA compliance (accessible, readable)

---

## Implementation Phases (TDD Approach)

### Phase 1: Create Storage Utility (Tests First)

**File**: `src/lib/utils/settingsStorage.ts`

**Tests** (`src/tests/unit/lib/utils/settingsStorage.test.ts`):
1. Test data structure validation
2. Test serialization/deserialization
3. Test error handling (localStorage unavailable)
4. Test quota exceeded scenario
5. Test corrupted data handling
6. Test version migration (future-proofing)

**Implementation**:
1. Define `PersistedSettings` interface
2. Create `saveSettings()` function
3. Create `loadSettings()` function with validation
4. Create `clearSettings()` function
5. Create `isValidPersistedSettings()` validation function

**Acceptance Criteria**:
- All tests pass
- Type-safe (TypeScript strict mode)
- Handles all error cases gracefully
- Returns null on failures (never throws)

---

### Phase 2: Create Settings Persistence Hook (Tests First)

**File**: `src/hooks/useSettingsPersistence.ts`

**Tests** (`src/tests/unit/hooks/useSettingsPersistence.test.ts`):
1. Test auto-save on value changes (debounced)
2. Test debounce timing (500ms)
3. Test no save when values haven't changed
4. Test cleanup on unmount
5. Test error handling (localStorage failures)
6. Test integration with different preset types

**Implementation**:
1. Accept all settings as parameters (preset, brightness, contrast, threshold, otsuThreshold)
2. Debounce writes (reuse existing pattern from `useCustomPresetPersistence`)
3. Validate before saving
4. Handle errors gracefully
5. Return `clearSettings()` function

**Acceptance Criteria**:
- All tests pass
- Debouncing works correctly (500ms)
- No unnecessary writes (performance optimization)
- Cleanup prevents memory leaks

---

### Phase 3: Create Initial Settings Restoration (Tests First)

**File**: `src/hooks/useInitialSettings.ts`

**Tests** (`src/tests/unit/hooks/useInitialSettings.test.ts`):
1. Test successful restoration from localStorage
2. Test fallback to defaults when no data exists
3. Test fallback when data is invalid
4. Test fallback when localStorage is unavailable
5. Test that it only runs once (initial mount)

**Implementation**:
1. Load settings on initial mount
2. Validate loaded data
3. Return settings or defaults
4. Handle all error cases gracefully

**Acceptance Criteria**:
- All tests pass
- Only runs once on mount (performance)
- Never crashes the app
- Graceful fallbacks in all cases

---

### Phase 4: Update App.tsx Integration (Tests First)

**File**: `src/App.tsx`

**Tests** (`src/tests/integration/settingsPersistence.integration.test.ts`):
1. Test end-to-end persistence flow (save → reload → restore)
2. Test preset changes persist
3. Test slider changes persist
4. Test clear settings works
5. Test undo/redo doesn't conflict with persistence

**Implementation**:
1. Add `useSettingsPersistence` hook call
2. Add `useInitialSettings` hook call on mount
3. Apply restored settings to state
4. Integrate with existing undo/redo system
5. Test interaction between persistence and undo/redo

**Acceptance Criteria**:
- Settings persist across page reloads
- Undo/redo works correctly with persistence
- No race conditions or conflicts
- User experience is seamless

---

### Phase 5: Add UI Components (Tests First)

**File**: `src/components/ClearSettingsButton.tsx`

**Tests** (`src/tests/unit/components/ClearSettingsButton.test.ts`):
1. Test button renders correctly
2. Test button click clears localStorage
3. Test button click resets state
4. Test disabled state
5. Test accessibility (keyboard, screen reader)

**Implementation**:
1. Create button component with clear icon
2. Add onClick handler to call `clearSettings()`
3. Add confirmation dialog (optional)
4. Ensure WCAG 2.2 AAA compliance
5. Add to Footer or Settings panel

**File**: `src/components/PrivacyDisclosure.tsx`

**Tests** (`src/tests/unit/components/PrivacyDisclosure.test.ts`):
1. Test disclosure renders correctly
2. Test text content is accurate
3. Test accessibility (readable, WCAG compliant)

**Implementation**:
1. Create disclosure component (small text or tooltip)
2. Add privacy message
3. Ensure WCAG 2.2 AAA compliance (contrast, size, etc.)
4. Add to Footer

**Acceptance Criteria**:
- All tests pass
- UI is accessible (keyboard, screen reader)
- Clear visual feedback
- Privacy disclosure is visible and readable

---

### Phase 6: E2E Testing (Playwright)

**File**: `src/tests/e2e/settingsPersistence.e2e.test.ts`

**Tests**:
1. Upload image, adjust settings, reload → settings restored
2. Change preset, reload → preset restored
3. Adjust sliders, reload → slider values restored
4. Click "Clear Settings", reload → defaults restored
5. Test with localStorage disabled → app still works

**Acceptance Criteria**:
- All E2E tests pass
- Real browser testing confirms behavior
- Graceful fallbacks work in all scenarios

---

## File Structure

### New Files

```
src/
├── lib/
│   └── utils/
│       └── settingsStorage.ts              # Storage utilities
├── hooks/
│   ├── useSettingsPersistence.ts           # Auto-save hook
│   └── useInitialSettings.ts               # Restoration hook
├── components/
│   ├── ClearSettingsButton.tsx             # UI for clearing
│   └── PrivacyDisclosure.tsx               # Privacy message
└── tests/
    ├── unit/
    │   ├── lib/
    │   │   └── utils/
    │   │       └── settingsStorage.test.ts
    │   ├── hooks/
    │   │   ├── useSettingsPersistence.test.ts
    │   │   └── useInitialSettings.test.ts
    │   └── components/
    │       ├── ClearSettingsButton.test.ts
    │       └── PrivacyDisclosure.test.ts
    ├── integration/
    │   └── settingsPersistence.integration.test.ts
    └── e2e/
        └── settingsPersistence.e2e.test.ts
```

### Modified Files

```
src/
├── App.tsx                                  # Add hooks, UI components
└── components/
    └── Footer.tsx                           # Add ClearSettingsButton + PrivacyDisclosure
```

---

## Testing Strategy

### Unit Tests

**Coverage Target**: ≥80% (in line with project standards)

**Focus Areas**:
1. Storage utilities (serialization, validation, error handling)
2. Hooks (debouncing, state updates, cleanup)
3. Components (rendering, interactions, accessibility)

**Tools**: Vitest, @testing-library/react

### Integration Tests

**Focus Areas**:
1. End-to-end persistence flow (save → reload → restore)
2. Interaction with undo/redo system
3. Edge cases (multiple rapid changes, localStorage errors)

**Tools**: Vitest

### E2E Tests

**Focus Areas**:
1. Real browser testing with localStorage
2. Page reload scenarios
3. Clear settings workflow
4. Graceful degradation (localStorage disabled)

**Tools**: Playwright

---

## Privacy and Security Considerations

### 1. No Sensitive Data

**What We Store**:
- Preset selection (string: "auto", "wood", etc.)
- Brightness adjustment (number: -100 to 100)
- Contrast adjustment (number: -100 to 100)
- Threshold adjustment (number: -50 to 50)

**What We DON'T Store**:
- Uploaded images (binary data)
- User identity or personal information
- Any data that could identify the user

### 2. Privacy-Focused Approach

**Principles**:
- Data never leaves the browser
- No external API calls for settings
- No tracking or analytics on settings usage
- User can clear data at any time
- Transparent disclosure in UI

### 3. Error Handling

**Scenarios**:
1. **localStorage disabled** (private mode, browser settings):
   - Fallback: App works normally, just doesn't persist
   - No error shown to user (silent degradation)

2. **Quota exceeded** (unlikely with small data):
   - Fallback: Don't save, log warning
   - App continues to work

3. **Corrupted data** (invalid JSON, schema mismatch):
   - Fallback: Clear corrupted data, use defaults
   - No crash, seamless recovery

---

## Edge Cases

### 1. Multiple Tabs

**Scenario**: User opens app in multiple tabs, changes settings in both

**Behavior**:
- Each tab saves independently
- Last tab to save wins (last write wins)
- No synchronization between tabs (acceptable for this use case)

**Future Enhancement**: Use `storage` event to sync between tabs (not in scope)

### 2. Undo/Redo Interaction

**Scenario**: User adjusts slider, hits undo, reloads page

**Expected Behavior**:
- Settings at time of page close are persisted
- Undo/redo state is NOT persisted (complexity vs. value tradeoff)
- After reload, user sees last persisted settings, undo/redo history is clear

**Rationale**: Persisting undo/redo history is complex and low value

### 3. localStorage Unavailable

**Scenario**: Private mode, browser setting, quota exceeded

**Expected Behavior**:
- App works normally (read-only mode for settings)
- No error messages (silent degradation)
- User can still adjust settings, just won't persist

### 4. Schema Changes (Future)

**Scenario**: We add new settings in the future (e.g., `rotation`, `crop`)

**Strategy**:
- Include `version` field in `PersistedSettings`
- Write migration logic when loading old versions
- Gracefully handle unknown fields (ignore or migrate)

---

## Performance Optimization

### 1. Debounced Writes

**Pattern**: Reuse from `useCustomPresetPersistence`

**Timing**: 500ms debounce

**Rationale**: Avoid writing to localStorage on every slider pixel change

### 2. Conditional Saves

**Optimization**: Only save if values have actually changed

**Implementation**: Compare current values to last saved values

**Benefit**: Reduces unnecessary localStorage writes

### 3. Read Once, Write Many

**Pattern**: Load on mount, save on changes

**Benefit**: Minimize localStorage reads (reads are synchronous and block main thread)

---

## Integration with Existing Code

### 1. useCustomPresetPersistence

**Status**: Keep for backward compatibility

**Migration Path**:
- Phase 1: Both hooks coexist
- Phase 2: Migrate to `useSettingsPersistence` only
- Phase 3: Deprecate `useCustomPresetPersistence` (if needed)

**Rationale**: Avoid breaking changes, allow gradual migration

### 2. useHistory (Undo/Redo)

**Interaction**: Undo/redo should work with persisted settings

**Consideration**: History is NOT persisted (design decision)

**Testing**: Ensure undo/redo works after restoring settings

### 3. MaterialPresetSelector

**Change**: No direct changes needed

**Integration**: Preset changes trigger persistence via App.tsx

---

## Definition of Done

- [ ] All unit tests pass (≥80% coverage)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Settings persist across page reloads
- [ ] Settings restored on initial load
- [ ] Clear settings button works
- [ ] Privacy disclosure visible in UI
- [ ] No errors when localStorage unavailable
- [ ] WCAG 2.2 AAA compliance verified
- [ ] Code review passed
- [ ] No performance regressions (debouncing works)
- [ ] Documentation updated (if needed)

---

## Timeline

**Total Estimated**: 3 hours

**Breakdown**:
- Phase 1 (Storage utilities): 30 minutes
- Phase 2 (Persistence hook): 30 minutes
- Phase 3 (Restoration hook): 30 minutes
- Phase 4 (App.tsx integration): 30 minutes
- Phase 5 (UI components): 30 minutes
- Phase 6 (E2E testing): 30 minutes

**Note**: Times are estimates. TDD approach may extend timelines but ensures quality.

---

## References

**Existing Code**:
- `/opt/workspaces/craftyprep.com/src/hooks/useCustomPresetPersistence.ts`
- `/opt/workspaces/craftyprep.com/src/lib/utils/presetValidation.ts`
- `/opt/workspaces/craftyprep.com/src/hooks/useHistory.ts`

**Testing Patterns**:
- `/opt/workspaces/craftyprep.com/src/tests/unit/hooks/useHistory.test.ts`

**Documentation**:
- `/opt/workspaces/craftyprep.com/.autoflow/docs/ARCHITECTURE.md`
- `/opt/workspaces/craftyprep.com/.autoflow/docs/TESTING.md`
- `/opt/workspaces/craftyprep.com/.autoflow/docs/SECURITY.md`
