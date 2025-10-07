# Acceptance Criteria: Settings Persistence (localStorage)

**Task ID**: task-022
**Title**: Settings Persistence (localStorage)

---

## Criterion 1: Custom Preset Saved to localStorage

### Description
All user adjustments to brightness, contrast, and threshold when using the 'custom' preset must be automatically saved to localStorage.

### Implementation Details
- Use existing `useCustomPresetPersistence` hook OR new `useSettingsPersistence` hook
- Save normalized values (brightness: -100 to 100, contrast: -100 to 100, threshold: -50 to 50)
- Debounce writes (500ms) to avoid performance issues
- Validate data before saving

### Verification Steps
1. Upload an image
2. Select "Custom" preset
3. Adjust brightness slider to +20
4. Wait 500ms for debounce
5. Verify `localStorage.getItem('craftyprep-settings')` contains brightness: 20
6. Adjust contrast slider to -10
7. Wait 500ms
8. Verify localStorage updated with contrast: -10
9. Adjust threshold slider to +15
10. Wait 500ms
11. Verify localStorage updated with threshold: +15

### Expected Behavior
- All three slider values are saved to localStorage
- Values are validated before saving
- Debouncing prevents excessive writes
- Invalid values are not saved

### Test Coverage
- **Unit Test**: `useSettingsPersistence.test.ts` - Test auto-save on value changes
- **Unit Test**: `settingsStorage.test.ts` - Test serialization and validation
- **Integration Test**: `settingsPersistence.integration.test.ts` - Test end-to-end save flow

### Edge Cases
- Rapid slider adjustments → Only last value after 500ms is saved
- Invalid values (NaN, Infinity) → Not saved, warning logged
- localStorage quota exceeded → Graceful fallback, app continues

---

## Criterion 2: Settings Restored on Page Load

### Description
When the user returns to the application, their last saved settings (preset selection and slider values) must be automatically restored.

### Implementation Details
- Load settings on initial mount (useEffect with empty dependency array)
- Apply to state: selectedPreset, brightness, contrast, threshold
- Validate loaded data before applying
- Fallback to defaults if no data or invalid data

### Verification Steps
1. Upload an image and apply settings:
   - Select "Wood" preset
   - Brightness: +15
   - Contrast: +10
   - Threshold: +5
2. Wait for debounce (500ms)
3. Reload the page (F5 or Ctrl+R)
4. Verify UI shows:
   - Preset selector: "Wood"
   - Brightness slider: +15
   - Contrast slider: +10
   - Threshold slider: +5
5. Verify image preview matches saved settings

### Expected Behavior
- Settings are restored immediately on page load
- UI reflects restored values accurately
- Image processing applies restored settings
- No flicker or delay in restoration

### Test Coverage
- **Unit Test**: `useInitialSettings.test.ts` - Test successful restoration
- **Unit Test**: `useInitialSettings.test.ts` - Test fallback to defaults
- **Integration Test**: `settingsPersistence.integration.test.ts` - Test reload flow
- **E2E Test**: `settingsPersistence.e2e.test.ts` - Test browser reload scenario

### Edge Cases
- No saved data → Fallback to defaults (auto preset, 0/0/128)
- Corrupted data → Clear localStorage, use defaults
- localStorage disabled → Use defaults, no error shown
- Schema version mismatch → Migrate or use defaults

---

## Criterion 3: Clear/Reset localStorage Option

### Description
Provide a user-facing control to clear saved settings and reset to default values.

### Implementation Details
- Add "Clear Settings" button in Footer or Settings panel
- On click: Clear localStorage + reset state to defaults
- Optional: Confirmation dialog before clearing
- Ensure button is accessible (keyboard, screen reader)

### Verification Steps
1. Upload image and apply custom settings
2. Verify settings are saved to localStorage
3. Click "Clear Settings" button
4. Verify confirmation dialog appears (if implemented)
5. Confirm action
6. Verify localStorage is cleared (`localStorage.getItem('craftyprep-settings')` returns null)
7. Verify UI resets to defaults:
   - Preset: "Auto"
   - Brightness: 0
   - Contrast: 0
   - Threshold: 128 (Otsu calculated)
8. Reload page
9. Verify defaults are shown (no restoration)

### Expected Behavior
- Button is visible and clearly labeled
- Clicking button clears localStorage
- State resets to defaults immediately
- No errors or warnings
- Action is reversible (user can save new settings)

### Test Coverage
- **Unit Test**: `ClearSettingsButton.test.ts` - Test button click clears localStorage
- **Unit Test**: `ClearSettingsButton.test.ts` - Test button click resets state
- **Unit Test**: `ClearSettingsButton.test.ts` - Test accessibility (keyboard, screen reader)
- **E2E Test**: `settingsPersistence.e2e.test.ts` - Test clear settings workflow

