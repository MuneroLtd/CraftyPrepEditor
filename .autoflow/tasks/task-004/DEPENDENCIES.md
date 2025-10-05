# Dependencies: Image Canvas and Preview Display

**Task ID**: task-004
**Status**: PLANNED

---

## Upstream Dependencies (Blockers)

### Task-003: File Upload Component - **REQUIRED**

**Status**: COMPLETE ✅
**Why Required**: Task-004 needs the `uploadedImage` output from task-003

**Provides**:
```typescript
// From useFileUpload hook
interface FileUploadState {
  uploadedImage: HTMLImageElement | null;  // ← Task-004 input
  // ... other state
}
```

**Integration Point**:
- ImagePreview component receives `uploadedImage` prop
- Image is drawn to the "Original" canvas
- Image provides dimensions for aspect ratio calculation

**Verification**:
- [x] useFileUpload hook implemented
- [x] uploadedImage type is HTMLImageElement | null
- [x] Image validation ensures HTMLImageElement is valid and complete

**Risk**: None - task-003 is COMPLETE

---

## Framework/Library Dependencies

### React 19+ - **REQUIRED**

**Version**: ^19.0.0 (specified in package.json)
**Status**: Installed ✅

**Used For**:
- Component architecture (functional components)
- Hooks: useState, useEffect, useRef, useCallback, useMemo
- Event handling (onMouseDown, onMouseMove, onMouseUp)

**API Features Needed**:
- `useRef<HTMLCanvasElement>` - Canvas DOM access
- `useEffect` cleanup functions - Memory management
- `useCallback` - Event handler memoization
- `useMemo` - Expensive calculation caching

**Verification**:
- [x] React 19 installed
- [x] Hooks API available
- [x] TypeScript types for React installed (@types/react)

---

### TypeScript 5.x - **REQUIRED**

**Version**: ^5.6.0
**Status**: Installed ✅

**Used For**:
- Component props interfaces
- Canvas utility function types
- Type-safe event handlers
- HTMLCanvasElement, CanvasRenderingContext2D types

**Type Definitions Needed**:
```typescript
// Built-in browser types (lib.dom.d.ts)
- HTMLCanvasElement
- CanvasRenderingContext2D
- HTMLImageElement
- MouseEvent
- ResizeObserver

// React types
- React.MouseEvent
- React.RefObject
```

**Verification**:
- [x] TypeScript 5.x installed
- [x] lib.dom.d.ts included (browser types)
- [x] @types/react installed

---

### Tailwind CSS 4 - **REQUIRED**

**Version**: ^4.0.0
**Status**: Installed ✅

**Used For**:
- Responsive layout classes (flex, flex-col, lg:flex-row)
- Spacing utilities (gap-4, mb-2, p-4)
- Border and styling (border, border-gray-300, rounded)
- Cursor utilities (cursor-grab, cursor-grabbing)

**Classes Used**:
```css
/* Layout */
flex, flex-col, lg:flex-row, flex-1, gap-4

/* Spacing */
mb-2, mb-4, p-4, max-w-xs, w-full

/* Borders */
border, border-gray-300, rounded

/* Cursors */
cursor-grab, cursor-grabbing

/* Text */
text-lg, text-sm, font-semibold, font-medium, text-right
```

**Verification**:
- [x] Tailwind CSS 4 installed
- [x] tailwind.config.js configured
- [x] Responsive breakpoints defined (lg: 1024px)

---

### shadcn/ui Components - **REQUIRED**

**Status**: Installed ✅

**Components Needed**:
1. **Button** (`src/components/ui/button.tsx`)
   - Used for zoom in/out buttons
   - Used for reset button
   - Props: variant, size, onClick, disabled, aria-label

2. **Slider** (`src/components/ui/slider.tsx`)
   - Used for zoom level slider
   - Props: value, onValueChange, min, max, step, aria-label

**Verification**:
- [x] Button component exists at src/components/ui/button.tsx
- [x] Slider component exists at src/components/ui/slider.tsx
- [x] Components properly typed and tested

---

### lucide-react (Icons) - **REQUIRED**

**Version**: Latest
**Status**: Installed ✅

**Icons Needed**:
- `ZoomIn` - Zoom in button icon
- `ZoomOut` - Zoom out button icon
- `RotateCcw` - Reset button icon

