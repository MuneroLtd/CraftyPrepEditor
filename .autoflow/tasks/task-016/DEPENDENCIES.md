# Dependencies: Debounced Preview Updates

**Task ID**: task-016
**Status**: PLANNED

---

## Upstream Dependencies (Blockers)

### ✅ All Dependencies Complete

**Task 2.2: Brightness Slider** - COMPLETE
- **Status**: ✅ COMMITTED
- **Provides**: BrightnessSlider component, brightness state management
- **Required For**: Applying debounce to brightness adjustments
- **Impact**: None (complete)

**Task 2.3: Contrast Slider** - COMPLETE
- **Status**: ✅ COMMITTED
- **Provides**: ContrastSlider component, contrast state management
- **Required For**: Applying debounce to contrast adjustments
- **Impact**: None (complete)

**Task 2.4: Threshold Slider** - COMPLETE
- **Status**: ✅ COMMITTED
- **Provides**: ThresholdSlider component, threshold state management
- **Required For**: Applying debounce to threshold adjustments
- **Impact**: None (complete)

**Task 2.5: Canvas Preview Rendering** - COMPLETE
- **Status**: ✅ COMMITTED
- **Provides**: Canvas rendering, ImagePreview component
- **Required For**: Adding loading overlay, measuring processing time
- **Impact**: None (complete)

**Task Background Removal** - COMPLETE
- **Status**: ✅ COMMITTED
- **Provides**: Background removal functionality, sensitivity slider
- **Required For**: Performance testing background removal
- **Impact**: None (complete)

---

## Internal Dependencies (Within Task)

### Already Implemented

1. **useDebounce Hook**
   - **Location**: `src/hooks/useDebounce.ts`
   - **Status**: ✅ Complete
   - **Used By**: App.tsx for all slider values
   - **Quality**: Well-documented, proper cleanup

2. **Debounced Values in App.tsx**
   - **Status**: ✅ Complete
   - **Implementation**: Lines 43-45, 50
   - **Debounced**:
     - `debouncedBrightness`
     - `debouncedContrast`
     - `debouncedThreshold`
     - `debouncedBgSensitivity`

3. **React.memo on RefinementControls**
   - **Status**: ✅ Complete
   - **Location**: `src/components/RefinementControls.tsx` (line 64)
   - **Impact**: Prevents unnecessary re-renders

### To Be Implemented (This Task)

1. **useDelayedLoading Hook**
   - **Status**: ❌ Pending
   - **Location**: `src/hooks/useDelayedLoading.ts` (NEW)
   - **Purpose**: Delayed loading indicator (only show if >500ms)
   - **Used By**: App.tsx for processing state

2. **Processing State in App.tsx**
   - **Status**: ❌ Pending
   - **Implementation**: Add `isProcessing` state
   - **Triggers**: Canvas processing start/complete
   - **Used By**: useDelayedLoading hook

3. **Loading Overlay Component**
   - **Status**: ❌ Pending
   - **Location**: `src/components/ImagePreview.tsx` (modify) or new component
   - **Purpose**: Visual loading indicator
   - **Depends On**: `shouldShowLoading` from useDelayedLoading

4. **Performance Tests**
   - **Status**: ❌ Pending
   - **Location**: `src/tests/unit/performance/adjustments.test.ts` (NEW)
   - **Purpose**: Verify <100ms processing target
   - **Depends On**: Image processing functions

---

## Downstream Dependencies (Tasks Waiting on This)

### None

This task is performance optimization and doesn't block other features.

**Potential Future Tasks**:
- Advanced performance monitoring
- Performance regression testing in CI
- User-configurable debounce delay

---

## External Dependencies

### NPM Packages (Already Installed)

1. **React 19**
   - **Required For**: `useState`, `useEffect`, `memo`
   - **Status**: ✅ Installed
   - **Version**: 19.x

2. **Vitest**
   - **Required For**: Performance tests
   - **Status**: ✅ Installed
   - **Version**: Latest

3. **@testing-library/react**
   - **Required For**: Component testing
   - **Status**: ✅ Installed
   - **Version**: Latest

