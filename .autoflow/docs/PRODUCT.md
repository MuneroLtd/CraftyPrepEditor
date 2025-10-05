# Product Vision and Specifications

## Executive Summary

**CraftyPrep** is a comprehensive web-based image editor designed specifically for laser engraving, cutting, and crafting enthusiasts. It transforms complex image preparation into a streamlined workflow with professional editing tools, material-specific presets, and multi-format export capabilities.

**Problem Statement**: Preparing images for laser engraving, Cricut cutting, or other crafting tools requires expensive software (like Imag-R) or technical expertise. Users waste time with trial-and-error, incompatible formats, and manual adjustments for different materials.

**Solution**: A free, browser-based editor that rivals Imag-R with:
- **6-step workflow**: Upload → Crop → Resize → Material Preset → Text Overlay → Export
- **Advanced editing**: Precision crop, dimension control (mm/inches), DPI configuration
- **Material presets**: Wood, Acrylic, Leather, Tile, Glass, Metal, Cork, Fabric
- **Dithering algorithms**: Floyd-Steinberg, Atkinson, Stucki, Sierra, Burkes
- **Multi-format export**: PNG, JPG, BMP, SVG with tool-specific presets (Cricut, Glowforge, LaserGRBL)

**Business Value**:
- **Competitive Alternative**: Feature parity with Imag-R at zero cost
- **Universal Compatibility**: Export for ANY laser/cutting tool
- **Professional Results**: Material-specific algorithms ensure optimal output
- **Privacy-First**: Client-side processing (no server uploads)
- **Accessibility**: WCAG 2.2 AAA compliant (better than competitors)

## Target Users

### Primary Personas

**1. Weekend Maker - "Sarah"**
- **Role**: Hobbyist with home laser engraver
- **Experience Level**: Beginner to intermediate with laser engraving
- **Goals**:
  - Create custom engravings on gifts, home decor, and personal projects
  - Get good results quickly without learning complex software
  - Experiment with different images and materials
- **Pain Points**:
  - Frustrated by expensive professional software subscriptions
  - Wastes material on test runs that don't turn out well
  - Unsure which settings to use for different materials
  - Spends more time on image prep than actual engraving
- **Success Criteria**: Can prep an image and start engraving within 2 minutes

**2. Small Business Owner - "Marcus"**
- **Role**: Runs custom engraving business from home
- **Experience Level**: Intermediate, does 5-10 jobs per day
- **Goals**:
  - Quick turnaround for customer orders
  - Consistent quality results across different images
  - Efficient workflow to maximize profitability
  - Professional-looking outputs
- **Pain Points**:
  - Needs fast results - time is money
  - Customer images vary wildly in quality
  - Can't afford expensive professional tools
  - Needs repeatable process for material presets
- **Success Criteria**: Processes 10+ images per day with 90%+ first-time success rate

**3. Professional Engraver - "Alex"**
- **Role**: Works in production engraving shop
- **Experience Level**: Expert, high-volume work
- **Goals**:
  - Maximum efficiency and consistency
  - Fine control for optimal material utilization
  - Save custom presets for repeat customers
  - Minimize material waste
- **Pain Points**:
  - Current tools are slow or clunky
  - Needs precision control when auto-prep isn't perfect
  - Works with specialized materials requiring specific settings
- **Success Criteria**: Auto-prep works 80%+ of time, manual refinement takes <30 seconds

### User Needs Summary

**All users need to**:
- Upload images quickly (drag-drop or file picker)
- Get immediate visual feedback on processing results
- Understand what the "Auto-Prep" is doing
- Download processed images in appropriate formats
- Use the tool without training or tutorials

## Product Features

### MVP Features (Must Have)

#### 1. Image Upload
**Description**: Simple, intuitive image upload interface supporting common image formats.

**User Value**: Users can easily get their images into the tool without technical hurdles.

**Acceptance Criteria**:
- [ ] Drag-and-drop file upload
- [ ] Click-to-browse file picker
- [ ] Supports JPG, PNG, GIF, BMP formats
- [ ] File size limit: 10MB maximum
- [ ] Clear visual feedback during upload
- [ ] Error messages for unsupported formats or oversized files

#### 2. Auto-Prep Processing
**Description**: One-click automatic optimization applying industry-standard laser engraving preprocessing.

**User Value**: Instantly transforms any image into a laser-ready format without manual adjustment.

**Acceptance Criteria**:
- [ ] Single "Auto-Prep" button
- [ ] Processing completes in <5 seconds for typical 2MB image
- [ ] Applies: grayscale conversion, contrast enhancement, automatic threshold
- [ ] Loading indicator during processing
- [ ] Preview updates automatically when complete
- [ ] Algorithm optimized for laser engraving (high contrast black/white)

#### 3. Image Preview
**Description**: Side-by-side or toggle view showing original vs. processed image.

