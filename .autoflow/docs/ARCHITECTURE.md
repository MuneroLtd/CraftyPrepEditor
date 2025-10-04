# Technical Architecture

## System Architecture

### Architecture Pattern

**Selected Pattern**: Single Page Application (SPA) with Client-Side Processing

**Rationale**:
- No backend required for MVP (reduces complexity and cost)
- All image processing happens in browser (Canvas API)
- Fast, responsive user experience (no network latency)
- Privacy-focused (no data leaves user's device)
- Simple deployment (static file hosting)
- Scales horizontally via CDN

**Trade-offs**:
- Limited by browser capabilities and memory
- No server-side persistence (intentional for privacy)
- Processing power limited to user's device
- No cross-device sync (acceptable for MVP)

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (Foundation & Core Processing)
- **Tasks**: To be planned
- **Status**: Architecture pattern defined

---

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         Browser                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    React Application                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │  Upload    │  │  Auto-Prep │  │   Refinement     │  │  │
│  │  │  Component │──│  Engine    │──│   Controls       │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │  │
│  │         │               │                  │            │  │
│  │         └───────────────┴──────────────────┘            │  │
│  │                         │                               │  │
│  │                  ┌──────▼──────┐                        │  │
│  │                  │   Canvas    │                        │  │
│  │                  │   API       │                        │  │
│  │                  └──────┬──────┘                        │  │
│  │                         │                               │  │
│  │                  ┌──────▼──────┐                        │  │
│  │                  │  Image      │                        │  │
│  │                  │  Processing │                        │  │
│  │                  │  Pipeline   │                        │  │
│  │                  └──────┬──────┘                        │  │
│  │                         │                               │  │
│  │                  ┌──────▼──────┐                        │  │
│  │                  │  Export/    │                        │  │
│  │                  │  Download   │                        │  │
│  │                  └─────────────┘                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  Browser APIs                            │  │
│  │  • Canvas API      • Blob API        • File API         │  │
│  │  • localStorage    • URL API                            │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘

                              │
                              ▼
                    ┌──────────────────┐
                    │  Static Hosting  │
                    │  (nginx/Traefik) │
                    └──────────────────┘
```

### Component Architecture

#### UI Layer (React Components)

**1. App Container**
- Root component
- Global state management
- Router (if multi-page added later)
- Error boundary

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Root component structure defined

---

**2. Upload Component**
- File drag-drop zone
- File picker integration
- File validation (type, size)
- Upload progress indication
- Error display

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Upload component interface defined

---

**3. Preview Component**
- Original image display
- Processed image display
- Side-by-side or toggle view
- Zoom and pan controls
- Responsive layout handling

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Preview component layout defined

---

**4. Processing Controls**
- Auto-Prep button
- Progress indicator
- Processing status messages

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Processing controls interface defined

---

**5. Refinement Controls**
- Brightness slider
- Contrast slider
- Threshold slider
- Reset button
- Real-time preview updates

---
**Implementation**: PENDING
- **Sprint**: Sprint 2 (Refinement Controls & UX)
- **Tasks**: To be planned
- **Status**: Refinement slider components specified

---

**6. Export Component**
- Download button
- Format selection (PNG/JPG)
- Filename generation
- Download trigger

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (PNG), Sprint 2 (JPG)
- **Tasks**: To be planned
- **Status**: Export functionality defined

---

**7. Material Presets (Sprint 3)**
- Preset dropdown
- Preset application logic
- Custom preset save/load

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Post-MVP feature

---

#### Processing Layer (Business Logic)

**1. ImageProcessor Class**
- Grayscale conversion
- Histogram equalization
- Otsu's threshold calculation
- Brightness adjustment
- Contrast adjustment
- Threshold application

**2. CanvasManager Class**
- Canvas creation and management
- ImageData manipulation
- Memory management (cleanup)
- Export to Blob

**3. FileHandler Class**
- File validation
- File loading
- Filename sanitization
- Blob URL generation

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Processing layer classes defined

---

### Data Flow

#### Upload Flow
```
User selects file
     │
     ▼
File validation
     │
     ├─ Invalid ──> Error message
     │
     ▼ Valid
Load to Image object
     │
     ▼
Draw to canvas
     │
     ▼
Display original preview
     │
     ▼
Enable Auto-Prep button
```

#### Processing Flow
```
User clicks Auto-Prep
     │
     ▼
Get canvas ImageData
     │
     ▼
Convert to grayscale
     │
     ▼
Apply histogram equalization
     │
     ▼
Calculate Otsu threshold
     │
     ▼
Apply threshold
     │
     ▼
Render to preview canvas
     │
     ▼
Update processed preview
     │
     ▼
Enable refinement controls
```

#### Refinement Flow
```
User adjusts slider
     │
     ▼
Debounce input (100ms)
     │
     ▼
Get auto-prep result
     │
     ▼
Apply adjustment (B/C/T)
     │
     ▼
Render to canvas
     │
     ▼
Update preview
```

#### Export Flow
```
User clicks Download
     │
     ▼
Get processed canvas
     │
     ▼
Export to Blob (PNG)
     │
     ▼
Generate filename
     │
     ▼
Create download link
     │
     ▼
Trigger download
     │
     ▼
Cleanup Blob URL
```

### Integration Points

**Browser APIs**:
- **File API**: File upload and validation
- **Canvas API**: Image manipulation and rendering
- **Blob API**: Export to downloadable file
- **URL API**: Blob URL generation
- **localStorage API**: Settings persistence (Sprint 3)

**No External APIs** (MVP):
- All processing client-side
- No analytics or tracking
- No third-party integrations

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Browser API integration points defined

---

## Technology Stack

### Frontend Framework

**React 18+**
- **Version**: React 18.3+ or React 19 (latest stable)
- **Rationale**:
  - Industry standard, excellent ecosystem
  - Component-based architecture fits UI needs
  - Hooks for clean state management
  - Fast refresh for development experience
  - Strong TypeScript support

**TypeScript**
- **Version**: TypeScript 5.x
- **Rationale**:
  - Type safety reduces bugs
  - Better IDE support and autocomplete
  - Self-documenting code
  - Easier refactoring

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (Foundation & Core Processing)
- **Tasks**: To be planned
- **Status**: React 18+ with TypeScript selected

---

### Build Tool

**Vite 5+**
- **Version**: Vite 5.x
- **Rationale**:
  - Extremely fast dev server with HMR
  - Optimized production builds
  - Native ESM support
  - Out-of-box TypeScript support
  - Excellent React integration

**Plugins**:
- `@vitejs/plugin-react` - React Fast Refresh
- `vite-plugin-pwa` (Sprint 3) - Progressive Web App support

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Vite 5+ as build tool

---

### UI Framework and Styling

**Tailwind CSS**
- **Version**: Tailwind CSS 3.x
- **Rationale**:
  - Utility-first approach speeds development
  - Responsive design built-in
  - Small production bundle (tree-shaking)
  - Consistent design system

**shadcn/ui Components**
- **Components**: Button, Slider, Dialog, Toast
- **Rationale**:
  - Accessible components (WCAG 2.2 compliant)
  - Customizable via Tailwind
  - Copy-paste approach (no dependency bloat)
  - TypeScript support

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Tailwind CSS + shadcn/ui for UI components

---

### State Management

**React Context API + Custom Hooks**
- **Rationale**:
  - Simple state needs (no Redux overhead)
  - Built-in React solution
  - Type-safe with TypeScript
  - Easy to test

**State Structure**:
```typescript
interface AppState {
  originalImage: HTMLImageElement | null;
  processedImage: HTMLCanvasElement | null;
  settings: {
    brightness: number;
    contrast: number;
    threshold: number;
    preset: MaterialPreset;
  };
  processing: boolean;
  error: string | null;
}
```

**Alternative (if complexity grows)**: Zustand for lightweight global state

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Context API + hooks for state management

---

### Image Processing

**Native Canvas API**
- **Rationale**:
  - No external library needed
  - Fast, native performance
  - Small bundle size
  - Full control over algorithms

**Canvas Operations**:
- `getContext('2d')` - 2D rendering context
- `getImageData()` - Access pixel data
- `putImageData()` - Update pixel data
- `toBlob()` - Export to Blob for download

**No External Libraries** (MVP):
- No fabric.js (too heavy for simple processing)
- No Jimp (designed for Node.js)
- All algorithms implemented from scratch

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Native Canvas API for all image processing

---

### Infrastructure

**Deployment**:
- **Platform**: Docker container with nginx
- **Hosting**: Existing server infrastructure (demosrv.uk)
- **Reverse Proxy**: Traefik (existing traefik_demosrv network)
- **Domain**: craftyprep.demosrv.uk

**Container Stack**:
- **Base**: nginx:alpine
- **Purpose**: Serve static files (HTML, CSS, JS, assets)
- **Configuration**: Single-page app routing (fallback to index.html)

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 (Enhancement & Deployment)
- **Tasks**: To be planned
- **Status**: Docker + nginx + Traefik deployment architecture

---

## Design Patterns

### Component Patterns

**1. Container/Presentational Pattern**
- **Containers**: Handle logic, state, side effects
- **Presentational**: Pure UI components, props only
- **Example**:
  - `ImageEditorContainer` (logic) wraps `ImageEditorView` (UI)

**2. Custom Hooks Pattern**
- `useImageUpload()` - File upload logic
- `useImageProcessing()` - Processing pipeline logic
- `useCanvasManipulation()` - Canvas operations
- `useDebounce()` - Debounced input handling

**3. Composition Pattern**
- Small, focused components
- Compose into larger features
- Reusable building blocks

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: React patterns defined (hooks, composition)

---

### Processing Patterns

**1. Pipeline Pattern**
- Image processing as sequential pipeline
- Each step pure function: `ImageData → ImageData`
- Composable transformations

```typescript
const pipeline = [
  convertToGrayscale,
  applyHistogramEqualization,
  calculateOtsuThreshold,
  applyThreshold
];

const result = pipeline.reduce((img, transform) => transform(img), original);
```

**2. Strategy Pattern (Sprint 3)**
- Material presets as strategies
- Encapsulate algorithm variations
- Easily add new presets

**3. Command Pattern (Sprint 3 - Undo/Redo)**
- Each adjustment as command object
- History stack for undo/redo
- Reversible operations

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (Pipeline), Sprint 3 (Strategy, Command)
- **Tasks**: To be planned
- **Status**: Processing patterns defined

---

## Scalability Strategy

### Performance Scalability

**Current (MVP)**:
- Client-side processing (scales with user's device)
- No server bottlenecks
- CDN-ready static files

**Future Enhancements**:
- Web Workers for heavy processing (offload main thread)
- WASM for performance-critical algorithms
- Progressive image loading for large files
- Chunked processing for memory efficiency

### Feature Scalability

**Modular Design**:
- Each feature as independent module
- Easy to add/remove features
- Plugin architecture for presets

**Extension Points**:
- Material preset system (easy to add presets)
- Processing pipeline (easy to add filters)
- Export formats (easy to add formats)

## Performance Considerations

### Optimization Targets

**Load Time**:
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <200KB (gzipped)

**Processing Time**:
- 2MB image: <3s auto-prep
- Slider adjustment: <100ms response
- Canvas operations: 60fps rendering

### Optimization Techniques

**1. Code Splitting**
- Lazy load non-critical components
- Dynamic imports for presets (Sprint 3)
- Tree-shaking unused code

**2. Memoization**
- React.memo for expensive renders
- useMemo for computed values
- useCallback for event handlers

**3. Debouncing**
- Slider inputs debounced to 100ms
- Prevent excessive re-processing

**4. Canvas Optimization**
- Offscreen canvas for processing
- RequestAnimationFrame for rendering
- Dispose contexts when done

**5. Asset Optimization**
- Minimize CSS/JS bundles
- Compress images
- Use modern image formats (WebP for UI assets)

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (foundation), Sprint 2 (optimization)
- **Tasks**: To be planned
- **Status**: Performance optimization strategy defined

---

## Security Architecture

### Client-Side Security

**Input Validation**:
- File type whitelist (not blacklist)
- File size limits enforced
- MIME type verification
- Filename sanitization

**Content Security Policy (CSP)**:
- No inline scripts
- No eval()
- Restrict resource loading
- Set via nginx headers

**No Data Persistence** (MVP):
- No cookies
- No external requests
- localStorage only for settings (Sprint 3)
- No user tracking

**Browser Security**:
- HTTPS required (Traefik handles TLS)
- Secure headers (X-Frame-Options, etc.)
- No external CDN for runtime code (self-hosted)

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (validation), Sprint 3 (CSP headers)
- **Tasks**: To be planned
- **Status**: Security approach defined

---

## Error Handling Strategy

### Error Categories

**1. User Errors** (expected, recoverable):
- Invalid file type
- File too large
- Corrupted image

**2. Browser Errors** (environmental):
- Canvas API unavailable
- Out of memory
- Browser not supported

**3. Processing Errors** (unexpected):
- Algorithm failure
- Canvas export failure

### Error Handling Approach

**User-Facing**:
- Clear, actionable error messages
- No technical jargon
- Suggest remediation
- Dismissible UI

**Logging**:
- Console.error for debugging
- Error boundary for React errors
- No external error reporting (privacy)

---
**Implementation**: PENDING
- **Sprint**: Sprint 1
- **Tasks**: To be planned
- **Status**: Error handling patterns defined

---

## Testing Strategy (High-Level)

See TESTING.md for detailed testing specifications.

**Unit Tests**:
- Image processing functions
- Utility functions
- Custom hooks

**Integration Tests**:
- Component interactions
- Upload → Process → Export flow
- Settings persistence

**E2E Tests**:
- User workflows (Playwright)
- Cross-browser testing
- Accessibility testing

---
**Implementation**: PENDING
- **Sprint**: All sprints (TDD approach)
- **Tasks**: To be planned
- **Status**: See TESTING.md for complete strategy

---

## Browser Compatibility

### Target Browsers

**Tier 1 (Full Support)**:
- Chrome 90+ (latest)
- Firefox 88+ (latest)
- Safari 14+ (latest)
- Edge 90+ (latest)

**Tier 2 (Best Effort)**:
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

**Not Supported**:
- Internet Explorer (any version)
- Browsers without Canvas API
- Browsers without ES2020 support

### Required Browser Features

- Canvas API
- File API
- Blob API
- localStorage (Sprint 3)
- ES2020 JavaScript features
- CSS Grid and Flexbox

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (core support), Sprint 2 (mobile testing)
- **Tasks**: To be planned
- **Status**: Browser support matrix defined

---

## Development Environment

### Docker-Based Development (Recommended)

**Why Docker?**:
- ✅ Consistent Node.js version across all environments (Node 20 LTS)
- ✅ No local Node.js installation required
- ✅ Isolated dependencies (no conflicts)
- ✅ Same environment for dev, test, and production
- ✅ Quick setup for new team members

```bash
# Prerequisites
- Docker 20+ and Docker Compose
- Git

# Setup
git clone <repository>
cd craftyprep.com/src
docker-compose -f docker-compose.dev.yml up

# Development server: http://localhost:5173
# Hot Module Replacement (HMR) works via volume mounts
```

**Docker Development Stack**:
- **Base Image**: node:20-alpine
- **Dev Server**: Vite with HMR
- **Volume Mounts**: Source code mounted for live reload
- **Port Mapping**: 5173:5173 (dev), 9229:9229 (debugger)

### Local Development Setup (Alternative)

```bash
# Prerequisites
- Node.js 20.19+ or 22.12+ and npm 9+
- Git

# Setup
git clone <repository>
cd craftyprep.com
cd src
npm install
npm run dev

# Development server: http://localhost:5173
```

**Note**: If using local setup, ensure Node.js version meets Vite 7 requirements (20.19+ or 22.12+). Docker is recommended to avoid version conflicts.

### Development Tools

**Code Quality**:
- ESLint - Linting
- Prettier - Code formatting
- TypeScript - Type checking
- Husky - Git hooks (pre-commit)
- lint-staged - Fast pre-commit checks

**Testing**:
- Vitest - Unit testing
- React Testing Library - Component testing
- Playwright - E2E testing

**Build**:
- Vite - Dev server and bundler
- TypeScript compiler - Type checking
- PostCSS - CSS processing (Tailwind)

---
**Implementation**: IN PROGRESS
- **Sprint**: Sprint 1 (Foundation & Core Processing)
- **Task**: task-001 (Docker configuration added)
- **Status**: Docker development environment configured, local tooling complete

---

This architecture provides a solid foundation for a fast, privacy-focused, client-side image preparation tool optimized for laser engraving.
