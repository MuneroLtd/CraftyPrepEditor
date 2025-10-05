# Project Sprints and Tasks

**Project**: CraftyPrep - Laser Engraving Image Prep Tool
**Total Sprints**: 6
**Estimated Duration**: 12 weeks
**Last Updated**: 2025-10-05

---

## Sprint Overview

| Sprint | Goal | Duration | Tasks | Status |
|--------|------|----------|-------|--------|
| 1 | Foundation & Core Processing | Week 1-2 | 10 | COMPLETE |
| 2 | Refinement Controls & UX | Week 3-4 | 11 | ACTIVE |
| 3 | Enhancement & Deployment | Week 5-6 | 10 | PENDING |
| 4 | Advanced Editing (Crop & Resize) | Week 7-8 | 10 | PENDING |
| 5 | Text Overlay & Material Presets | Week 9-10 | 10 | PENDING |
| 6 | Export Formats & Dithering | Week 11-12 | 10 | PENDING |

---

## Sprint 1: Foundation & Core Processing

**Duration**: Week 1-2
**Status**: COMPLETE
**Progress**: 10/10 complete
**Dependencies**: None (first sprint)

**Sprint Goal**: Deliver working image upload and basic auto-prep functionality with MVP feature set.

### Deliverables

1. Project initialized with Vite + React + TypeScript + Tailwind
2. Image upload working (drag-drop and file picker)
3. Auto-prep processing algorithm implemented (grayscale, histogram equalization, Otsu threshold)
4. Side-by-side preview (original vs. processed)
5. PNG export/download functional
6. Basic responsive UI
7. Input validation and error handling
8. Unit tests for image processing
9. E2E test for happy path
10. CI pipeline setup

### Tasks (10/10 complete)

**Note**: All Sprint 1 tasks are complete. Tasks marked [COMMITTED] are archived in COMPLETED_TASKS.md with full details.

1. `task-001` [COMMITTED] - Project Setup and Configuration
2. `task-002` [COMMITTED] - Basic UI Layout and Routing
3. `task-003` [COMMITTED] - File Upload Component
4. `task-004` [COMMITTED] - Image Canvas and Preview Display
5. `task-005` [COMMITTED] - Grayscale Conversion Algorithm (see COMPLETED_TASKS.md)
6. `task-006` [COMMITTED] - Histogram Equalization Algorithm (see COMPLETED_TASKS.md)
7. `task-007` [COMMITTED] - Otsu's Threshold Algorithm (see COMPLETED_TASKS.md)
8. `task-008` [COMMITTED] - Auto-Prep Button and Processing Flow (see COMPLETED_TASKS.md)
9. `task-009` [COMMITTED] - PNG Export and Download (see COMPLETED_TASKS.md)
10. `task-010` [COMMITTED] - CI/CD Pipeline and Testing Infrastructure

---

**Sprint 1 Success Criteria**:
- [ ] All 10 tasks marked COMPLETE
- [ ] All tests passing (unit + integration + E2E)
- [ ] Code coverage ≥80%
- [ ] CI pipeline green
- [ ] Working end-to-end: Upload → Auto-Prep → Download
- [ ] No console errors
- [ ] Responsive on desktop and tablet (≥768px)

---

## Sprint 2: Refinement Controls & UX

**Duration**: Week 3-4
**Status**: ACTIVE
**Progress**: 7/11 complete
**Dependencies**: Sprint 1 complete

**Sprint Goal**: Add slider controls for refinement, optimize performance, enhance UX, and improve accessibility.

### Deliverables

1. Brightness/Contrast/Threshold sliders functional
2. Real-time preview updates (debounced)
3. Reset button returns to auto-prep defaults
4. JPG export option added
5. Loading states and error handling polished
6. Performance optimization (debouncing, memoization)
7. Full accessibility audit and fixes
8. Cross-browser testing
9. Comprehensive E2E test coverage
10. Code review and refactoring

### Tasks (11 total, 7 complete)

**Note**: Tasks marked [COMMITTED] are archived in COMPLETED_TASKS.md with full details.

1. `task-011` [COMMITTED] - Refinement Slider Components (see COMPLETED_TASKS.md - to be added)
2. `task-012` [COMMITTED] - Brightness Adjustment Implementation
3. `task-013` [COMMITTED] - Background Removal Integration (replaced Contrast in implementation order)
4. `task-014` [COMMITTED] - Contrast Adjustment Implementation
5. `task-015` [COMMITTED] - Threshold Adjustment Implementation
6. `task-016` [COMMITTED] - Debounced Preview Updates
7. `task-017` [COMMITTED] - Reset Button and State Management
8. `task-018` [PENDING] - JPG Export Option
9. `task-019` [PENDING] - Accessibility Audit and Fixes
10. `task-020` [PENDING] - Cross-Browser Testing and Fixes
11. `task-021` [PENDING] - Performance Optimization and Code Review

