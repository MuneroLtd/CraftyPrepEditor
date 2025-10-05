# Dependencies: PNG Export and Download

**Task ID**: task-009
**Created**: 2025-10-05

---

## Task Dependencies

### Hard Dependencies (Must Complete First)

**Task 1.8: Auto-Prep Button and Processing Flow** (`task-008`)
- **Status**: COMPLETE
- **Reason**: Download requires processed image to exist
- **Provides**:
  - `processedImage` (HTMLCanvasElement) from `useImageProcessing` hook
  - Canvas with final processed result ready for export

**Task 1.4: Image Preview Canvas** (`task-004`)
- **Status**: COMPLETE
- **Reason**: Download exports from canvas element
- **Provides**:
  - Canvas rendering logic
  - Canvas element reference

**Task 1.1: Project Setup** (`task-001`)
- **Status**: COMPLETE
- **Reason**: Provides base project structure, TypeScript config, testing setup
- **Provides**:
  - TypeScript configuration
  - Testing frameworks (Vitest, React Testing Library)
  - Build tools (Vite)

---

## External Dependencies

### NPM Packages (Already Installed)

**React** (v19.0.0)
- Used for: Component creation, hooks
- Already installed: ✅

**TypeScript** (v5.6.3)
- Used for: Type safety
- Already installed: ✅

**Vitest** (latest)
- Used for: Unit testing
- Already installed: ✅

**@testing-library/react** (latest)
- Used for: Component testing
- Already installed: ✅

**@heroicons/react** (v2.2.0)
- Used for: Download icon (ArrowDownTrayIcon)
- Already installed: ✅

### New Dependencies Required

**None** - All required functionality is provided by:
- Browser Canvas API (`HTMLCanvasElement.toBlob()`)
- Browser Blob API (`URL.createObjectURL()`, `URL.revokeObjectURL()`)
- Browser File API (already used for upload)
- React hooks (useState, useCallback)

---

## Code Dependencies

### Existing Hooks to Update

**`src/hooks/useFileUpload.ts`**
- **Current Exports**: `{ uploadedImage: string | null }`
- **Required Update**: Add `uploadedFile: File | null` to exports
- **Reason**: Need original filename from File object
- **Impact**: Minor change, backward compatible (existing code still works)

**Update Required**:
```typescript
// Before:
return { uploadedImage };

// After:
return { uploadedImage, uploadedFile };
```

### Existing Components to Update

**`src/App.tsx`**
- **Current**: Uses `uploadedImage` from `useFileUpload`
- **Required Update**: Also destructure `uploadedFile`
- **Required Update**: Import and render `DownloadButton`
- **Impact**: Small addition, no breaking changes

---

## Browser API Dependencies

### Canvas API

**Method**: `HTMLCanvasElement.toBlob(callback, type)`
- **Browser Support**: Chrome 50+, Firefox 19+, Safari 11+, Edge 79+
- **Our Target**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ ✅
- **Fallback**: None needed (all target browsers support it)

**Example**:
```typescript
canvas.toBlob((blob) => {
  // blob is ready for download
}, 'image/png');
```

### Blob API

**Method**: `URL.createObjectURL(blob)`
- **Browser Support**: All modern browsers ✅
- **Purpose**: Create downloadable URL from blob

**Method**: `URL.revokeObjectURL(url)`
- **Browser Support**: All modern browsers ✅
- **Purpose**: Clean up blob URL to prevent memory leaks

### DOM API

**Element**: `document.createElement('a')`
- **Browser Support**: Universal ✅
- **Purpose**: Create anchor element for download trigger

**Attribute**: `anchor.download = filename`
- **Browser Support**: All modern browsers ✅
- **Purpose**: Trigger download instead of navigation

---

## Data Dependencies

### Input Data Required

**From `useImageProcessing` hook**:
- `processedImage: HTMLCanvasElement | null`
  - The canvas element with processed/laser-ready image
  - Created by auto-prep processing pipeline
  - Contains pixel data ready for export

**From `useFileUpload` hook** (after update):
- `uploadedFile: File | null`
  - Original File object from user upload
  - Contains `.name` property for filename generation
  - Example: `{ name: "photo.jpg", size: 2048000, type: "image/jpeg", ... }`

---

## Type Dependencies

### TypeScript Types Required

**React Types** (already available):
```typescript
import { useState, useCallback } from 'react';
```

**DOM Types** (already available via TypeScript lib):
```typescript
HTMLCanvasElement
Blob
File
HTMLAnchorElement
```

**Custom Types to Create**:
```typescript
// In useImageDownload.ts
interface UseImageDownloadReturn {
  downloadImage: (canvas: HTMLCanvasElement | null, originalFilename: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

// In DownloadButton.tsx
interface DownloadButtonProps {
  canvas: HTMLCanvasElement | null;
  originalFilename: string;
  disabled?: boolean;
}
```

---

## Testing Dependencies

### Test Utilities

**@testing-library/react**:
- `render()` - Render components
- `screen` - Query rendered elements
- `fireEvent` - Simulate user interactions
- `waitFor()` - Async testing

**@testing-library/jest-dom**:
- Custom matchers: `toBeInTheDocument()`, `toBeDisabled()`, etc.

**Vitest**:
- `describe()`, `it()`, `expect()` - Test structure
- `vi.fn()` - Mock functions
- `vi.mock()` - Module mocking

### Mock Data Required

**Mock Canvas Element**:
```typescript
const mockCanvas = {
  toBlob: vi.fn((callback) => {
    const blob = new Blob(['fake image data'], { type: 'image/png' });
    callback(blob);
  })
} as unknown as HTMLCanvasElement;
```

**Mock File Object**:
```typescript
const mockFile = new File(['image data'], 'test-photo.jpg', { type: 'image/jpeg' });
```

---

## File System Dependencies

### New Files to Create

```
src/
├── components/
│   └── DownloadButton.tsx                    # New component
├── hooks/
│   ├── useFileUpload.ts                      # Update: add uploadedFile
│   └── useImageDownload.ts                   # New hook
├── lib/
│   └── utils/
│       └── sanitizeFilename.ts               # New utility
└── tests/
    └── unit/
        ├── components/
        │   └── DownloadButton.test.tsx       # New test
        ├── hooks/
        │   └── useImageDownload.test.tsx     # New test
        └── lib/
            └── utils/
                └── sanitizeFilename.test.ts  # New test
```

### Existing Files to Modify

```
src/
├── App.tsx                                   # Add DownloadButton
└── hooks/
    └── useFileUpload.ts                      # Expose uploadedFile
```

---

## No Blockers

**Current Status**: All dependencies met ✅

- ✅ Task 1.8 (Auto-Prep) is COMPLETE → `processedImage` available
- ✅ All required browser APIs supported in target browsers
- ✅ No new npm packages needed
- ✅ Existing hooks can be updated without breaking changes
- ✅ Testing infrastructure already in place

---

## Dependency Graph

```
task-009 (PNG Export)
├── task-008 (Auto-Prep) [COMPLETE] ✅
│   └── provides: processedImage canvas
├── task-004 (Preview Canvas) [COMPLETE] ✅
│   └── provides: canvas rendering patterns
├── task-001 (Project Setup) [COMPLETE] ✅
│   └── provides: build tools, testing, TypeScript
└── Browser APIs [AVAILABLE] ✅
    ├── Canvas API (toBlob)
    ├── Blob API (createObjectURL, revokeObjectURL)
    └── DOM API (createElement, download attribute)
```

---

**Ready for Implementation**: All dependencies satisfied ✅
