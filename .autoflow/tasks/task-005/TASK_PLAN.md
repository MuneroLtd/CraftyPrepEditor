# Task Plan: Grayscale Conversion Algorithm

**Task ID**: task-005
**Status**: PLANNED
**Estimated Effort**: 3 hours
**Priority**: HIGH

---

## Overview

Implement the weighted grayscale conversion algorithm (luminosity method) as a pure function. This is the first step in the auto-prep processing pipeline, converting RGB/RGBA images to single-channel grayscale using human perception-weighted averages.

**Formula**: `Gray = 0.299 × R + 0.587 × G + 0.114 × B`

---

## Implementation Approach

### TDD 5-Phase Breakdown

#### Phase 1: Test Setup (Red Phase) - 45 minutes

**Goal**: Write comprehensive tests before implementation

**Tasks**:
1. Create test file: `src/tests/unit/imageProcessing/grayscale.test.ts`
2. Set up Canvas/ImageData test utilities for Vitest
3. Write test cases:
   - **Pure black**: RGB(0,0,0) → Gray 0
   - **Pure white**: RGB(255,255,255) → Gray 255
   - **Pure red**: RGB(255,0,0) → Gray 76 (0.299 × 255 ≈ 76)
   - **Pure green**: RGB(0,255,0) → Gray 149 (0.587 × 255 ≈ 150)
   - **Pure blue**: RGB(0,0,255) → Gray 29 (0.114 × 255 ≈ 29)
   - **Mixed color**: RGB(128,64,32) → Calculated expected value
   - **Transparent pixels**: Alpha channel preserved unchanged
   - **Full image**: All pixels processed correctly
   - **Performance**: <1 second for 5MP ImageData (~2MB)

**Expected Function Signature**:
```typescript
function convertToGrayscale(imageData: ImageData): ImageData
```

**Deliverables**:
- [ ] Test file created with 9+ test cases
- [ ] All tests fail (RED phase)
- [ ] Test utilities for ImageData creation

---

#### Phase 2: Minimal Implementation (Green Phase) - 30 minutes

**Goal**: Implement simplest solution that makes all tests pass

**Tasks**:
1. Create implementation file: `src/lib/imageProcessing/grayscale.ts`
2. Implement `convertToGrayscale` function:
   - Accept ImageData parameter
   - Create new ImageData with same dimensions
   - Loop through pixels (4 bytes per pixel: R, G, B, A)
   - Apply formula: `gray = Math.round(0.299 * R + 0.587 * G + 0.114 * B)`
   - Set R, G, B to gray value
   - Preserve alpha channel
   - Return new ImageData
3. Run tests until all pass

**Algorithm**:
```typescript
export function convertToGrayscale(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    output.data[i] = gray;
    output.data[i + 1] = gray;
    output.data[i + 2] = gray;
    output.data[i + 3] = alpha;
  }

  return output;
}
```

**Deliverables**:
- [ ] Implementation file created
- [ ] All unit tests pass (GREEN phase)
- [ ] No errors or warnings

---

#### Phase 3: Refactoring & Optimization (Refactor Phase) - 45 minutes

**Goal**: Optimize performance and code quality while keeping tests green

**Tasks**:
1. Extract constants for weights (0.299, 0.587, 0.114)
2. Optimize loop performance:
   - Cache data.length
   - Consider typed array access patterns
3. Add TypeScript strict typing
4. Run performance benchmark (5MP image)
5. Ensure all tests still pass after refactoring

**Optimized Implementation**:
```typescript
const WEIGHT_R = 0.299;
const WEIGHT_G = 0.587;
const WEIGHT_B = 0.114;

export function convertToGrayscale(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const gray = Math.round(
      WEIGHT_R * data[i] +
      WEIGHT_G * data[i + 1] +
      WEIGHT_B * data[i + 2]
    );

    output.data[i] = gray;
    output.data[i + 1] = gray;
    output.data[i + 2] = gray;
    output.data[i + 3] = data[i + 3];
  }

  return output;
}
```

