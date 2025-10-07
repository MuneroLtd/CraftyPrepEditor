# Component Library Specification

**Project**: CraftyPrep Image Editor
**Task**: task-023 - UI/UX Audit and Design System
**Purpose**: Define all UI components with variants, sizes, states, and accessibility requirements

---

## Overview

This document specifies the complete component library for the CraftyPrep image editor. All components are designed to work with:
- **Framework**: Radix UI primitives + Tailwind CSS
- **Themes**: Light and dark mode support
- **Accessibility**: WCAG 2.2 Level AAA compliance
- **Design System**: Based on design tokens from `design-tokens.ts`

---

## Button Component

### Variants (6 types)

#### 1. Primary (Solid)
- **Background**: `bg-primary` (hsl(221 83% 53%) - Blue 500)
- **Text**: `text-primary-foreground` (white)
- **Border**: None
- **Use Case**: Primary actions (Upload Image, Apply, Save)

#### 2. Secondary (Outlined)
- **Background**: Transparent
- **Text**: `text-foreground`
- **Border**: `border border-input` (1px solid)
- **Use Case**: Secondary actions (Cancel, Reset)

#### 3. Ghost (Minimal)
- **Background**: Transparent
- **Text**: `text-foreground`
- **Border**: None
- **Hover**: `bg-muted` background
- **Use Case**: Tertiary actions, toolbar buttons

#### 4. Destructive (Danger)
- **Background**: `bg-destructive` (hsl(0 84% 60%) - Red 500)
- **Text**: `text-destructive-foreground` (white)
- **Border**: None
- **Use Case**: Delete, Remove, Discard actions

#### 5. Icon (Icon Only)
- **Shape**: Square or circular (40x40px base size)
- **Background**: Transparent or `bg-muted`
- **Icon**: Centered, 20px base size
- **Use Case**: Toolbar icons, quick actions

#### 6. Link (Text Only)
- **Background**: Transparent
- **Text**: `text-primary` with `underline-offset-4`
- **Underline**: On hover only
- **Use Case**: Help links, "Learn more" actions

### Sizes (3 sizes)

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| **Small (sm)** | 32px (h-8) | px-3 py-1.5 | text-sm (14px) | 16px |
| **Base** | 40px (h-10) | px-4 py-2 | text-base (16px) | 20px |
| **Large (lg)** | 48px (h-12) | px-6 py-3 | text-lg (18px) | 24px |

### States (6 states)

#### 1. Default
- Base appearance as defined per variant

#### 2. Hover
- **Primary**: `bg-primary-hover` (darker blue)
- **Secondary**: `border-primary` + `text-primary`
- **Ghost**: `bg-muted`
- **Destructive**: Darker red
- **Icon**: `bg-muted` (if not already)
- **Link**: Underline appears

#### 3. Active (pressed)
- **Primary**: `bg-primary-active` (even darker)
- **All variants**: Slightly scaled (scale-95)

#### 4. Disabled
- **Opacity**: `opacity-50`
- **Cursor**: `cursor-not-allowed`
- **Pointer Events**: None
- **Aria**: `aria-disabled="true"`

#### 5. Focus
- **Ring**: `ring-2 ring-ring ring-offset-2`
- **Ring Color**: `hsl(var(--ring))` (Blue 500)
- **Contrast**: ≥3:1 with background

#### 6. Loading
- **Spinner**: Inline spinner icon (animated)
- **Text**: "Loading..." or hidden
- **Disabled**: Yes (pointer-events: none)

### Accessibility

- **Keyboard**:
  - `Enter` or `Space` to activate
  - `Tab` to focus, `Shift+Tab` to reverse
- **ARIA**:
  - Icon-only buttons: `aria-label="descriptive text"`
  - Loading state: `aria-busy="true"`
  - Disabled state: `aria-disabled="true"`
- **Focus**: Visible 3px ring with ≥3:1 contrast
- **Touch**: Minimum 44x44px hit area (base and lg meet this)

### Example Usage