---

**Sprint 2 Success Criteria**:
- [ ] All 10 tasks marked COMPLETE
- [ ] Refinement sliders functional and performant
- [ ] All tests passing (unit + integration + E2E)
- [ ] Accessibility audit ≥95/100
- [ ] Cross-browser tested and working
- [ ] Performance metrics met
- [ ] Code reviewed and refactored

---

## Sprint 3: Enhancement & Deployment

**Duration**: Week 5-6
**Status**: PENDING
**Dependencies**: Sprint 2 complete

**Sprint Goal**: Add material presets, undo/redo, settings persistence, deploy to production, and establish monitoring.

### Deliverables

1. Material presets (Wood, Leather, Acrylic, Glass, Metal)
2. Undo/redo functionality
3. Settings persistence (localStorage)
4. Docker configuration and build
5. nginx configuration with security headers
6. Traefik integration and deployment
7. Production deployment to craftyprep.demosrv.uk
8. Monitoring and health checks
9. Documentation and user guide
10. Final security and performance audit

### Tasks (10/10)

#### Task 3.1: Material Preset System

**ID**: task-021
**Priority**: MEDIUM
**Estimated Effort**: 6 hours

**Description**:
Implement material-specific preset configurations (Wood, Leather, Acrylic, Glass, Metal).

**Required Reading**:
- FUNCTIONAL.md#material-presets - Preset specifications
- ARCHITECTURE.md#strategy-pattern - Preset architecture

**Acceptance Criteria**:
- [ ] Preset dropdown component created
- [ ] 5 presets configured with optimized values
- [ ] Selecting preset applies values to sliders
- [ ] Manual adjustment switches to "Custom"
- [ ] Presets stored as configurations
- [ ] Unit tests for preset application
- [ ] Visual feedback for active preset

---

#### Task 3.2: Undo/Redo History System

**ID**: task-022
**Priority**: LOW
**Estimated Effort**: 5 hours

**Description**:
Implement undo/redo functionality with history stack (max 10 states).

**Required Reading**:
- FUNCTIONAL.md#undo-redo-functionality - Requirements
- ARCHITECTURE.md#command-pattern - History implementation

**Acceptance Criteria**:
- [ ] History stack implemented (max 10 states)
- [ ] Undo button reverts to previous state
- [ ] Redo button re-applies undone state
- [ ] Keyboard shortcuts: Ctrl+Z, Ctrl+Y
- [ ] New adjustment clears redo stack
- [ ] Buttons disabled when no undo/redo available
- [ ] Unit tests for history operations

---

#### Task 3.3: Settings Persistence (localStorage)

**ID**: task-023
**Priority**: LOW
**Estimated Effort**: 3 hours

**Description**:
Persist user settings (custom preset, slider values) in browser localStorage.

**Required Reading**:
- FUNCTIONAL.md#settings-persistence - Storage requirements
- SECURITY.md#data-storage - Privacy considerations

**Acceptance Criteria**:
- [ ] Custom preset saved to localStorage
- [ ] Settings restored on page load
- [ ] Clear/reset localStorage option
- [ ] No sensitive data stored
- [ ] Privacy disclosure in UI (optional)
- [ ] Unit tests for storage/retrieval

---

#### Task 3.4: Docker Configuration

**ID**: task-024
**Priority**: HIGH
**Estimated Effort**: 4 hours

**Description**:
Create multi-stage Dockerfile for optimized production builds.

**Required Reading**:
- DEPLOYMENT.md#docker-configuration - Complete Docker setup
- DOCKER_BEST_PRACTICES.md - Docker standards

**Acceptance Criteria**:
- [ ] Multi-stage Dockerfile created
- [ ] Build stage with npm ci
- [ ] Production stage with nginx:alpine
- [ ] Static files copied to nginx html directory
- [ ] Health check configured
- [ ] Image size optimized (<50MB)
- [ ] Security: non-root user, minimal layers
- [ ] Build succeeds without errors

---

#### Task 3.5: nginx Configuration and Security Headers

**ID**: task-025
**Priority**: HIGH
**Estimated Effort**: 4 hours

**Description**:
Configure nginx with SPA routing, security headers, and performance optimization.

**Required Reading**:
- DEPLOYMENT.md#nginx-configuration - Complete nginx config
- SECURITY.md#security-misconfiguration - Required headers

**Acceptance Criteria**:
- [ ] nginx.conf created
- [ ] SPA routing (try_files fallback to index.html)
- [ ] Security headers: CSP, X-Frame-Options, HSTS, etc.
- [ ] Gzip compression enabled
- [ ] Static asset caching (1 year)
- [ ] index.html no-cache
- [ ] Health check endpoint (/health)
- [ ] Server tokens disabled