**User Value**: Users can immediately see the transformation and judge if further refinement is needed.

**Acceptance Criteria**:
- [ ] Original image displayed on left
- [ ] Processed image displayed on right
- [ ] Zoom controls for detail inspection
- [ ] Pan/drag capability for large images
- [ ] Toggle between original and processed view
- [ ] Responsive layout works on desktop and tablet

#### 4. Refinement Sliders
**Description**: Real-time adjustment controls for brightness, contrast, and threshold.

**User Value**: Users can fine-tune auto-prep results for specific materials or preferences.

**Acceptance Criteria**:
- [ ] Brightness slider: -100 to +100
- [ ] Contrast slider: -100 to +100
- [ ] Threshold slider: 0 to 255
- [ ] Preview updates in real-time (<100ms response)
- [ ] Sliders have clear labels and current values displayed
- [ ] Reset button to return to auto-prep defaults

#### 5. Export/Download
**Description**: Download processed image in laser-ready format.

**User Value**: Users can take the optimized image directly to their laser engraver software.

**Acceptance Criteria**:
- [ ] Download as PNG (lossless, high quality)
- [ ] Download as JPG (smaller file size)
- [ ] Filename includes original name + "_laserprep" suffix
- [ ] Clear "Download" button always visible
- [ ] Download triggers immediately without additional dialogs

#### 6. Responsive UI
**Description**: Clean, modern interface that works on desktop, laptop, and tablet devices.

**User Value**: Users can prep images wherever they work, not tied to specific device.

**Acceptance Criteria**:
- [ ] Mobile-first responsive design
- [ ] Works on screens ≥768px width (tablet and up)
- [ ] Touch-friendly controls (≥44px tap targets)
- [ ] Intuitive layout requiring no instructions
- [ ] Accessible (WCAG 2.2 Level AAA compliant)

---
**Implementation**: PENDING
- **Sprint**: To be defined
- **Tasks**: To be planned
- **Status**: MVP feature set documented, awaiting implementation planning

---

### Post-MVP Features (Should Have)

#### 7. Material Presets
**Description**: Pre-configured settings optimized for common materials (wood, leather, acrylic, etc.).

**User Value**: Users get optimal results for their material without manual tuning.

**Implementation Target**: Sprint 3 or later

#### 8. Undo/Redo
**Description**: Step backward/forward through adjustment history.

**User Value**: Users can experiment freely without fear of losing good results.

**Implementation Target**: Sprint 3 or later

#### 9. Settings Persistence
**Description**: Remember last-used settings in browser localStorage.

**User Value**: Repeat users don't have to reconfigure their preferred settings each time.

**Implementation Target**: Sprint 3 or later

#### 10. Advanced Filters
**Description**: Dithering patterns, edge enhancement, noise reduction.

**User Value**: Professional users get additional creative control for specialized applications.

**Implementation Target**: Post-launch enhancement

---
**Implementation**: PENDING
- **Sprint**: Sprint 3 or post-launch
- **Tasks**: To be planned in later sprints
- **Status**: Feature backlog for future releases

---

### Nice to Have Features (Could Have)

- **Image History**: Track recently processed images in browser
- **Batch Processing**: Process multiple images at once
- **Material Thickness Calculator**: Recommend laser settings based on image and material
- **Direct Machine Integration**: Export directly to popular laser software
- **Cloud Save**: Optional account system to save presets and history
- **Social Sharing**: Share prep settings with community

---
**Implementation**: Not Tracked
- **Status**: Future consideration, not planned for initial releases

---

## User Journeys

### Journey 1: First-Time User Preps Image for Wood Engraving

**Context**: Sarah downloaded an image of her dog and wants to engrave it on a wooden plaque as a gift.

**Steps**:
1. Sarah navigates to craftyprep.demosrv.uk
2. She sees a clean interface with "Upload Image" dropzone
3. She drags her dog photo from desktop onto the dropzone
4. Image appears instantly with preview on left
5. She clicks the prominent "Auto-Prep" button
6. Within 3 seconds, processed image appears on right
7. Result looks good - high contrast, details visible
8. She clicks "Download PNG"
9. File downloads as "dog_laserprep.png"
10. She loads it into her laser software and starts engraving

**Expected Outcome**: Total time <2 minutes. Success on first try.

**Potential Issues**:
- Auto-prep might be too aggressive (too dark or too light)
- Solution: Quick adjustment with brightness slider

### Journey 2: Business Owner Refines Settings for Leather

**Context**: Marcus receives a customer photo that's slightly washed out. He needs optimal results for leather engraving.

**Steps**:
1. Marcus visits craftyprep.demosrv.uk (bookmarked)
2. Uploads customer photo via file picker
3. Clicks "Auto-Prep"
4. Reviews result - slightly too light for leather
5. Adjusts threshold slider +20 to darken
6. Adjusts contrast slider +10 for better definition
7. Previews updates in real-time as he adjusts
8. Satisfied with result
9. Downloads PNG
10. Proceeds to laser software