### Edge Cases
- localStorage already empty → No error, button still works
- Multiple clicks → Idempotent (no side effects)
- Click during image processing → Safe (no race conditions)

---

## Criterion 4: No Sensitive Data Stored (Privacy-Focused)

### Description
Ensure no sensitive, personal, or identifiable data is stored in localStorage. Only store non-sensitive application settings.

### Implementation Details
- **Allowed data**: Preset name, brightness, contrast, threshold adjustments
- **Forbidden data**: Uploaded images, filenames, user identity, IP addresses, timestamps

### Verification Steps
1. Upload an image named "personal-photo.jpg"
2. Apply various settings
3. Inspect localStorage in browser DevTools
4. Verify stored data contains ONLY:
   - Preset name (string)
   - Brightness value (number)
   - Contrast value (number)
   - Threshold adjustment (number)
   - Schema version (number)
5. Verify stored data does NOT contain:
   - Image binary data
   - Filename
   - Upload timestamp
   - User agent
   - Any personally identifiable information

### Expected Behavior
- localStorage contains minimal, non-sensitive data
- No binary data (images)
- No personally identifiable information
- Data structure is transparent and documented

### Test Coverage
- **Unit Test**: `settingsStorage.test.ts` - Test data structure validation
- **Manual Inspection**: Review localStorage in DevTools
- **Code Review**: Ensure no accidental PII leakage

### Edge Cases
- Malicious data injection → Validation prevents storage
- Schema evolution → Only allowed fields are saved

---

## Criterion 5: Privacy Disclosure in UI (Optional)

### Description
Display a clear, accessible message informing users that settings are saved locally in their browser.

### Implementation Details
- Add small text or tooltip in Footer
- Message: "Settings are saved locally in your browser. No data leaves your device."
- Ensure WCAG 2.2 AAA compliance (contrast, readability)
- Optional: Link to privacy policy or help documentation

### Verification Steps
1. Open application
2. Scroll to Footer
3. Verify privacy disclosure is visible
4. Verify text is readable (contrast ≥7:1 for normal text)
5. Test with screen reader (e.g., NVDA, VoiceOver)
6. Verify message is announced correctly
7. Test keyboard navigation (Tab key)
8. Verify focus indicator is visible

### Expected Behavior
- Disclosure is visible without scrolling (or clearly accessible)
- Text is clear and concise
- Contrast meets WCAG AAA standards
- Screen reader announces message
- Keyboard navigable (if interactive)

### Test Coverage
- **Unit Test**: `PrivacyDisclosure.test.ts` - Test rendering and content
- **Unit Test**: `PrivacyDisclosure.test.ts` - Test accessibility attributes
- **E2E Test**: `settingsPersistence.e2e.test.ts` - Test visibility in real browser
- **Manual Test**: Screen reader testing (NVDA, VoiceOver)

### Edge Cases
- Small screens → Disclosure remains readable
- Dark mode (future) → Contrast maintained
- Long text → No overflow or wrapping issues

---

## Criterion 6: Unit Tests for Storage/Retrieval

### Description
Comprehensive unit test coverage for all localStorage operations (save, load, clear, validate).

### Implementation Details
- Test files:
  - `settingsStorage.test.ts` - Storage utilities
  - `useSettingsPersistence.test.ts` - Persistence hook
  - `useInitialSettings.test.ts` - Restoration hook
- Coverage target: ≥80%
- Test all success paths and error paths

### Verification Steps
1. Run `npm run test:coverage`
2. Verify test coverage for:
   - `lib/utils/settingsStorage.ts`: ≥80%
   - `hooks/useSettingsPersistence.ts`: ≥80%
   - `hooks/useInitialSettings.ts`: ≥80%
3. Verify all tests pass
4. Review coverage report for untested branches

### Expected Behavior
- All tests pass ✅
- Coverage ≥80% for all persistence-related files
- Tests cover:
  - Success scenarios (save, load, clear)
  - Error scenarios (localStorage unavailable, quota exceeded, corrupted data)
  - Edge cases (empty data, invalid data, rapid changes)

### Test Coverage Requirements

#### Storage Utilities (`settingsStorage.test.ts`)
- ✅ Test `saveSettings()` success
- ✅ Test `saveSettings()` with localStorage unavailable
- ✅ Test `saveSettings()` with quota exceeded
- ✅ Test `loadSettings()` success
- ✅ Test `loadSettings()` with no data
- ✅ Test `loadSettings()` with corrupted data
- ✅ Test `loadSettings()` with localStorage unavailable
- ✅ Test `clearSettings()` success
- ✅ Test `isValidPersistedSettings()` with valid data
- ✅ Test `isValidPersistedSettings()` with invalid data

#### Persistence Hook (`useSettingsPersistence.test.ts`)
- ✅ Test auto-save on value changes
- ✅ Test debouncing (500ms)
- ✅ Test no save when values unchanged
- ✅ Test cleanup on unmount
- ✅ Test error handling (localStorage failures)
- ✅ Test with different preset types

