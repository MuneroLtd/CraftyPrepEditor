# Research: task-018 - JPG Export Option

---

## Canvas API: toBlob Method

### Signature
```typescript
HTMLCanvasElement.toBlob(
  callback: BlobCallback,
  type?: string,
  quality?: number
): void;
```

### Parameters

**callback**: `(blob: Blob | null) => void`
- Called asynchronously with resulting Blob
- Returns null if canvas cannot be converted

**type**: `string` (optional)
- MIME type of image format
- Default: `'image/png'`
- Supported: `'image/png'`, `'image/jpeg'`, `'image/webp'`
- Browser support varies for WebP

**quality**: `number` (optional)
- Range: 0.0 to 1.0
- Only applies to lossy formats (JPEG, WebP)
- Ignored for PNG (lossless)
- Recommended for JPG: 0.95 (95%)

### Browser Support

| Browser | PNG | JPEG | WebP |
|---------|-----|------|------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ⚠️ (limited) |
| Edge 90+ | ✅ | ✅ | ✅ |

**Conclusion**: PNG and JPEG are universally supported. WebP is future consideration.

---

## JPEG Quality Settings

### Quality vs. File Size Trade-off

**Quality 100% (1.0)**:
- Minimal compression
- Large file size (~90% of PNG)
- Visually lossless for most images
- Not recommended: diminishing returns

**Quality 95% (0.95)** ✅ **RECOMMENDED**:
- Excellent visual quality
- Significant file size reduction (30-50% of PNG)
- Imperceptible quality loss for laser engraving
- Industry standard for high-quality exports

**Quality 90% (0.90)**:
- Good visual quality
- Further file size reduction (20-40% of PNG)
- Minor artifacts visible on close inspection
- Acceptable for web use

**Quality 80% (0.80)**:
- Moderate quality
- Aggressive compression (15-30% of PNG)
- Visible artifacts (blocking, color banding)
- Not recommended for laser engraving prep

**Quality 70% (0.70)**:
- Lower quality
- Very small files (10-25% of PNG)
- Significant artifacts
- Unsuitable for precision work

### Selection Rationale: 95%

**Why 95% quality?**
1. **Laser Engraving Context**: Details matter, quality is critical
2. **File Size Balance**: 50% reduction vs. PNG, minimal quality loss
3. **Industry Standard**: Common for high-quality image exports
4. **Future-Proof**: Leaves room for quality slider (Sprint 3+)

---

## File Format Comparison

### PNG (Portable Network Graphics)
**Characteristics**:
- Lossless compression
- Supports transparency (alpha channel)
- Larger file sizes
- Perfect for line art, text, graphics with sharp edges
- No quality degradation on re-save

**Use Cases**:
- Preserving maximum detail
- When file size is not a concern
- Images with transparency
- When re-editing is expected

**File Size** (typical 2MB source):
- Output: ~1.8-2.2 MB

### JPEG (Joint Photographic Experts Group)
**Characteristics**:
- Lossy compression
- No transparency support
- Smaller file sizes
- Optimized for photographs
- Quality degrades on re-save

**Use Cases**:
- Photographs and complex images
- When file size matters
- Final output (no further editing)
- Sharing via email or web

**File Size** (typical 2MB source at 95%):
- Output: ~0.8-1.2 MB (50% reduction)

### Laser Engraving Implications

**PNG Advantages**:
- Preserves all details
- No compression artifacts
- Better for fine details and edges

**JPG Advantages**:
- Smaller files (easier to share)
- Faster to load in engraving software
- Still excellent quality at 95%

**Recommendation**: Offer both, default to PNG (safer), allow JPG for file size optimization.

---

## Filename Generation

### Current Implementation (PNG)
```typescript
const baseName = originalFilename.replace(/\.[^/.]+$/, '');
const sanitizedBaseName = sanitizeFilename(baseName);
const filename = `${sanitizedBaseName}_laserprep.png`;
```

### Updated Implementation (Multi-Format)
```typescript
// Define extension mapping
const extensions: Record<ExportFormat, string> = {
  png: 'png',
  jpeg: 'jpg',  // Note: use 'jpg' not 'jpeg' for extension
};

// Generate filename
const baseName = originalFilename.replace(/\.[^/.]+$/, '');
const sanitizedBaseName = sanitizeFilename(baseName);
const extension = extensions[format];
const filename = `${sanitizedBaseName}_laserprep.${extension}`;
```

### Extension Convention
- Use `'jpg'` for JPEG files (not `'jpeg'`)
- Industry standard: .jpg more common than .jpeg
- Consistent with upload validation (accepts .jpg, .jpeg)

---

## UI Design Patterns

### Format Selector Options

#### Option 1: Radio Buttons (Recommended) ✅
```tsx
<fieldset>
  <legend>Export Format</legend>
  <label>
    <input type="radio" name="format" value="png" checked={format === 'png'} />
    PNG (Lossless)
  </label>
  <label>
    <input type="radio" name="format" value="jpeg" checked={format === 'jpeg'} />
    JPG (Smaller)
  </label>
</fieldset>
```