**Usage**:
```typescript
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

<Button>
  <ZoomIn className="h-4 w-4" />
</Button>
```

**Verification**:
- [x] lucide-react installed
- [x] Icons importable and renderable

---

## Browser API Dependencies

### Canvas API - **REQUIRED**

**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
**Status**: Native Browser API ✅

**Methods Used**:
```typescript
// Canvas element
HTMLCanvasElement.getContext('2d')
HTMLCanvasElement.width
HTMLCanvasElement.height

// 2D Context
CanvasRenderingContext2D.drawImage()
CanvasRenderingContext2D.clearRect()
CanvasRenderingContext2D.scale()
CanvasRenderingContext2D.translate()
CanvasRenderingContext2D.save()
CanvasRenderingContext2D.restore()
CanvasRenderingContext2D.setTransform()
```

**Performance Features**:
- Hardware-accelerated rendering
- Off-screen canvas support (future optimization)

**Verification**:
- [x] Canvas API available in target browsers
- [x] 2D context methods supported
- [x] Performance adequate for 2MB images

**Reference**: [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

### Window/DOM APIs - **REQUIRED**

**APIs Used**:
1. **Window Resize**: `window.addEventListener('resize', handler)`
2. **Mouse Events**: `MouseEvent` (clientX, clientY)
3. **Performance API**: `performance.now()` (for timing tests)
4. **requestAnimationFrame**: For smooth pan dragging

**Browser Support**: Universal (all target browsers)
**Status**: Native Browser API ✅

**Verification**:
- [x] resize event listener works
- [x] Mouse events fire correctly
- [x] requestAnimationFrame available
- [x] performance.now() available

---

## Testing Dependencies

### Vitest - **REQUIRED**

**Version**: Latest
**Status**: Installed ✅

**Used For**:
- Unit tests for components
- Unit tests for utilities
- Integration tests
- Performance benchmarks
- Coverage reporting

**Features Needed**:
- `describe`, `it`, `expect`
- `vi.fn()`, `vi.spyOn()`
- `waitFor`, `render`, `screen` (React Testing Library)
- `fireEvent` (mouse events)

**Verification**:
- [x] Vitest installed and configured
- [x] vitest.config.ts configured
- [x] Test setup complete

---

### React Testing Library - **REQUIRED**

**Version**: Latest
**Status**: Installed ✅

**Used For**:
- Component rendering in tests
- DOM queries (screen.getByRole, screen.getByLabelText)
- User interaction simulation (fireEvent)
- Async utilities (waitFor)

**Methods Used**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

render(<Component />)
screen.getByRole('img')
screen.getByLabelText('Zoom in')
fireEvent.click(button)
fireEvent.mouseDown(canvas)
waitFor(() => expect(...))
```

**Verification**:
- [x] @testing-library/react installed
- [x] @testing-library/jest-dom installed
- [x] Test utilities working

---

## Optional/Future Dependencies

### React DevTools Profiler - **OPTIONAL**

**Purpose**: Performance profiling and re-render detection
**Status**: Available as browser extension
**Use Case**: Verify no unnecessary re-renders during zoom/pan

**Not Required For**: Task completion, only for optimization verification

---

## Downstream Dependencies (Consumers)

### Task-008: Auto-Prep Button and Processing Flow

**Status**: PENDING
**Depends On**: Task-004 canvas infrastructure

**Will Use**:
- ImagePreview component (displays processed result)
- Canvas infrastructure (draws processed image)
- `processedImage` prop (output of auto-prep pipeline)

**Integration**:
```typescript
// Task-008 will provide processedImage
<ImagePreview
  originalImage={uploadedImage}
  processedImage={processedImage}  // ← From task-008
/>
```

---

### App.tsx Integration

**Status**: Existing file
**Will Be Modified**: Yes

**Changes Needed**:
```typescript
import { ImagePreview } from '@/components/ImagePreview';
import { useFileUpload } from '@/hooks/useFileUpload';

function App() {
  const { uploadedImage } = useFileUpload();

  return (
    <Layout>
      <FileUploadComponent />

      {uploadedImage && (
        <ImagePreview
          originalImage={uploadedImage}
          processedImage={null}
        />
      )}
    </Layout>
  );
}
```

**Risk**: Low - simple integration, no breaking changes

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                   Upstream Dependencies                  │
└─────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐     ┌──────▼──────┐   ┌────▼────┐
    │ Task-003│     │  React 19   │   │Canvas API│
    │COMPLETE │     │  INSTALLED  │   │ NATIVE   │
    └────┬────┘     └──────┬──────┘   └────┬────┘
         │                 │                │
         │    ┌────────────┴────────────┐   │
         │    │   TypeScript 5.x        │   │
         │    │   Tailwind CSS 4        │   │
         │    │   shadcn/ui (Button,    │   │
         │    │              Slider)    │   │
         │    │   lucide-react (Icons)  │   │
         │    └────────────┬────────────┘   │
         │                 │                │
         └─────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │  TASK-004   │
                    │  ImageCanvas│
                    │  ImagePreview│
                    │  ZoomControls│
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐     ┌──────▼──────┐   ┌────▼────┐
    │ Task-008│     │   App.tsx   │   │ Future  │
    │  PENDING│     │  MODIFIED   │   │  Tasks  │
    └─────────┘     └─────────────┘   └─────────┘

┌─────────────────────────────────────────────────────────┐
│                 Downstream Dependencies                  │
└─────────────────────────────────────────────────────────┘
```

---

## Dependency Verification Checklist

Before starting task-004, verify:

### Required Dependencies Installed
- [x] React 19+ installed and working
- [x] TypeScript 5.x installed and configured
- [x] Tailwind CSS 4 installed and configured
- [x] shadcn/ui Button component available
- [x] shadcn/ui Slider component available
- [x] lucide-react installed
- [x] Vitest installed and configured
- [x] React Testing Library installed

### Required Tasks Complete
- [x] Task-003 (File Upload Component) COMPLETE
- [x] useFileUpload hook provides uploadedImage

### Browser APIs Available
- [x] Canvas API supported in target browsers
- [x] Window resize events work
- [x] Mouse events work
- [x] requestAnimationFrame available
- [x] performance.now() available

### Development Environment Ready
- [x] Node.js 20.19+ installed
- [x] npm/pnpm working
- [x] Development server runs (`npm run dev`)
- [x] Tests run (`npm test`)

---

## Risk Assessment

| Dependency | Risk Level | Impact if Missing | Mitigation |
|------------|------------|-------------------|------------|
| Task-003 uploadedImage | ✅ None | Cannot display image | Complete - no risk |
| React 19 | ✅ None | No component rendering | Installed - no risk |
| TypeScript 5.x | ✅ None | No type safety | Installed - no risk |
| Canvas API | ✅ None | No image rendering | Native browser API - no risk |
| shadcn/ui components | ✅ None | No zoom controls UI | Installed - no risk |
| Tailwind CSS | ✅ None | No responsive layout | Installed - no risk |

**Overall Risk**: **LOW** ✅ All dependencies satisfied

---

## Installation Commands (If Needed)

If any dependencies are missing, run:

```bash
# React 19 + TypeScript (already installed)
# No action needed

# shadcn/ui Button (already installed)
# No action needed

# shadcn/ui Slider (already installed)
# No action needed

# lucide-react (already installed)
# No action needed

# Vitest + React Testing Library (already installed)
# No action needed
```

**Current Status**: All dependencies installed ✅

---

## External Documentation Links

### React Documentation
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [useRef Hook](https://react.dev/reference/react/useRef)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [useMemo Hook](https://react.dev/reference/react/useMemo)

### Canvas API Documentation
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
- [MDN drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

### Testing Documentation
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest API](https://vitest.dev/api/)

### UI Libraries
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

## Summary

**Status**: ✅ ALL DEPENDENCIES SATISFIED

- Upstream dependencies: COMPLETE (task-003)
- Framework dependencies: INSTALLED (React, TypeScript, Tailwind)
- UI dependencies: INSTALLED (shadcn/ui, lucide-react)
- Browser APIs: NATIVE (Canvas API, Window API)
- Testing dependencies: INSTALLED (Vitest, RTL)

**Ready to Start**: YES ✅

**Next Step**: Run `/build` to implement task-004