```tsx
// Primary button
<Button variant="primary" size="base">Upload Image</Button>

// Icon button with tooltip
<Button variant="icon" size="base" aria-label="Undo">
  <Undo className="h-5 w-5" />
</Button>

// Destructive action
<Button variant="destructive" size="base">Delete Image</Button>
```

---

## Slider Component

### Visual Design

```
┌─────────────────────────────────────────────┐
│ Label: Brightness        Value: +25         │
│                                             │
│  [-]  ━━━━━━━━━━●━━━━━━━━━━━━━━━━━━  [+]   │
│      -100                0                100│
└─────────────────────────────────────────────┘
```

**Components**:
- **Track**: Full width, 6px height, rounded-full
  - Background: `bg-muted`
  - Fill (left of handle): `bg-primary` (gradient for value visualization)
- **Handle**: 20px circular, absolute positioned
  - Background: `bg-background`
  - Border: `border-2 border-primary`
  - Shadow: `shadow-md`
- **Value Display**: Inline, monospace font (`font-mono text-base`)
- **Min/Max Labels**: `text-xs text-muted-foreground` below track
- **+/- Buttons**: Optional, `32px` icon buttons on each end

### Features

1. **Real-Time Value Update**
   - Value updates on `onValueChange` callback
   - Display refreshes immediately

2. **Keyboard Support**
   - `Arrow Left/Right`: Decrease/increase by 1
   - `Page Up/Down`: Decrease/increase by 10
   - `Home`: Jump to minimum (-100)
   - `End`: Jump to maximum (100)

3. **Touch-Friendly**
   - Handle hit area: 44x44px (even if visual is 20px)
   - Track click: Jump to position
   - Drag: Smooth value update

4. **Gradient Track Visualization**
   - Track shows gradient from min to current value
   - Visual feedback for adjustment intensity

5. **Tooltip on Hover**
   - Shows current value on handle hover
   - Positioned above handle

### States (5 states)

| State | Appearance |
|-------|------------|
| **Default** | Track `bg-muted`, handle `border-primary` |
| **Hover** | Handle `scale-110`, tooltip appears |
| **Dragging** | Handle `scale-105`, cursor `cursor-grabbing` |
| **Disabled** | `opacity-50`, `cursor-not-allowed` |
| **Focus** | Handle `ring-2 ring-ring ring-offset-2` |

### Accessibility

- **ARIA**:
  - `role="slider"`
  - `aria-valuemin="-100"`
  - `aria-valuemax="100"`
  - `aria-valuenow="{currentValue}"`
  - `aria-label="Brightness adjustment"`
- **Keyboard**: Full support (arrows, page, home/end)
- **Screen Reader**: Announces value changes

---

## Panel Components

### 1. Card Panel (Elevated)

**Design**:
- **Background**: `bg-card`
- **Border**: `border border-border`
- **Border Radius**: `rounded-lg` (8px)
- **Shadow**: `shadow-md`
- **Padding**: `p-6` (24px)

**Use Case**: Settings sections, image info displays

### 2. Collapsible Panel (Accordion)

**Structure**:
```
┌─────────────────────────────────────┐
│ ▼ Adjustments                    │ ← Header (clickable)
├─────────────────────────────────────┤
│                                     │
│  [Brightness Slider]                │ ← Body (collapsible)
│  [Contrast Slider]                  │
│  [Threshold Slider]                 │
│                                     │
└─────────────────────────────────────┘
```

**Header**:
- **Height**: `48px`
- **Padding**: `px-4`
- **Icon**: Chevron (rotates 90° when expanded)
- **Title**: `text-base font-medium`
- **Actions**: Optional action buttons on right

**Body**:
- **Padding**: `p-4`
- **Animation**: `data-[state=open]:animate-accordion-down`
- **Max Height**: Scrollable if content exceeds 400px

**ARIA**:
- `aria-expanded="true|false"`
- `aria-controls="{bodyId}"`

### 3. Floating Panel (Draggable)

