# Research: File Upload Component

**Task ID**: task-003
**Research Date**: 2025-10-04

---

## Browser File API Research

### File Object Properties

```typescript
interface File extends Blob {
  readonly name: string;          // "photo.jpg"
  readonly size: number;          // bytes
  readonly type: string;          // MIME type "image/jpeg"
  readonly lastModified: number;  // timestamp
}
```

**Key Properties for Validation**:
- `type` - MIME type (use for whitelist validation)
- `size` - File size in bytes (use for size limit)
- `name` - Filename with extension (use for extension validation)

**Usage**:
```typescript
const file = event.dataTransfer.files[0]; // From drag-drop
const file = event.target.files[0];       // From input
console.log(file.type);  // "image/jpeg"
console.log(file.size);  // 2097152 (2MB)
console.log(file.name);  // "vacation.jpg"
```

---

## Drag-and-Drop API Research

### Event Flow

1. **dragenter** - File enters drop zone
2. **dragover** - File is over drop zone (fires repeatedly)
3. **dragleave** - File leaves drop zone
4. **drop** - File is dropped

### Critical Implementation Details

**Must call `preventDefault()` on dragover**:
```typescript
function handleDragOver(event: React.DragEvent) {
  event.preventDefault(); // Required to enable drop
}
```

**Access files from dataTransfer**:
```typescript
function handleDrop(event: React.DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect(files[0]); // Take first file
  }
}
```

**Prevent dragenter/dragleave flicker**:
```typescript
const [dragCounter, setDragCounter] = useState(0);

function handleDragEnter() {
  setDragCounter(prev => prev + 1);
}

function handleDragLeave() {
  setDragCounter(prev => prev - 1);
}

const isHighlighted = dragCounter > 0;
```

---

## File Validation Research

### MIME Type Validation

**Allowed MIME Types** (per SECURITY.md):
```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',   // Some browsers use this
  'image/png',
  'image/gif',
  'image/bmp'
];
```

**Security Note**: MIME type can be spoofed, so must also validate:
1. File extension (regex)
2. Image decode (try to load as image)

### Extension Validation

**Regex Pattern**:
```typescript
const EXTENSION_REGEX = /\.(jpe?g|png|gif|bmp)$/i;
// Matches: .jpg, .jpeg, .png, .gif, .bmp (case-insensitive)
```

**Edge Cases**:
- `photo.JPG` → Valid (case-insensitive)
- `photo.jpg.exe` → Invalid (ends with .exe)
- `photo` → Invalid (no extension)
- `photo.` → Invalid (empty extension)

### File Size Validation

**10MB Limit**:
```typescript
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB = 10485760 bytes
const isValid = file.size <= MAX_SIZE_BYTES;
```

**Display Size in Error**:
```typescript
const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
const errorMsg = `File too large. Maximum size is 10MB. Your file is ${sizeMB}MB.`;
```

### Image Decode Validation

**Purpose**: Ensure file is actually a valid image, not malware disguised as image.

**Implementation**:
```typescript
function validateImageDecode(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url); // Cleanup
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url); // Cleanup
      reject(new Error('Unable to load image. File may be corrupted.'));
    };

    img.src = url;
  });
}
```

**Timeout** (prevent hanging):
```typescript
const DECODE_TIMEOUT = 10000; // 10 seconds

function validateImageDecode(file: File): Promise<HTMLImageElement> {
  return Promise.race([
    loadImage(file),
    timeout(DECODE_TIMEOUT, 'Image loading timed out')
  ]);
}
```

### Dimension Validation

**Limits** (per SECURITY.md):
- Max width: 10000px
- Max height: 10000px
- Max total pixels: 100 megapixels (100,000,000 pixels)

**Implementation**:
```typescript
function validateDimensions(img: HTMLImageElement): ValidationResult {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const totalPixels = width * height;

  const MAX_DIMENSION = 10000;
  const MAX_PIXELS = 100 * 1000 * 1000; // 100MP

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Image dimensions too large. Maximum is ${MAX_DIMENSION}×${MAX_DIMENSION} pixels.`
    };
  }

  if (totalPixels > MAX_PIXELS) {
    return {
      valid: false,
      error: 'Image is too complex to process. Please use a smaller image.'
    };
  }

  return { valid: true };
}
```

---

## Filename Sanitization Research

### Dangerous Characters

**Characters to Replace** (per SECURITY.md):
- `/` - Directory separator (Unix)
- `\` - Directory separator (Windows)
- `?` - Query string
- `%` - URL encoding
- `*` - Wildcard
- `:` - Drive separator (Windows)
- `|` - Pipe
- `"` - Quote
- `<` - Redirect
- `>` - Redirect

**Implementation**:
```typescript
function sanitizeFilename(filename: string): string {
  // Replace dangerous characters with underscore
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}
```

**Examples**:
- `my/photo.jpg` → `my_photo.jpg`
- `photo?.jpg` → `photo_.jpg`
- `<script>.jpg` → `_script_.jpg`
- `safe_photo.jpg` → `safe_photo.jpg` (unchanged)

---

## Progress Tracking Research

### FileReader Progress Events

**For files >2MB**, show progress bar:

```typescript
function readFileWithProgress(file: File, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(Math.round(percent));
      }
    };

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}
```

**Usage**:
```typescript
if (file.size > 2 * 1024 * 1024) { // >2MB
  await readFileWithProgress(file, (percent) => {
    setProgress(percent); // Update progress bar
  });
}
```

---

## Accessibility Research

### Keyboard Navigation