---

#### Task 3.6: Docker Compose and Traefik Labels

**ID**: task-026
**Priority**: HIGH
**Estimated Effort**: 3 hours

**Description**:
Create docker-compose.yml with Traefik labels for HTTPS and routing.

**Required Reading**:
- DEPLOYMENT.md#docker-compose - Compose configuration
- DEPLOYMENT.md#infrastructure-architecture - Traefik integration

**Acceptance Criteria**:
- [ ] docker-compose.yml created
- [ ] Traefik labels configured
- [ ] Host rule: craftyprep.demosrv.uk
- [ ] HTTPS entrypoint (websecure)
- [ ] TLS enabled with Let's Encrypt
- [ ] traefik_demosrv network configured
- [ ] Container restart policy: unless-stopped
- [ ] Health check configured
- [ ] Logging configured (json-file, 10m, 3 files)

---

#### Task 3.7: Production Deployment

**ID**: task-027
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Deploy application to craftyprep.demosrv.uk and verify all functionality.

**Required Reading**:
- DEPLOYMENT.md#deployment-strategy - Deployment procedure
- DEPLOYMENT.md#deployment-checklist - Pre/post checks

**Acceptance Criteria**:
- [ ] Code pushed to main branch
- [ ] Docker image built successfully
- [ ] Deployed to server via docker-compose
- [ ] HTTPS working (craftyprep.demosrv.uk)
- [ ] SSL certificate valid (Let's Encrypt)
- [ ] Traefik routing verified
- [ ] Health check responding
- [ ] All features functional in production
- [ ] Smoke test passed: upload → auto-prep → download
- [ ] No console errors in production

---

#### Task 3.8: Monitoring and Logging Setup

**ID**: task-028
**Priority**: MEDIUM
**Estimated Effort**: 4 hours

**Description**:
Configure logging, health checks, and basic monitoring for production.

**Required Reading**:
- DEPLOYMENT.md#monitoring-and-alerting - Monitoring strategy
- DEPLOYMENT.md#logs - Log configuration

**Acceptance Criteria**:
- [ ] Docker logs configured
- [ ] nginx access logs configured
- [ ] nginx error logs configured
- [ ] Log rotation configured (3 × 10MB)
- [ ] Health check endpoint verified
- [ ] Docker healthcheck monitoring container status
- [ ] Basic metrics collection (optional)
- [ ] Uptime monitoring (optional)

---

#### Task 3.9: Documentation and User Guide

**ID**: task-029
**Priority**: LOW
**Estimated Effort**: 4 hours

**Description**:
Update README.md with user instructions, deployment guide, and developer setup.

**Required Reading**:
- PRODUCT.md#user-journeys - User workflow examples
- DEPLOYMENT.md#production-urls-and-access - Access information

**Acceptance Criteria**:
- [ ] README.md updated
- [ ] User guide: How to use CraftyPrep
- [ ] Developer setup instructions
- [ ] Deployment instructions
- [ ] Architecture overview
- [ ] Contributing guidelines (optional)
- [ ] License information
- [ ] Screenshots (optional)

---

#### Task 3.10: Final Security and Performance Audit

**ID**: task-030
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Comprehensive final audit of security, performance, and accessibility before launch.

**Required Reading**:
- SECURITY.md#security-checklist - Security review checklist
- TESTING.md#deployment-checklist - Final testing requirements

**Acceptance Criteria**:
- [ ] npm audit clean (no vulnerabilities)
- [ ] OWASP ZAP scan passed (if applicable)
- [ ] Lighthouse audits: Performance ≥90, Accessibility ≥95
- [ ] All security headers verified
- [ ] CSP violations checked (none)
- [ ] Cross-browser final test
- [ ] Mobile responsive test
- [ ] Accessibility manual test (screen reader)
- [ ] Performance manual test (image processing <5s)
- [ ] Documentation review complete

---

**Sprint 3 Success Criteria**:
- [ ] All 10 tasks marked COMPLETE
- [ ] Application deployed to craftyprep.demosrv.uk
- [ ] HTTPS working with valid SSL certificate
- [ ] All features functional in production
- [ ] Material presets working
- [ ] Undo/redo functional
- [ ] Settings persistence working
- [ ] All audits passed (security, performance, accessibility)
- [ ] Documentation complete
- [ ] Monitoring established

---

## Project Milestones

### Milestone 1: MVP Launch (End of Sprint 2)
- [ ] Core functionality complete
- [ ] Upload → Auto-Prep → Refinement → Download working
- [ ] Accessibility compliant (WCAG 2.2 AAA)
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] **User Value**: Users can prepare images for laser engraving in <2 minutes