### Browser APIs (No Dependencies)

1. **performance.now()**
   - **Required For**: Accurate timing in performance tests
   - **Support**: All modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
   - **Fallback**: None needed (required API)

2. **Canvas API**
   - **Required For**: Image processing
   - **Status**: ✅ Already in use
   - **Support**: All target browsers

---

## Technical Dependencies

### State Management

**Pattern**: React useState + useEffect
- **Current**: Immediate state (brightness, contrast, threshold)
- **Debounced**: Debounced values via useDebounce
- **New**: Processing state (isProcessing)

**Flow**:
```
User drags slider
  ↓
Immediate state updates (UI responsive)
  ↓
useDebounce delays value (100ms)
  ↓
Debounced value triggers useEffect
  ↓
setIsProcessing(true)
  ↓
Canvas processing
  ↓
setIsProcessing(false)
  ↓
useDelayedLoading shows indicator if >500ms
```

### Performance Measurement

**Approach**: Direct timing with `performance.now()`
- **Precision**: Microsecond accuracy
- **Overhead**: Minimal (<0.1ms)
- **Reliability**: High (consistent across runs)

**Alternative Considered**: React Profiler
- **Rejected**: Overkill for simple timing, more complex setup

---

## Risk Analysis

### Risk 1: Processing Time Varies by Device

**Description**: Performance tests might fail on slower hardware

**Impact**: Medium
- Tests could be flaky
- CI pipeline might fail inconsistently

**Mitigation**:
- Use realistic image size (1920×1080) consistently
- Allow small margin (110ms instead of 100ms strict)
- Run tests multiple times and average
- Document baseline hardware in tests

**Likelihood**: Low
- Modern hardware is fast enough
- Canvas operations are optimized
- 100ms target is reasonable

---

### Risk 2: Loading Indicator Flashing

**Description**: Loading indicator might flash on/off rapidly

**Impact**: Low
- Bad UX if flashing
- Annoying for users

**Mitigation**:
- 500ms delay prevents most flashing
- Only show for genuinely slow operations
- Test with various image sizes
- User testing to validate UX

**Likelihood**: Very Low
- Debouncing already prevents rapid updates
- 500ms delay is sufficient buffer

---

### Risk 3: Performance Regression Over Time

**Description**: Future changes might slow down processing

**Impact**: Medium
- Performance could degrade unnoticed
- User experience suffers

**Mitigation**:
- Run performance tests in CI
- Monitor test execution times
- Alert on performance regression
- Regular performance audits

**Likelihood**: Medium
- Natural code evolution can impact performance
- Performance tests will catch regressions

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                   Task 2.2-2.5                          │
│              (Sliders + Canvas - COMPLETE)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              useDebounce Hook (COMPLETE)                 │
│           Debounced values in App (COMPLETE)             │
│        React.memo on components (COMPLETE)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│               REMAINING WORK (This Task)                 │
│                                                          │
│  ┌────────────────────┐    ┌──────────────────────┐    │
│  │ useDelayedLoading  │    │  Performance Tests   │    │
│  │      Hook          │    │   (4 test suites)    │    │
│  └─────────┬──────────┘    └──────────────────────┘    │
│            │                                             │
│            ↓                                             │
│  ┌────────────────────┐                                 │
│  │  Processing State  │                                 │
│  │    in App.tsx      │                                 │
│  └─────────┬──────────┘                                 │
│            │                                             │
│            ↓                                             │
│  ┌────────────────────┐                                 │
│  │  Loading Overlay   │                                 │
│  │   (ImagePreview)   │                                 │
│  └────────────────────┘                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Dependency Summary

**Status**: ✅ Ready to implement

**Blockers**: None
- All upstream tasks complete
- All required libraries installed
- All browser APIs supported

**Remaining Work**: 2 features
1. Delayed loading indicator (~1 hour)
2. Performance tests (~30 mins)

**Total Estimated Effort**: 1.5 hours

**Confidence**: High
- Clear implementation path
- No external blockers
- Existing patterns to follow (useDebounce as reference)

**Next Step**: Run `/build` to implement remaining work