**Required Behavior**:
1. **Tab** → Focus on dropzone (visible outline)
2. **Enter/Space** → Open file picker
3. **Escape** → Dismiss error message

**Implementation**:
```typescript
<div
  role="button"
  tabIndex={0}
  onClick={openFilePicker}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  }}
  aria-label="Upload image file. Drag and drop or press Enter to browse."
>
  {/* Dropzone content */}
</div>
```

### Screen Reader Announcements

**ARIA Live Regions**:

**Error messages** (assertive - interrupts):
```typescript
<div role="alert" aria-live="assertive">
  {error}
</div>
```

**Progress updates** (polite - doesn't interrupt):
```typescript
<div aria-live="polite" aria-atomic="true">
  Loading image: {progress}%
</div>
```

**Status messages**:
```typescript
<div role="status" aria-live="polite">
  Image uploaded successfully: {filename}
</div>
```

### Focus Management

**On error**:
1. Announce error via aria-live
2. Move focus to error close button
3. Allow Escape key to close

**After upload**:
1. Announce success via aria-live
2. Keep focus on dropzone (for next upload)

---

## Performance Research

### Validation Performance

**Expected Times** (per FUNCTIONAL.md):
- File type check: <1ms (synchronous)
- Extension check: <1ms (regex)
- Size check: <1ms (property read)
- Filename sanitization: <1ms (regex replace)
- Image decode: 50-500ms (async, depends on file size)
- Dimension check: <1ms (after decode)

**Total Expected**: <1 second for 2MB image

### Memory Management

**Blob URL Cleanup**:
```typescript
const url = URL.createObjectURL(file);
// ... use url ...
URL.revokeObjectURL(url); // MUST cleanup to prevent memory leak
```

**When to cleanup**:
- After image loads successfully
- After image fails to load
- When component unmounts
- When new file uploaded (replace old URL)

---

## React Patterns Research

### Custom Hook Pattern

**useFileUpload Hook**:
```typescript
function useFileUpload() {
  const [state, setState] = useState({
    file: null,
    image: null,
    isLoading: false,
    error: null,
    progress: 0
  });

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await validateFile(file);
      if (!result.valid) {
        setState(prev => ({ ...prev, error: result.error, isLoading: false }));
        return;
      }

      setState({
        file,
        image: result.image,
        isLoading: false,
        error: null,
        progress: 100
      });
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  return { ...state, handleFileSelect };
}
```

### Component Composition

**Separation of Concerns**:
1. **FileDropzone** - Presentation + drag-drop events
2. **FileUploadError** - Error display
3. **FileUploadProgress** - Progress bar
4. **FileUploadComponent** - Orchestration

**Benefits**:
- Easy to test each component in isolation
- Reusable components
- Clear responsibilities
- Better maintainability

---

## Testing Research

### Unit Test Patterns

**Mocking File Objects**:
```typescript
function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
}

// Usage:
const validFile = createMockFile('photo.jpg', 1024 * 1024, 'image/jpeg');
const invalidFile = createMockFile('doc.pdf', 1024, 'application/pdf');
```

**Mocking Image Load**:
```typescript
// Mock successful load
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(url: string) {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }

  naturalWidth = 1920;
  naturalHeight = 1080;
};
```

**Testing Drag Events**:
```typescript
import { fireEvent } from '@testing-library/react';

const file = createMockFile('photo.jpg', 1024, 'image/jpeg');
const dropzone = screen.getByRole('button', { name: /upload/i });

fireEvent.drop(dropzone, {
  dataTransfer: { files: [file] }
});
```

---

## Error Handling Research

### Validation Pipeline Pattern

**Fail Fast Approach**:
```typescript
async function validateFile(file: File): Promise<ValidationResult> {
  // Check 1: MIME type
  if (!validateFileType(file)) {
    return { valid: false, error: 'Unsupported file type...' };
  }

  // Check 2: Extension
  if (!validateFileExtension(file.name)) {
    return { valid: false, error: 'Unsupported file type...' };
  }

  // Check 3: Size
  if (!validateFileSize(file)) {
    return { valid: false, error: 'File too large...' };
  }

  // Check 4: Sanitize filename
  const sanitizedFilename = sanitizeFilename(file.name);

  // Check 5: Decode image (async)
  let image: HTMLImageElement;
  try {
    image = await validateImageDecode(file);
  } catch (err) {
    return { valid: false, error: 'Unable to load image...' };
  }

  // Check 6: Dimensions
  const dimResult = validateImageDimensions(image);
  if (!dimResult.valid) {
    return { valid: false, error: dimResult.error };
  }

  // All checks passed
  return { valid: true, sanitizedFilename, image };
}
```

**Benefits**:
- Early exit on first failure (performance)
- Clear error messages
- Easy to test each validator
- Easy to add new validators

---

## Key Findings

**Implementation Decisions**:
1. Use pure functions for validators (easy to test)
2. Use custom hook for state management (reusable)
3. Use component composition (separation of concerns)
4. Validate in sequence with fail-fast (performance)
5. Clean up Blob URLs immediately (memory management)
6. Show progress only for >2MB files (UX)
7. Use aria-live for screen readers (accessibility)

**Security Practices**:
1. Double validation: MIME + extension
2. Image decode validation (prevent malware)
3. Dimension limits (prevent DoS)
4. Filename sanitization (prevent path traversal)
5. Client-side only (no server risk)

**Performance Targets**:
- Validation: <1s for 2MB file
- UI response: <100ms for user actions
- Memory: No leaks (cleanup Blob URLs)

---

**Research Status**: Complete
**Ready for Implementation**: Yes