### Milestone 2: Production Deployment (End of Sprint 3)
- [ ] Material presets available
- [ ] Enhanced UX (undo/redo, persistence)
- [ ] Deployed to production (craftyprep.demosrv.uk)
- [ ] Monitoring and logging active
- [ ] Full documentation available
- [ ] **User Value**: Professional users have optimized workflows and material-specific presets

### Milestone 3: Public Launch (Week 7)
- [ ] Announcement published
- [ ] User feedback collection started
- [ ] Analytics/monitoring review (optional)
- [ ] Bug fixes from early users
- [ ] **User Value**: Public access to free laser prep tool

---

## Notes

- **Task Sizing**: Maximum 6 hours per task ensures focused, completable work
- **Sprint Sizing**: Exactly 10 tasks per sprint for predictable velocity
- **Dependencies**: Each task lists required documentation for implementation
- **Testing**: All tasks include testing as acceptance criteria
- **Flexibility**: Task order within sprint can be adjusted based on blockers

---

**Ready to begin**: Run `/plan` to expand Task 1.1 (Project Setup and Configuration) and start Sprint 1.


---

## Sprint 4: Advanced Editing (Crop & Resize)

**Duration**: Week 7-8
**Status**: PENDING
**Progress**: 0/10 complete
**Dependencies**: Sprint 3 complete

**Sprint Goal**: Transform CraftyPrep into a full image editor with crop, resize, and dimension control capabilities like Imag-R.

### Deliverables

1. Interactive crop tool with drag handles
2. Aspect ratio presets and custom ratios
3. Resize with dimension input (mm, inches, pixels)
4. DPI configuration (150, 300, 600 DPI presets)
5. Maintain aspect ratio toggle
6. Canvas zoom for precise cropping
7. Crop preview overlay
8. Unit conversion utilities
9. Image quality preservation during resize
10. Integration with existing processing pipeline

### Tasks (10/10)

#### Task 4.1: Crop Tool UI Component

**ID**: task-031
**Priority**: HIGH
**Estimated Effort**: 8 hours

**Description**:
Implement interactive crop tool with drag handles, aspect ratio lock, and visual overlay.

**Required Reading**:
- FUNCTIONAL.md#crop-tool - Crop requirements (to be added)
- ARCHITECTURE.md#canvas-manipulation - Advanced canvas operations

**Acceptance Criteria**:
- [ ] Crop overlay with 8 drag handles (corners + edges)
- [ ] Visual crop area with dimmed outside area
- [ ] Drag to reposition crop area
- [ ] Resize handles maintain aspect ratio when locked
- [ ] Grid overlay (rule of thirds)
- [ ] Keyboard shortcuts (arrow keys for fine adjustment)
- [ ] Touch support for mobile/tablet
- [ ] Unit tests for crop logic
- [ ] E2E test for crop interaction

---

#### Task 4.2: Aspect Ratio Presets

**ID**: task-032
**Priority**: MEDIUM
**Estimated Effort**: 4 hours

**Description**:
Add aspect ratio preset buttons (1:1, 4:3, 16:9, 3:2, custom) with lock toggle.

**Acceptance Criteria**:
- [ ] Preset buttons: Free, 1:1, 4:3, 16:9, 3:2, A4
- [ ] Custom aspect ratio input (width:height)
- [ ] Lock/unlock aspect ratio toggle
- [ ] Preset application updates crop area
- [ ] Current ratio displayed
- [ ] Unit tests for ratio calculations

---

#### Task 4.3: Resize with Dimension Input

**ID**: task-033
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Implement resize functionality with mm/inches/pixels units and DPI configuration.

**Required Reading**:
- FUNCTIONAL.md#resize-tool - Resize requirements (to be added)
- ARCHITECTURE.md#unit-conversion - Unit conversion utilities

**Acceptance Criteria**:
- [ ] Width/Height input fields
- [ ] Unit selector: mm, inches, pixels
- [ ] DPI presets: 72, 150, 300, 600
- [ ] Custom DPI input
- [ ] "Maintain aspect ratio" checkbox
- [ ] Real-time dimension preview
- [ ] Conversion utilities (mm ↔ inches ↔ pixels)
- [ ] Maximum size validation (10000px limit)
- [ ] Unit tests for conversions

---

#### Task 4.4: High-Quality Resize Algorithm

**ID**: task-034
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Implement bicubic interpolation or Lanczos resampling for high-quality image resize.

**Acceptance Criteria**:
- [ ] Bicubic interpolation implemented
- [ ] Lanczos resampling (optional, for better quality)
- [ ] Maintains image sharpness
- [ ] Performance: <3s for 2MP → 4MP resize
- [ ] No quality loss on upscale (within limits)
- [ ] Unit tests with quality metrics
- [ ] Benchmark tests