#### Restoration Hook (`useInitialSettings.test.ts`)
- ✅ Test successful restoration
- ✅ Test fallback to defaults (no data)
- ✅ Test fallback to defaults (invalid data)
- ✅ Test fallback to defaults (localStorage unavailable)
- ✅ Test runs only once on mount

### Edge Cases
- Mock localStorage failures in tests
- Test with various invalid data shapes
- Test concurrent saves (debouncing)

---

## Criterion 7: Error Handling for localStorage Unavailable

### Description
Application must gracefully handle scenarios where localStorage is unavailable (private mode, browser settings, quota exceeded).

### Implementation Details
- Wrap all localStorage calls in try/catch blocks
- Log errors to console (no user-facing error messages)
- Fallback to in-memory state (app continues to work)
- No crashes or broken UI

### Verification Steps

#### Test 1: Private Mode (Firefox/Safari)
1. Open application in private browsing mode
2. Verify app loads without errors
3. Upload image and adjust settings
4. Verify sliders work (changes apply to preview)
5. Reload page
6. Verify settings are NOT restored (expected behavior)
7. Verify no error messages shown to user
8. Verify console shows warnings (not errors)

#### Test 2: localStorage Disabled
1. Open browser DevTools
2. Disable localStorage (via browser extension or DevTools)
3. Reload application
4. Verify app loads without errors
5. Upload image and adjust settings
6. Verify UI works normally
7. Reload page
8. Verify settings are NOT restored
9. Verify no crashes or broken UI

#### Test 3: Quota Exceeded (Edge Case)
1. Fill localStorage to quota limit (via DevTools)
2. Reload application
3. Adjust settings (trigger save attempt)
4. Verify app continues to work
5. Verify console shows warning (not error)
6. Verify no user-facing error message

### Expected Behavior
- App never crashes due to localStorage errors
- Silent degradation (features work, just don't persist)
- Console warnings (for debugging) but no user-facing errors
- Graceful fallbacks in all scenarios

### Test Coverage
- **Unit Test**: `settingsStorage.test.ts` - Test localStorage unavailable
- **Unit Test**: `settingsStorage.test.ts` - Test quota exceeded
- **Unit Test**: `useSettingsPersistence.test.ts` - Test error handling
- **Unit Test**: `useInitialSettings.test.ts` - Test fallback to defaults
- **E2E Test**: `settingsPersistence.e2e.test.ts` - Test with localStorage disabled

### Edge Cases
- localStorage becomes unavailable mid-session → Graceful degradation
- localStorage quota exceeded during save → No save, app continues
- Multiple tabs with localStorage disabled → Each tab works independently

---

## Overall Verification

### Integration Test Scenarios

1. **End-to-End Persistence Flow**
   - Upload image → Adjust settings → Wait → Reload → Verify restoration

2. **Undo/Redo Integration**
   - Adjust settings → Undo → Redo → Reload → Verify persisted state (not undo history)

3. **Preset Switching**
   - Select preset → Adjust sliders → Switch preset → Reload → Verify last preset restored

4. **Clear Settings Workflow**
   - Save settings → Clear → Reload → Verify defaults shown

### E2E Test Scenarios (Playwright)

1. **Happy Path**
   - Full workflow in real browser with localStorage enabled

2. **localStorage Disabled**
   - Test app behavior with localStorage disabled

3. **Multiple Sessions**
   - Save settings → Close browser → Reopen → Verify restoration

4. **Clear Settings**
   - Test clear button in real browser

### Performance Verification

1. **Debouncing**
   - Rapid slider adjustments → Verify only 1 write after 500ms

2. **No Memory Leaks**
   - Adjust settings 100 times → Verify no memory increase

3. **Fast Load Time**
   - Verify restoration doesn't slow down initial page load

---

## Definition of Done Checklist

- [ ] All 7 acceptance criteria verified and passing
- [ ] Unit test coverage ≥80% for all new files
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing in Firefox, Chrome, Safari
- [ ] Manual testing with localStorage disabled (private mode)
- [ ] Screen reader testing (NVDA or VoiceOver)
- [ ] Keyboard navigation testing
- [ ] Code review passed
- [ ] No performance regressions
- [ ] WCAG 2.2 AAA compliance verified
- [ ] Privacy disclosure visible and accessible
- [ ] No sensitive data stored in localStorage
- [ ] Error handling robust (no crashes)

---

## Success Metrics

1. **Functionality**: Settings persist across sessions ✅
2. **Reliability**: App works even when localStorage unavailable ✅
3. **Performance**: No noticeable lag from debouncing ✅
4. **Privacy**: No sensitive data stored ✅
5. **Accessibility**: WCAG 2.2 AAA compliant ✅
6. **Testing**: ≥80% coverage ✅
7. **User Experience**: Seamless restoration, clear UI ✅