**Expected Outcome**: Total time <90 seconds including refinement.

**Potential Issues**:
- Might need to try several slider combinations
- Solution: Material presets (leather) in future release

### Journey 3: Professional Uses Tool for Quick Quality Check

**Context**: Alex has processed an image in professional software but wants to compare results with auto-prep.

**Steps**:
1. Opens craftyprep.demosrv.uk in second browser tab
2. Drags same source image
3. Clicks "Auto-Prep"
4. Compares result to professional software output
5. Notices auto-prep caught detail in shadows that pro software missed
6. Adjusts pro software settings based on auto-prep insight
7. Uses CraftyPrep result directly for this job (faster)

**Expected Outcome**: CraftyPrep provides valuable reference even for expert users.

## Success Metrics

### Business Metrics
- **User Acquisition**: 1,000 unique users in first month post-launch
- **User Retention**: 30% return within 7 days
- **Processing Volume**: 10,000+ images processed in first quarter
- **User Satisfaction**: >4.5/5 average rating (if feedback implemented)

### User Metrics
- **Time to First Success**: <3 minutes from landing to download
- **Auto-Prep Success Rate**: 80% of users download without refinement
- **Refinement Usage**: Average <2 slider adjustments per image
- **Completion Rate**: >90% of uploads result in download

### Technical Metrics
- **Page Load Time**: <2 seconds (desktop, broadband)
- **Processing Time**: <5 seconds for 2MB image
- **Uptime**: 99.5% availability
- **Browser Support**: Works on latest Chrome, Firefox, Safari, Edge
- **Accessibility Score**: Lighthouse accessibility ≥95/100

## Release Strategy

### Phase 1: MVP Launch (Sprints 1-2, Weeks 1-4)
**Goal**: Deliver core functionality that solves primary user pain point

**Features**:
- Image upload (drag-drop, file picker)
- Auto-prep processing
- Basic refinement sliders
- Export/download
- Responsive UI

**Success Criteria**:
- Functional end-to-end workflow
- Processing works reliably
- UI is intuitive and accessible

### Phase 2: Enhanced UX (Sprint 3, Weeks 5-6)
**Goal**: Improve user experience and add convenience features

**Features**:
- Material presets (wood, leather, acrylic)
- Undo/redo functionality
- Settings persistence
- Performance optimization
- Cross-browser testing

**Success Criteria**:
- Users report improved workflow
- Processing faster
- Presets provide value

### Phase 3: Production Deployment (Week 7)
**Goal**: Deploy to production environment

**Activities**:
- Deploy to craftyprep.demosrv.uk
- Configure Traefik routing
- SSL certificate setup
- Monitoring and alerting
- User documentation

**Success Criteria**:
- Site accessible at craftyprep.demosrv.uk
- HTTPS working
- Performance meets targets

### Phase 4: Post-Launch Enhancements (Ongoing)
**Goal**: Iterate based on user feedback

**Potential Features**:
- Batch processing
- Advanced filters
- Image history
- Material calculator
- Community presets

**Success Criteria**:
- Features driven by user requests
- Continuous improvement of success metrics

## Product Principles

1. **Simplicity First**: Every feature must justify its complexity. Default should be one-click success.

2. **Performance Matters**: Users work in iterative workflows. Slow tools break flow. Target <100ms response for adjustments.

3. **Accessible to All**: Tool should work for complete beginners and provide value to experts.

4. **Privacy Focused**: No user accounts, no data collection, all processing client-side. What happens in browser stays in browser.

5. **Material Agnostic**: Default settings should work acceptably on any material. Presets provide optimization.

## Competitive Landscape

**Current Solutions**:
- **GIMP/Photoshop**: Powerful but complex, expensive, steep learning curve
- **Lightburn Image Trace**: Built into laser software but limited control
- **Online Converters**: Generic image processing, not laser-optimized
- **Mobile Apps**: Require download, limited functionality

**CraftyPrep Advantages**:
- **Free**: No cost, no subscription, no trial period
- **Laser-Optimized**: Algorithm designed specifically for engraving
- **Browser-Based**: No installation, works everywhere
- **Simple**: One click to success, refinement if needed
- **Fast**: Instant processing, no server round-trips
- **Private**: No uploads, no tracking, no accounts

## Future Vision

CraftyPrep could evolve into a comprehensive laser preparation platform including:
- Multi-tool support (different laser types, CNC, vinyl cutters)
- Community marketplace for sharing presets and techniques
- Integration with popular laser control software
- AI-powered material detection and automatic preset selection
- Educational content and tutorials
- Premium features for professional users (batch processing, advanced filters)

**Current Focus**: Nail the core value proposition - simple, fast, effective image preparation for laser engraving.