---

#### Task 4.5: Crop Execution and Canvas Update

**ID**: task-035
**Priority**: HIGH
**Estimated Effort**: 5 hours

**Description**:
Apply crop selection to image and update canvas with cropped result.

**Acceptance Criteria**:
- [ ] "Apply Crop" button executes crop
- [ ] Canvas updated with cropped image
- [ ] Original image preserved for reset
- [ ] Undo/redo integration
- [ ] Crop applied before other adjustments
- [ ] Unit tests for crop execution
- [ ] Integration test for full crop flow

---

#### Task 4.6: Dimension Display and Info Panel

**ID**: task-036
**Priority**: LOW
**Estimated Effort**: 3 hours

**Description**:
Display current image dimensions, file size, and DPI in info panel.

**Acceptance Criteria**:
- [ ] Info panel shows: width × height (pixels)
- [ ] Physical dimensions (mm/inches based on DPI)
- [ ] File size (KB/MB)
- [ ] Current DPI
- [ ] Updates in real-time during crop/resize
- [ ] Unit tests for display logic

---

#### Task 4.7: Resize Preview and Apply

**ID**: task-037
**Priority**: MEDIUM
**Estimated Effort**: 5 hours

**Description**:
Preview resize results and apply to image with quality preservation.

**Acceptance Criteria**:
- [ ] Resize preview before apply
- [ ] "Apply Resize" button
- [ ] Progress indicator for large resizes
- [ ] Quality setting (fast/balanced/high)
- [ ] Applied resize integrates with pipeline
- [ ] Unit tests for resize application

---

#### Task 4.8: Canvas Zoom for Precision Editing

**ID**: task-038
**Priority**: MEDIUM
**Estimated Effort**: 4 hours

**Description**:
Enhance canvas zoom to support precise crop selection and pixel-level editing.

**Acceptance Criteria**:
- [ ] Zoom levels: 25%, 50%, 100%, 200%, 400%
- [ ] Zoom to fit / Zoom to 100% buttons
- [ ] Pan canvas when zoomed
- [ ] Crop handles visible at all zoom levels
- [ ] Scroll wheel zoom (Ctrl + wheel)
- [ ] Zoom indicator display

---

#### Task 4.9: Unit Conversion Utilities

**ID**: task-039
**Priority**: MEDIUM
**Estimated Effort**: 3 hours

**Description**:
Create utility functions for converting between mm, inches, pixels with DPI.

**Acceptance Criteria**:
- [ ] mmToPixels(mm, dpi) function
- [ ] inchesToPixels(inches, dpi) function
- [ ] pixelsToMm(pixels, dpi) function
- [ ] pixelsToInches(pixels, dpi) function
- [ ] Rounding logic for display
- [ ] Comprehensive unit tests (20+ test cases)

---

#### Task 4.10: Crop/Resize Integration and E2E Tests

**ID**: task-040
**Priority**: HIGH
**Estimated Effort**: 5 hours

**Description**:
Integrate crop/resize into main workflow and create comprehensive E2E tests.

**Acceptance Criteria**:
- [ ] Workflow: Upload → Crop → Resize → Auto-Prep → Adjust → Export
- [ ] Crop/resize buttons in main UI
- [ ] State management for crop/resize data
- [ ] E2E test: Full workflow with crop and resize
- [ ] E2E test: Crop with different aspect ratios
- [ ] E2E test: Resize with unit conversions
- [ ] Accessibility audit for new controls

---

**Sprint 4 Success Criteria**:
- [ ] Users can crop images with precision
- [ ] Users can resize to exact dimensions (mm/inches)
- [ ] DPI configuration works correctly
- [ ] High-quality resize maintains sharpness
- [ ] All crop/resize E2E tests passing
- [ ] WCAG 2.2 AAA compliance maintained
- [ ] Performance: Crop <1s, Resize <3s

---

## Sprint 5: Text Overlay & Material Presets

**Duration**: Week 9-10
**Status**: PENDING
**Progress**: 0/10 complete
**Dependencies**: Sprint 4 complete

**Sprint Goal**: Add text overlay capabilities and material-specific presets with algorithm selection like Imag-R.

### Deliverables

1. Text overlay tool with font selection
2. Configurable text: size, color, stroke, spacing
3. Text positioning and rotation
4. Material presets (Wood, Acrylic, Leather, Tile, etc.)
5. Algorithm selection (Stucki, Floyd-Steinberg, Atkinson, etc.)
6. Material-specific preview rendering
7. Custom preset creation and saving
8. Text layer management
9. Material algorithm documentation
10. Integration with export pipeline

### Tasks (10/10)

#### Task 5.1: Text Overlay UI Component

