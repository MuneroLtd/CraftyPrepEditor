# Dependencies: task-018 - JPG Export Option

---

## Direct Dependencies

### task-009: PNG Download Functionality (Sprint 1)
**Status**: COMMITTED
**Relationship**: Builds upon existing PNG export

**What we're building on**:
- `useImageDownload` hook (src/hooks/useImageDownload.ts)
- `DownloadButton` component (src/components/DownloadButton.tsx)
- Blob creation and download flow
- Filename generation pattern
- Error handling

**What we're adding**:
- Format parameter to hook
- Format selector UI
- JPG-specific export logic
- Dynamic MIME type and quality

---

## Shared Components

### sanitizeFilename utility
**Location**: `src/lib/utils/sanitizeFilename.ts`
**Usage**: Filename sanitization before adding extension
**Changes**: None required

### Canvas API
**Browser API**: HTMLCanvasElement.toBlob()
**Parameters**: callback, mimeType, quality
**PNG**: `toBlob(callback, 'image/png')`
**JPG**: `toBlob(callback, 'image/jpeg', 0.95)`

---

## Code Modifications Required

### 1. useImageDownload Hook
**File**: `src/hooks/useImageDownload.ts`

**Changes**:
- Add format parameter: `format: 'png' | 'jpeg' = 'png'`
- Conditional MIME type: `'image/png'` or `'image/jpeg'`
- Conditional quality: undefined (PNG) or 0.95 (JPG)
- Conditional extension: `.png` or `.jpg`

**Interface updates**:
```typescript
interface UseImageDownloadReturn {
  downloadImage: (
    canvas: HTMLCanvasElement | null,
    originalFilename: string,
    format?: 'png' | 'jpeg'  // NEW
  ) => Promise<void>;
  // ... rest unchanged
}
```

### 2. DownloadButton Component
**File**: `src/components/DownloadButton.tsx`

**Changes**:
- Add format state: `useState<'png' | 'jpeg'>('png')`
- Add format selector UI (radio buttons)
- Update button text based on format
- Pass format to `downloadImage` call

**New UI elements**:
- Format selector (radio group)
- Labels: "PNG" and "JPG"
- Default selected: PNG

### 3. Test Files
**Files to update**:
- `src/tests/unit/hooks/useImageDownload.test.tsx`
- `src/tests/unit/components/DownloadButton.test.tsx`

**New test suites**:
- JPG export tests
- Format selector tests
- Integration tests for format toggle

---

## TypeScript Types

### New Type Definition
```typescript
// Export format type
export type ExportFormat = 'png' | 'jpeg';

// MIME type mapping
const MIME_TYPES: Record<ExportFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
};

// Extension mapping
const EXTENSIONS: Record<ExportFormat, string> = {
  png: 'png',
  jpeg: 'jpg',
};

// Quality settings
const QUALITY: Record<ExportFormat, number | undefined> = {
  png: undefined,
  jpeg: 0.95,
};
```

---

## No External Dependencies

This task requires:
- ✅ No new npm packages
- ✅ No new external APIs
- ✅ No new browser APIs (uses existing Canvas API)
- ✅ No changes to build configuration

---

## Testing Dependencies

### Existing Test Infrastructure
- Vitest (unit/integration)
- React Testing Library
- Playwright (E2E)

### Mock Requirements
- Canvas.toBlob() - already mocked in existing tests
- Blob creation - already mocked
- URL.createObjectURL - already mocked
- DOM methods - already mocked

---

## Design Document References

**Functional Specification**:
- `.autoflow/docs/FUNCTIONAL.md#file-format-options` (FR4.2)
- JPG export specification
- Quality settings (95%)

**Architecture**:
- `.autoflow/docs/ARCHITECTURE.md#export-flow`
- Export flow diagram
- Browser API integration

---

## Risk Assessment

### Low Risk
- Building on proven PNG export foundation
- Canvas API broadly supported
- No breaking changes to existing PNG export

### Mitigation
- Comprehensive test coverage
- Backward compatibility maintained
- PNG remains default (safe fallback)

---

## Dependency Graph

```
task-009 (PNG Export - COMMITTED)
    ├── useImageDownload hook ──────┐
    ├── DownloadButton component ───┤
    ├── sanitizeFilename utility ───┤
    └── Canvas API integration ─────┤
                                     │
                                     ▼
                        task-018 (JPG Export - PENDING)
                            ├── Add format parameter
                            ├── Add format selector UI
                            ├── Add JPG export logic
                            └── Add format-specific tests
```

---

## Breaking Changes

**None** - This is purely additive:
- PNG export continues to work unchanged
- New format parameter is optional (defaults to 'png')
- No changes to existing API signatures (only additions)
- Backward compatible with existing usage
