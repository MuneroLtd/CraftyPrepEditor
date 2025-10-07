/**
 * Design Tokens - CraftyPrep Image Editor
 *
 * Type-safe design system tokens for consistent theming.
 * All values correspond to CSS custom properties in styles/index.css
 *
 * **DESIGN DECISION: CSS Custom Properties as Source of Truth**
 *
 * This file references CSS custom properties via `hsl(var(--name))` pattern.
 * While this creates a dual structure (CSS + TypeScript), it's intentional:
 *
 * - **CSS**: Source of truth for values (colors, spacing, etc.)
 * - **TypeScript**: Convenience wrappers for type-safe access in components
 *
 * **Why Not DRY Violation:**
 * 1. CSS custom properties enable runtime theme switching (light/dark)
 * 2. TypeScript tokens provide autocomplete and type safety
 * 3. Single source of truth: Update CSS, TypeScript references update automatically
 * 4. No duplication of values, only duplication of structure (acceptable trade-off)
 *
 * **Future Consideration:**
 * Could generate TypeScript from CSS or vice versa, but current approach is
 * clear, maintainable, and leverages both CSS and TypeScript strengths.
 *
 * Usage:
 * ```ts
 * import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/design-tokens';
 *
 * const buttonStyle = {
 *   backgroundColor: COLORS.primary,
 *   padding: SPACING.md,
 *   fontSize: TYPOGRAPHY.sizes.sm,
 * };
 * ```
 */

/* ===== Colors ===== */

export const COLORS = {
  // Primary (Brand)
  primary: 'hsl(var(--primary))',
  primaryHover: 'hsl(var(--primary-hover))',
  primaryActive: 'hsl(var(--primary-active))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  // Neutral
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',

  // Semantic
  success: 'hsl(var(--success))',
  successForeground: 'hsl(var(--success-foreground))',
  warning: 'hsl(var(--warning))',
  warningForeground: 'hsl(var(--warning-foreground))',
  error: 'hsl(var(--error))',
  errorForeground: 'hsl(var(--error-foreground))',
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',

  // Surfaces
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // Interactive
  ring: 'hsl(var(--ring))',
  selection: 'hsl(var(--selection))',

  // Editor-specific
  canvasBg: 'hsl(var(--canvas-bg))',
  panelBg: 'hsl(var(--panel-bg))',
  toolbarBg: 'hsl(var(--toolbar-bg))',
  divider: 'hsl(var(--divider))',
} as const;

/* ===== Typography ===== */

export const TYPOGRAPHY = {
  sizes: {
    xs: 'var(--text-xs)', // 12px
    sm: 'var(--text-sm)', // 14px
    base: 'var(--text-base)', // 16px
    lg: 'var(--text-lg)', // 18px
    xl: 'var(--text-xl)', // 20px
    '2xl': 'var(--text-2xl)', // 24px
    '3xl': 'var(--text-3xl)', // 30px
  },
  lineHeights: {
    none: 'var(--leading-none)', // 1
    tight: 'var(--leading-tight)', // 1.25
    snug: 'var(--leading-snug)', // 1.375
    normal: 'var(--leading-normal)', // 1.5
    relaxed: 'var(--leading-relaxed)', // 1.625
    loose: 'var(--leading-loose)', // 2
  },
  weights: {
    normal: 'var(--font-normal)', // 400
    medium: 'var(--font-medium)', // 500
    semibold: 'var(--font-semibold)', // 600
    bold: 'var(--font-bold)', // 700
  },
  tracking: {
    tight: 'var(--tracking-tight)', // -0.025em
    normal: 'var(--tracking-normal)', // 0
    wide: 'var(--tracking-wide)', // 0.025em
  },
} as const;

/* ===== Spacing (8px Grid) ===== */

export const SPACING = {
  0: 'var(--space-0)', // 0px
  1: 'var(--space-1)', // 4px
  2: 'var(--space-2)', // 8px
  3: 'var(--space-3)', // 12px
  4: 'var(--space-4)', // 16px
  5: 'var(--space-5)', // 20px
  6: 'var(--space-6)', // 24px
  8: 'var(--space-8)', // 32px
  10: 'var(--space-10)', // 40px
  12: 'var(--space-12)', // 48px
  16: 'var(--space-16)', // 64px
  20: 'var(--space-20)', // 80px
  24: 'var(--space-24)', // 96px

  // Semantic aliases for common use cases
  xs: 'var(--space-1)', // 4px
  sm: 'var(--space-2)', // 8px
  md: 'var(--space-4)', // 16px
  lg: 'var(--space-6)', // 24px
  xl: 'var(--space-8)', // 32px
  '2xl': 'var(--space-12)', // 48px
} as const;

/* ===== Border Radius ===== */