**ID**: task-041
**Priority**: HIGH
**Estimated Effort**: 8 hours

**Description**:
Create text overlay tool with input, positioning, and visual preview.

**Acceptance Criteria**:
- [ ] Text input field
- [ ] Draggable text on canvas
- [ ] Resize handles for text box
- [ ] Rotation handle
- [ ] Delete text button
- [ ] Multiple text layers support
- [ ] Layer order controls (bring to front/back)
- [ ] Unit tests for text positioning

---

#### Task 5.2: Font and Typography Controls

**ID**: task-042
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Implement font selection, size, weight, and style controls.

**Acceptance Criteria**:
- [ ] Font family selector (web-safe fonts)
- [ ] Google Fonts integration (optional)
- [ ] Font size slider (8-200px)
- [ ] Font weight (light, regular, bold)
- [ ] Font style (normal, italic)
- [ ] Text alignment (left, center, right)
- [ ] Line height control
- [ ] Letter spacing control

---

#### Task 5.3: Text Color, Stroke, and Effects

**ID**: task-043
**Priority**: MEDIUM
**Estimated Effort**: 5 hours

**Description**:
Add text color picker, stroke options, and visual effects.

**Acceptance Criteria**:
- [ ] Text color picker
- [ ] Stroke color picker
- [ ] Stroke width slider (0-10px)
- [ ] Shadow effect (X, Y offset, blur, color)
- [ ] Opacity control (0-100%)
- [ ] Preview updates in real-time
- [ ] Unit tests for rendering

---

#### Task 5.4: Material Presets System

**ID**: task-044
**Priority**: HIGH
**Estimated Effort**: 8 hours

**Description**:
Create material preset system with predefined settings for common materials.

**Required Reading**:
- FUNCTIONAL.md#material-presets - Material specifications (to be added)
- ARCHITECTURE.md#preset-system - Preset architecture

**Acceptance Criteria**:
- [ ] Material presets: Wood, Acrylic, Leather, Tile, Glass, Metal, Cork, Fabric
- [ ] Each preset has: brightness, contrast, threshold, dithering algorithm
- [ ] Preset selector UI (dropdown or buttons)
- [ ] Preset application updates all sliders
- [ ] Custom preset creation
- [ ] Save custom presets to localStorage
- [ ] Import/export preset JSON
- [ ] Unit tests for preset logic

---

#### Task 5.5: Dithering Algorithm Selection

**ID**: task-045
**Priority**: HIGH
**Estimated Effort**: 10 hours

**Description**:
Implement multiple dithering algorithms: Stucki, Floyd-Steinberg, Atkinson, Sierra, Burkes.

**Acceptance Criteria**:
- [ ] Floyd-Steinberg dithering implemented
- [ ] Atkinson dithering implemented
- [ ] Stucki dithering implemented
- [ ] Sierra dithering implemented (Sierra-3)
- [ ] Burkes dithering implemented
- [ ] Algorithm selector UI
- [ ] Preview updates with selected algorithm
- [ ] Performance: <5s for 2MP image
- [ ] Unit tests for each algorithm
- [ ] Visual comparison tests

---

#### Task 5.6: Material-Specific Preview

**ID**: task-046
**Priority**: MEDIUM
**Estimated Effort**: 5 hours

**Description**:
Render preview showing how image will look on selected material.

**Acceptance Criteria**:
- [ ] Material texture overlay (optional)
- [ ] Algorithm applied to preview
- [ ] Side-by-side: original vs material preview
- [ ] "Preview on Material" toggle
- [ ] Material info displayed (name, DPI recommendation)
- [ ] Unit tests for preview rendering

---

#### Task 5.7: Custom Preset Builder

**ID**: task-047
**Priority**: LOW
**Estimated Effort**: 4 hours

**Description**:
Allow users to create and save custom material presets.

**Acceptance Criteria**:
- [ ] "Save as Preset" button
- [ ] Preset name input
- [ ] Saves: brightness, contrast, threshold, algorithm, DPI
- [ ] Preset list in sidebar
- [ ] Load custom preset
- [ ] Delete custom preset
- [ ] Export preset as JSON file
- [ ] Import preset from JSON file

---

#### Task 5.8: Text Rendering to Canvas

**ID**: task-048
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Render text overlay to canvas for final export.

**Acceptance Criteria**:
- [ ] Text drawn to canvas with correct font
- [ ] Color and stroke applied
- [ ] Rotation and positioning preserved
- [ ] Multi-line text support
- [ ] Text wrapping (optional)
- [ ] High-quality anti-aliasing
- [ ] Export includes text layer
- [ ] Unit tests for text rendering

---

#### Task 5.9: Algorithm Documentation and Help

**ID**: task-049
**Priority**: LOW
**Estimated Effort**: 3 hours