**Design**:
- **Position**: `fixed` or `absolute`
- **Background**: `bg-popover`
- **Shadow**: `shadow-xl`
- **Border**: `border border-border`
- **Drag Handle**: Top bar with grab cursor

**Features**:
- Draggable via header
- Repositionable anywhere
- Remembers last position (localStorage)
- Close button (X) in top-right

### 4. Sidebar Panel (Fixed)

**Desktop**:
- **Width**: `64px` (collapsed) or `240px` (expanded)
- **Height**: Full viewport (`h-screen`)
- **Background**: `bg-background`
- **Border**: `border-r border-border`

**Tablet**:
- **Width**: `64px` (icon-only)
- **Expand**: On hover (temporary overlay)

**Mobile**:
- **Hidden**: By default
- **Show**: Bottom sheet modal

### 5. Toolbar Panel (Horizontal)

**Design**:
- **Height**: `56px`
- **Width**: Full width
- **Background**: `bg-toolbar-bg`
- **Border**: `border-b border-border`
- **Layout**: Flexbox (justify-between)

**Sections**:
- **Left**: Logo, file operations
- **Center**: Undo/redo, reset
- **Right**: Zoom, theme, help

---

## Input Components

### 1. Text Input (Single-Line)

**Design**:
- **Height**: `40px` (base)
- **Padding**: `px-3 py-2`
- **Border**: `border border-input`
- **Border Radius**: `rounded-md` (6px)
- **Background**: `bg-background`
- **Font**: `text-base`

**States**:
- **Default**: `border-input`
- **Hover**: `border-ring`
- **Focus**: `ring-2 ring-ring ring-offset-2`
- **Error**: `border-error` + error message below
- **Disabled**: `opacity-50 cursor-not-allowed`

### 2. Number Input (with +/- buttons)

**Structure**:
```
┌──────────────────────────────┐
│  [-]   100   [+]             │
└──────────────────────────────┘
```

**Features**:
- Decrement/increment buttons (32px each)
- Centered value display
- Keyboard: Arrow up/down to adjust

### 3. Select (Dropdown)

**Design**:
- **Trigger**: Same as text input + chevron icon
- **Dropdown**: `bg-popover`, `shadow-lg`, max 8 items visible
- **Option**: `px-3 py-2`, `hover:bg-muted`

### 4. Checkbox (Toggle)

**Design**:
- **Size**: `20x20px`
- **Border**: `border-2 border-primary`
- **Checked**: `bg-primary` + checkmark icon
- **Label**: Adjacent text with `for` attribute

### 5. Radio (Mutually Exclusive)

**Design**:
- **Size**: `20x20px` circular
- **Border**: `border-2 border-primary`
- **Selected**: `bg-primary` + inner circle (8px)

### 6. Switch (Modern Toggle)

**Design**:
```
OFF:  ○━━━━  ON: ━━━━○
```

- **Track**: `44x24px`, rounded-full
- **Thumb**: `20x20px` circle
- **OFF**: `bg-muted`, thumb left
- **ON**: `bg-primary`, thumb right
- **Animation**: Smooth slide transition

### Accessibility

- **Labels**: All inputs have associated `<label>` with `for` attribute
- **Help Text**: `aria-describedby` for additional context
- **Error Messages**: `aria-invalid="true"` + `aria-errormessage`
- **Required**: `aria-required="true"` + visual indicator
- **Disabled**: `aria-disabled="true"` + visual opacity

---

## Icon System

### Icon Libraries

- **Primary**: Lucide React (`lucide-react`)
- **Secondary**: Heroicons (if needed)

### Icon Sizes (4 sizes)

| Size | Dimension | Class | Use Case |
|------|-----------|-------|----------|
| **Small (sm)** | 16px | `h-4 w-4` | Inline text, small buttons |
| **Base** | 20px | `h-5 w-5` | Default buttons, inputs |
| **Large (lg)** | 24px | `h-6 w-6` | Large buttons, headers |
| **Extra Large (xl)** | 32px | `h-8 w-8` | Hero sections, empty states |

### Usage Guidelines