export const RADIUS = {
  none: 'var(--radius-none)', // 0
  sm: 'var(--radius-sm)', // 4px
  base: 'var(--radius-base)', // 8px
  md: 'var(--radius-md)', // 12px
  lg: 'var(--radius-lg)', // 16px
  xl: 'var(--radius-xl)', // 24px
  full: 'var(--radius-full)', // 9999px
  default: 'var(--radius)', // 8px (alias)
} as const;

/* ===== Shadows (Elevations) ===== */

export const SHADOWS = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
  focus: 'var(--shadow-focus)',
} as const;

/* ===== Animations ===== */

export const ANIMATION = {
  durations: {
    instant: 'var(--duration-instant)', // 0ms
    fast: 'var(--duration-fast)', // 100ms
    base: 'var(--duration-base)', // 200ms
    medium: 'var(--duration-medium)', // 300ms
    slow: 'var(--duration-slow)', // 500ms
    slower: 'var(--duration-slower)', // 700ms
  },
  easings: {
    linear: 'var(--ease-linear)',
    in: 'var(--ease-in)',
    out: 'var(--ease-out)',
    inOut: 'var(--ease-in-out)',
    elastic: 'var(--ease-elastic)',
    bounce: 'var(--ease-bounce)',
  },
} as const;

/* ===== Component-Specific Tokens ===== */

/**
 * Button component design tokens
 * Composed from base tokens for consistency
 */
export const BUTTON = {
  sizes: {
    sm: {
      height: SPACING[8], // 32px
      padding: `0 ${SPACING[3]}`, // 0 12px
      fontSize: TYPOGRAPHY.sizes.xs,
    },
    base: {
      height: SPACING[10], // 40px
      padding: `0 ${SPACING[4]}`, // 0 16px
      fontSize: TYPOGRAPHY.sizes.sm,
    },
    lg: {
      height: SPACING[12], // 48px
      padding: `0 ${SPACING[6]}`, // 0 24px
      fontSize: TYPOGRAPHY.sizes.base,
    },
  },
  iconSizes: {
    sm: SPACING[4], // 16px
    base: SPACING[5], // 20px
    lg: SPACING[6], // 24px
  },
} as const;

/**
 * Slider component design tokens
 * Composed from base tokens for consistency
 */
export const SLIDER = {
  track: {
    height: SPACING[2], // 8px
    radius: RADIUS.full,
  },
  handle: {
    size: SPACING[6], // 24px
    radius: RADIUS.full,
  },
  incrementButton: {
    size: SPACING[8], // 32px
    fontSize: TYPOGRAPHY.sizes.base,
  },
} as const;

/**
 * Panel component design tokens
 * Composed from base tokens for consistency
 */
export const PANEL = {
  padding: SPACING[6], // 24px
  gap: SPACING[4], // 16px
  headerHeight: `calc(${SPACING[10]} + ${SPACING[6]})`, // 56px (40 + 16)
  footerHeight: `calc(${SPACING[16]})`, // 64px
  borderRadius: RADIUS.md, // 12px
  shadow: SHADOWS.sm,
} as const;

/**
 * Editor layout design tokens
 * Composed from base tokens for consistency
 */
export const LAYOUT = {
  toolbar: {
    height: `calc(${SPACING[10]} + ${SPACING[6]})`, // 56px (40 + 16)
    padding: SPACING[4], // 16px
    background: COLORS.toolbarBg,
  },
  sidebar: {
    widthCollapsed: `calc(${SPACING[16]})`, // 64px
    widthExpanded: `calc(${SPACING[20]} * 3)`, // 240px (60 * 4)
    background: COLORS.panelBg,
  },
  panel: {
    width: `calc(${SPACING[20]} * 4)`, // 320px (80 * 4)
    background: COLORS.panelBg,
  },
  statusBar: {
    height: SPACING[8], // 32px
    padding: SPACING[3], // 12px
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  canvas: {
    background: COLORS.canvasBg,
    padding: SPACING[10], // 40px
  },
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-index layers for stacking context
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

/**
 * Accessibility-specific tokens
 */
export const A11Y = {
  minTouchTarget: '44px', // WCAG AAA minimum
  focusRingWidth: '3px', // WCAG AAA minimum
  minContrastNormal: 7, // WCAG AAA ratio for normal text
  minContrastLarge: 4.5, // WCAG AAA ratio for large text (18pt+)
  minContrastUI: 3, // WCAG AAA ratio for UI components
} as const;

/* ===== Type Exports ===== */

export type ColorToken = keyof typeof COLORS;
export type TypographySize = keyof typeof TYPOGRAPHY.sizes;
export type TypographyWeight = keyof typeof TYPOGRAPHY.weights;
export type SpacingToken = keyof typeof SPACING;
export type RadiusToken = keyof typeof RADIUS;
export type ShadowToken = keyof typeof SHADOWS;
export type AnimationDuration = keyof typeof ANIMATION.durations;
export type AnimationEasing = keyof typeof ANIMATION.easings;
export type Breakpoint = keyof typeof BREAKPOINTS;