**Description**:
Create in-app documentation explaining dithering algorithms and material selection.

**Acceptance Criteria**:
- [ ] Help modal with algorithm explanations
- [ ] Visual samples of each algorithm
- [ ] Material selection guide
- [ ] DPI recommendations per material
- [ ] "?" help icon next to each control
- [ ] Tooltips for advanced options

---

#### Task 5.10: Material Preset Integration and E2E Tests

**ID**: task-050
**Priority**: HIGH
**Estimated Effort**: 5 hours

**Description**:
Integrate presets into main workflow and create E2E tests.

**Acceptance Criteria**:
- [ ] Workflow: Upload → Crop → Resize → Material → Text → Export
- [ ] Material preset selector in main UI
- [ ] Text tool accessible from toolbar
- [ ] E2E test: Apply wood preset
- [ ] E2E test: Add text overlay
- [ ] E2E test: Custom preset save/load
- [ ] E2E test: Text + material export
- [ ] Accessibility audit

---

**Sprint 5 Success Criteria**:
- [ ] Users can add text overlays to images
- [ ] 8+ material presets available
- [ ] 5+ dithering algorithms working
- [ ] Custom presets can be saved/loaded
- [ ] All text/preset E2E tests passing
- [ ] WCAG 2.2 AAA compliance maintained
- [ ] Performance: Text render <1s, Dithering <5s

---

## Sprint 6: Export Formats & Dithering

**Duration**: Week 11-12
**Status**: PENDING
**Progress**: 0/10 complete
**Dependencies**: Sprint 5 complete

**Sprint Goal**: Complete export functionality with BMP, dithered formats, and Cricut/laser cutter compatibility.

### Deliverables

1. BMP export format support
2. Dithered PNG/BMP export
3. Grayscale export options
4. SVG trace export (optional)
5. Format-specific optimizations
6. Multi-format batch export
7. Export presets (Cricut, Glowforge, etc.)
8. Color palette reduction
9. Export quality settings
10. Final documentation and polish

### Tasks (10/10)

#### Task 6.1: BMP Export Implementation

**ID**: task-051
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Implement BMP export with proper header generation and format compliance.

**Acceptance Criteria**:
- [ ] BMP file format encoder
- [ ] 24-bit RGB BMP support
- [ ] 8-bit grayscale BMP support
- [ ] 1-bit monochrome BMP support
- [ ] Proper BMP header generation
- [ ] Windows/Mac compatibility verified
- [ ] Unit tests for BMP encoding
- [ ] File size optimization

---

#### Task 6.2: Dithered Image Export

**ID**: task-052
**Priority**: HIGH
**Estimated Effort**: 5 hours

**Description**:
Export dithered images with selected algorithm applied.

**Acceptance Criteria**:
- [ ] Apply dithering before export
- [ ] Dithered PNG export
- [ ] Dithered BMP export
- [ ] Dithering quality preserved in export
- [ ] Format selector shows "Dithered" option
- [ ] Preview matches exported result
- [ ] Unit tests for dithered export

---

#### Task 6.3: Grayscale and Monochrome Export

**ID**: task-053
**Priority**: MEDIUM
**Estimated Effort**: 4 hours

**Description**:
Export pure grayscale and 1-bit monochrome formats for specific tools.

**Acceptance Criteria**:
- [ ] 8-bit grayscale PNG
- [ ] 8-bit grayscale BMP
- [ ] 1-bit monochrome PNG
- [ ] 1-bit monochrome BMP
- [ ] Color space conversion accuracy
- [ ] File size comparison display
- [ ] Unit tests for color conversion

---

#### Task 6.4: SVG Trace Export (Optional)

**ID**: task-054
**Priority**: LOW
**Estimated Effort**: 8 hours

**Description**:
Implement bitmap-to-vector tracing for SVG export (for cutting machines).

**Acceptance Criteria**:
- [ ] Potrace or similar algorithm
- [ ] SVG path generation
- [ ] Threshold control for tracing
- [ ] Smooth/simplify paths option
- [ ] SVG export from canvas
- [ ] Compatible with Cricut Design Space
- [ ] Unit tests for trace algorithm

---

#### Task 6.5: Export Presets for Tools

**ID**: task-055
**Priority**: MEDIUM
**Estimated Effort**: 5 hours

**Description**:
Create export presets optimized for popular tools (Cricut, Glowforge, LaserGRBL, etc.).

**Acceptance Criteria**:
- [ ] Cricut preset (PNG 300 DPI, specific dimensions)
- [ ] Glowforge preset (PNG/SVG, optimized settings)
- [ ] LaserGRBL preset (BMP 1-bit, high contrast)
- [ ] LightBurn preset (PNG grayscale 300 DPI)
- [ ] Generic laser cutter preset
- [ ] Preset selector in export dialog
- [ ] Documentation for each preset