**Performance Targets**:
- 2MB (5MP) image: <1 second
- Memory usage: Reasonable (creates new ImageData)
- No memory leaks (old ImageData GC'd)

**Deliverables**:
- [ ] Code refactored with constants
- [ ] Performance benchmark passing (<1s for 5MP)
- [ ] All tests still green
- [ ] TypeScript strict mode compliance

---

#### Phase 4: Integration & Documentation - 45 minutes

**Goal**: Integrate with processing pipeline and document thoroughly

**Tasks**:
1. Export function from `src/lib/imageProcessing/index.ts`
2. Add comprehensive JSDoc comments
3. Create integration test with Canvas API
4. Add to ImageProcessor class (if exists, or note for future task)
5. Create usage examples
6. Document performance characteristics

**JSDoc Template**:
```typescript
/**
 * Converts an RGB/RGBA image to grayscale using the luminosity method.
 *
 * Uses weighted averages based on human perception:
 * - Red: 29.9%
 * - Green: 58.7%
 * - Blue: 11.4%
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @returns New ImageData with grayscale values (alpha preserved)
 *
 * @example
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 * const grayscale = convertToGrayscale(imageData);
 * ctx.putImageData(grayscale, 0, 0);
 *
 * @performance <1 second for 5MP (2MB) image
 * @pure No side effects, returns new ImageData
 */
```

**Integration Test**:
- Create Canvas in test environment
- Draw colored rectangle
- Apply grayscale conversion
- Verify pixels are grayscale
- Verify pipeline pattern compatibility

**Deliverables**:
- [ ] Function exported from index
- [ ] JSDoc comments complete
- [ ] Integration test written and passing
- [ ] Usage examples documented
- [ ] README entry created

---

#### Phase 5: Code Review & Polish - 15 minutes

**Goal**: Final quality checks and preparation for review

**Tasks**:
1. Run full test suite with coverage
2. Verify coverage ≥80% for grayscale module
3. Run TypeScript type checking (`npm run typecheck`)
4. Run linting (`npm run lint`)
5. Verify no console warnings or errors
6. Review code against acceptance criteria
7. Update task status to REVIEW

**Quality Checks**:
- [ ] Test coverage ≥80%
- [ ] TypeScript strict mode: no errors
- [ ] ESLint: no errors or warnings
- [ ] All acceptance criteria met
- [ ] Performance targets achieved
- [ ] Code is DRY, readable, maintainable

---

## File Structure

```
src/
├── lib/
│   └── imageProcessing/
│       ├── grayscale.ts          (NEW - implementation)
│       ├── index.ts               (UPDATED - export)
│       └── README.md              (UPDATED - docs)
└── tests/
    └── unit/
        └── imageProcessing/
            └── grayscale.test.ts  (NEW - tests)
```

---

## Dependencies

**Code Dependencies**:
- None (native Canvas API only)
- ImageData type (Web API)

**Test Dependencies**:
- Vitest (already configured)
- @vitest/ui (for test UI)
- jsdom (for Canvas API in tests)

**Documentation References**:
- `.autoflow/docs/FUNCTIONAL.md#auto-prep-processing` - Algorithm specification
- `.autoflow/docs/ARCHITECTURE.md#processing-layer` - Pure function pattern

---

## Acceptance Criteria Checklist

- [ ] Grayscale conversion function implemented as pure function
- [ ] Uses correct weighted formula: 0.299 × R + 0.587 × G + 0.114 × B
- [ ] Processes entire ImageData object efficiently
- [ ] Handles edge cases: all-white, all-black, fully transparent pixels
- [ ] Unit tests with known input/output values
- [ ] Unit tests for edge cases
- [ ] Performance: <1 second for 2MB image (5MP @ 2MB)
- [ ] Function signature properly typed (TypeScript)
- [ ] No side effects (pure function)
- [ ] Tests written and passing (≥80% coverage)
- [ ] Algorithm matches specification exactly

---

## Estimated Time Breakdown

| Phase | Time | Cumulative |
|-------|------|------------|
| Phase 1: Test Setup | 45 min | 45 min |
| Phase 2: Implementation | 30 min | 1h 15min |
| Phase 3: Refactoring | 45 min | 2h |
| Phase 4: Integration | 45 min | 2h 45min |
| Phase 5: Review | 15 min | 3h |

**Total**: 3 hours

---

## Risks & Mitigation

**Risk**: Performance doesn't meet <1s target for 5MP image
- **Mitigation**: Optimize loop, consider Web Workers for larger images (future)

**Risk**: Canvas API not available in test environment
- **Mitigation**: Use jsdom with canvas polyfill, or create mock ImageData

**Risk**: Floating-point precision issues in grayscale calculation
- **Mitigation**: Use Math.round() for integer values, verify in tests

---

## Next Steps After Completion

1. Run `/code-review` to verify quality
2. If issues found, run `/review-fix`
3. Once clean, run `/test` for full test suite
4. When tests pass, run `/commit` to archive and commit
5. Move to next task: task-006 (Histogram Equalization)

---

**Created**: 2025-10-05
**Last Updated**: 2025-10-05