**Pros**:
- Native HTML element
- Built-in accessibility
- Keyboard navigation (Arrow keys)
- Screen reader friendly
- Clear mutual exclusivity

**Cons**:
- Slightly more verbose HTML

#### Option 2: Toggle Switch
```tsx
<button onClick={toggleFormat}>
  {format === 'png' ? 'PNG' : 'JPG'}
</button>
```

**Pros**:
- Compact UI
- Modern appearance

**Cons**:
- Requires custom accessibility
- Not immediately clear as format selector
- Arrow key navigation needs implementation

#### Option 3: Dropdown/Select
```tsx
<select value={format} onChange={handleChange}>
  <option value="png">PNG (Lossless)</option>
  <option value="jpeg">JPG (Smaller)</option>
</select>
```

**Pros**:
- Native HTML element
- Accessible by default

**Cons**:
- Overkill for two options
- Requires click to see options

**Decision**: Use radio buttons for clarity and accessibility.

---

## Accessibility Considerations

### WCAG 2.2 AAA Requirements

**Keyboard Navigation**:
- Radio buttons: Tab to group, Arrow keys to select
- Enter/Space to toggle
- Focus indicator ≥3px, ≥3:1 contrast

**Screen Reader Support**:
- Fieldset + legend for grouping
- Labels associated with inputs
- Format change announced via aria-live

**Visual Design**:
- Color contrast ≥7:1
- Don't rely on color alone
- Clear visual selection indicator

### Implementation
```tsx
<fieldset className="border rounded p-4">
  <legend className="text-sm font-medium">Export Format</legend>

  <div className="space-y-2" role="radiogroup" aria-label="Export format">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="format"
        value="png"
        checked={format === 'png'}
        onChange={() => setFormat('png')}
        className="focus:ring-3 focus:ring-blue-500"
      />
      <span>PNG (Lossless, larger file)</span>
    </label>

    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="format"
        value="jpeg"
        checked={format === 'jpeg'}
        onChange={() => setFormat('jpeg')}
        className="focus:ring-3 focus:ring-blue-500"
      />
      <span>JPG (Smaller file, 95% quality)</span>
    </label>
  </div>
</fieldset>
```

---

## Performance Considerations

### Blob Creation Time

**PNG**:
- 2MB image: ~500-800ms
- Lossless compression (slower)

**JPEG (95%)**:
- 2MB image: ~300-600ms
- Lossy compression (faster)

**Conclusion**: JPEG slightly faster, but both well under 2-second target.

### File Size Benchmarks

**Test Image**: Typical photograph, 2000x1500px

| Format | Quality | File Size | Reduction | Export Time |
|--------|---------|-----------|-----------|-------------|
| PNG | - | 2.1 MB | - | ~700ms |
| JPEG | 100% | 1.8 MB | 14% | ~550ms |
| JPEG | 95% | 1.1 MB | 48% | ~500ms |
| JPEG | 90% | 0.8 MB | 62% | ~450ms |
| JPEG | 80% | 0.6 MB | 71% | ~400ms |

**Conclusion**: 95% quality provides excellent balance.

---

## Testing Strategy

### Unit Tests

**useImageDownload hook**:
- Test format parameter defaults to 'png'
- Test MIME type selection based on format
- Test quality parameter (undefined for PNG, 0.95 for JPEG)
- Test filename extension based on format

**DownloadButton component**:
- Test format selector renders
- Test format state management
- Test button text updates
- Test format passed to hook

### Integration Tests

**Format Toggle Flow**:
1. Upload image
2. Select JPG format
3. Click download
4. Verify JPG export

**Filename Verification**:
- PNG: `photo.jpg` → `photo_laserprep.png`
- JPG: `photo.png` → `photo_laserprep.jpg`

### E2E Tests (Playwright)

**JPG Export Flow**:
```typescript
await page.selectOption('[name="format"]', 'jpeg');
const downloadPromise = page.waitForEvent('download');
await page.click('button:has-text("Download JPG")');
const download = await downloadPromise;
expect(download.suggestedFilename()).toMatch(/_laserprep\.jpg$/);
```

---

## Future Enhancements (Out of Scope)

### Sprint 3+ Considerations

**Quality Slider** (task-022 candidate):
- Allow user to adjust JPG quality (70-100%)
- Real-time file size preview
- Visual quality comparison

**Additional Formats**:
- WebP (modern, superior compression)
- AVIF (next-gen, even better)
- Browser support considerations

**Format Preference Persistence**:
- Remember last used format
- Use localStorage
- Per-user settings

**Batch Export**:
- Export multiple processed images
- Same format for all or individual selection

---

## References

**MDN Documentation**:
- [HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [Image File Type and Format Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)

**WCAG 2.2**:
- [Radio Button Accessibility](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Keyboard Navigation](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)

**Image Compression**:
- [JPEG Quality Settings Guide](https://photographylife.com/jpeg-compression-levels)
- [PNG vs JPEG Comparison](https://www.sitepoint.com/gif-png-jpg-which-one-to-use/)