---

#### Task 6.6: Multi-Format Batch Export

**ID**: task-056
**Priority**: LOW
**Estimated Effort**: 4 hours

**Description**:
Export image in multiple formats simultaneously with one click.

**Acceptance Criteria**:
- [ ] "Export All Formats" button
- [ ] Exports PNG, JPG, BMP simultaneously
- [ ] ZIP file download with all formats
- [ ] Format selection checkboxes
- [ ] Progress indicator for batch export
- [ ] Unit tests for batch export

---

#### Task 6.7: Color Palette Reduction

**ID**: task-057
**Priority**: LOW
**Estimated Effort**: 6 hours

**Description**:
Reduce color palette for specific export needs (2-color, 4-color, etc.).

**Acceptance Criteria**:
- [ ] Median cut algorithm
- [ ] Octree color quantization
- [ ] 2-color (black/white) reduction
- [ ] 4-color palette reduction
- [ ] 8-color palette reduction
- [ ] Custom palette definition
- [ ] Preview with reduced palette
- [ ] Unit tests for quantization

---

#### Task 6.8: Export Quality and Compression Settings

**ID**: task-058
**Priority**: MEDIUM
**Estimated Effort**: 4 hours

**Description**:
Add quality and compression controls for each export format.

**Acceptance Criteria**:
- [ ] JPG quality slider (1-100%)
- [ ] PNG compression level (0-9)
- [ ] BMP compression option (RLE)
- [ ] File size estimate before export
- [ ] Quality preset buttons (low/medium/high)
- [ ] Default settings per format

---

#### Task 6.9: Export Dialog and Preview

**ID**: task-059
**Priority**: MEDIUM
**Estimated Effort**: 5 hours

**Description**:
Create comprehensive export dialog with preview and settings.

**Acceptance Criteria**:
- [ ] Export modal dialog
- [ ] Format selector (PNG/JPG/BMP/SVG)
- [ ] Quality/compression settings
- [ ] Export preset selector
- [ ] Final preview before export
- [ ] File size estimate
- [ ] Filename customization
- [ ] "Export" button triggers download

---

#### Task 6.10: Final Polish and Documentation

**ID**: task-060
**Priority**: HIGH
**Estimated Effort**: 6 hours

**Description**:
Final testing, documentation, and polish for full editor release.

**Acceptance Criteria**:
- [ ] All E2E tests passing (full workflow)
- [ ] User guide created (in-app help)
- [ ] Export format compatibility chart
- [ ] Tool compatibility guide (Cricut, Glowforge, etc.)
- [ ] Performance benchmarks documented
- [ ] Accessibility audit complete (WCAG 2.2 AAA)
- [ ] README updated with all features
- [ ] Video tutorial (optional)

---

**Sprint 6 Success Criteria**:
- [ ] BMP export working perfectly
- [ ] All dithering algorithms export correctly
- [ ] Export presets for 5+ tools
- [ ] Multi-format export functional
- [ ] All export E2E tests passing
- [ ] Full documentation complete
- [ ] Performance: All exports <10s

---

## Project Completion Summary

**Total Sprints**: 6
**Total Tasks**: 61
**Total Estimated Duration**: 12 weeks

**Feature Comparison with Imag-R**:

| Feature | Imag-R | CraftyPrep (After Sprint 6) |
|---------|--------|------------------------------|
| Upload | ✅ | ✅ |
| Crop | ✅ | ✅ (Sprint 4) |
| Resize | ✅ | ✅ (Sprint 4) |
| Add Text | ✅ | ✅ (Sprint 5) |
| Material Selection | ✅ | ✅ (Sprint 5) |
| Algorithm Choice | ✅ | ✅ (Sprint 5) |
| Preview | ✅ | ✅ |
| Export Formats | PNG, JPG | PNG, JPG, BMP, SVG (Sprint 6) |
| Dithering | ✅ | ✅ 5+ algorithms (Sprint 5-6) |
| Tool Presets | ❌ | ✅ Cricut, Glowforge, LaserGRBL (Sprint 6) |

**CraftyPrep will be feature-complete with Imag-R and add:**
- More dithering algorithms (5+)
- Tool-specific export presets
- Better accessibility (WCAG 2.2 AAA)
- Open-source and free

---

**Project Philosophy**:
- User-centric design
- Accessibility first (WCAG 2.2 AAA)
- Performance-optimized
- Privacy-focused (client-side only)
- Comprehensive testing (≥80% coverage)
- Docker-ready deployment
- Open-source contribution

---

**Note**: Sprints 4-6 tasks will be expanded with detailed acceptance criteria when Sprint 3 is complete.