1. **ARIA Labels**:
   - All icons have `aria-label` or `aria-hidden="true"` (if decorative)
   - Icon-only buttons: `aria-label="descriptive action"`

2. **Tooltips**:
   - Icon-only buttons MUST have tooltip on hover
   - Tooltip appears after 500ms delay

3. **Theme Adaptation**:
   - Icons use `currentColor` (inherit from parent text color)
   - `text-foreground` for primary icons
   - `text-muted-foreground` for secondary icons

4. **Stroke Width**:
   - Consistent `strokeWidth={2}` for all icons
   - Use `strokeWidth={1.5}` for large icons (lg, xl)

### Primary Icons Needed (20+ icons)

| Icon | Name (Lucide) | Use Case |
|------|---------------|----------|
| 📤 | `Upload` | Upload image |
| 📥 | `Download` | Download result |
| ✂️ | `Crop` | Crop tool |
| ↶ | `Undo` | Undo action |
| ↷ | `Redo` | Redo action |
| 🔄 | `RotateCw` | Reset adjustments |
| 🎨 | `Palette` | Color tools |
| ☀️ | `Sun` | Brightness |
| 🌗 | `Moon` | Contrast (or dark mode) |
| 🔲 | `Square` | Threshold |
| ➕ | `Plus` | Add, increase |
| ➖ | `Minus` | Remove, decrease |
| ⚙️ | `Settings` | Settings |
| ❓ | `HelpCircle` | Help |
| 🌙 | `Moon` (filled) | Dark theme |
| ☀️ | `Sun` (filled) | Light theme |
| 📁 | `FolderOpen` | Open file |
| 💾 | `Save` | Save |
| 🗑️ | `Trash2` | Delete |
| ℹ️ | `Info` | Information |
| ⚠️ | `AlertTriangle` | Warning |
| ✅ | `CheckCircle` | Success |
| ❌ | `XCircle` | Error |
| 🔍 | `ZoomIn` | Zoom in |
| 🔍 | `ZoomOut` | Zoom out |
| 👁️ | `Eye` | Preview |
| 👁️‍🗨️ | `EyeOff` | Hide |
| ☰ | `Menu` | Hamburger menu |
| ✖️ | `X` | Close |
| ⋮ | `MoreVertical` | More options |

---

## Component Validation Checklist

### Light and Dark Theme Support
- ✅ All components use CSS custom properties from design system
- ✅ Colors adapt automatically via `hsl(var(--name))` pattern
- ✅ No hardcoded colors in component definitions

### Accessibility Notes
- ✅ All components have ARIA labels where needed
- ✅ Keyboard navigation fully supported
- ✅ Focus indicators meet WCAG 2.2 AAA (≥3:1 contrast, ≥3px)
- ✅ Touch targets meet minimum 44x44px (or documented exception)

### Visual Examples
- ✅ Button: All 6 variants described with use cases
- ✅ Slider: ASCII art diagram with labeled components
- ✅ Panels: 5 types with structure and features
- ✅ Inputs: 6 types with states and features
- ✅ Icons: Size guide, usage guidelines, and 20+ icon list

### Radix UI + Tailwind CSS Implementability
- ✅ All components map to Radix UI primitives:
  - Button → `@radix-ui/react-button`
  - Slider → `@radix-ui/react-slider`
  - Collapsible → `@radix-ui/react-collapsible`
  - Select → `@radix-ui/react-select`
  - Checkbox → `@radix-ui/react-checkbox`
  - Switch → `@radix-ui/react-switch`
- ✅ All styles use Tailwind CSS utilities or design tokens

---

## Implementation Notes

1. **Component Base**: Use Radix UI primitives for accessibility and behavior
2. **Styling**: Apply Tailwind CSS classes + CSS custom properties
3. **Variants**: Use `class-variance-authority` (CVA) for variant management
4. **Composition**: Build complex components from simpler primitives
5. **Testing**: Accessibility tests with `@testing-library/react` + `jest-axe`

---

**Status**: Complete ✅
**Next**: Implement components in task-024 (Core UI Components)
