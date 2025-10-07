import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /* ===== Colors ===== */
      colors: {
        // Base colors (shadcn/ui compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Primary
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // Secondary
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Destructive
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Muted
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Accent
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Popover
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Card
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Semantic colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },

        // Editor-specific
        canvas: 'hsl(var(--canvas-bg))',
        panel: 'hsl(var(--panel-bg))',
        toolbar: 'hsl(var(--toolbar-bg))',
        divider: 'hsl(var(--divider))',
      },

      /* ===== Border Radius ===== */
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        base: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
        DEFAULT: 'var(--radius)',
      },

      /* ===== Spacing (8px Grid) ===== */
      /* Note: Using extend to preserve Tailwind's default spacing values (7, 9, 11, etc.) */
      /* This allows both our custom 8px grid AND Tailwind's full spacing scale */

      /* ===== Font Sizes ===== */
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-snug)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
      },

      /* ===== Font Weights ===== */
      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },

      /* ===== Line Heights ===== */
      lineHeight: {
        none: 'var(--leading-none)',
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
        loose: 'var(--leading-loose)',
      },

      /* ===== Letter Spacing ===== */
      letterSpacing: {
        tight: 'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        wide: 'var(--tracking-wide)',
      },

      /* ===== Box Shadow ===== */
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        focus: 'var(--shadow-focus)',
      },

      /* ===== Transitions ===== */
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        medium: 'var(--duration-medium)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },

      transitionTimingFunction: {
        linear: 'var(--ease-linear)',
        in: 'var(--ease-in)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        elastic: 'var(--ease-elastic)',
        bounce: 'var(--ease-bounce)',
      },

      /* ===== Spacing (8px Grid - Extended) ===== */
      /* Adds our custom spacing values while preserving Tailwind defaults */
      spacing: {
        0: 'var(--space-0)',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },

      /* ===== Animation ===== */
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Accordion animations respect prefers-reduced-motion
        'accordion-down': 'accordion-down 300ms cubic-bezier(0, 0, 0.2, 1)',
        'accordion-up': 'accordion-up 300ms cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    forms,
    typography,
    // Custom plugin for prefers-reduced-motion support
    function({ addBase }) {
      addBase({
        // Disable accordion animations when user prefers reduced motion
        '@media (prefers-reduced-motion: reduce)': {
          '.data-\\[state\\=open\\]\\:animate-accordion-down': {
            animation: 'none !important',
            transition: 'none !important',
          },
          '.data-\\[state\\=closed\\]\\:animate-accordion-up': {
            animation: 'none !important',
            transition: 'none !important',
          },
          // Ensure content appears/disappears instantly
          '[data-state="open"]': {
            height: 'auto',
            opacity: '1',
          },
          '[data-state="closed"]': {
            height: '0',
            opacity: '0',
          },
        },
      });
    },
    // Custom plugin for editor-specific utilities
    function({ addUtilities, theme }) {
      addUtilities({
        // Focus ring utility (WCAG AAA compliant)
        '.focus-ring': {
          'outline': '3px solid hsl(var(--ring))',
          'outline-offset': '2px',
        },

        // Text gradient utility
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },

        // Smooth scrolling
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },

        // Hide scrollbar
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        // Thin scrollbar
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            'background-color': theme('colors.muted.DEFAULT'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': theme('colors.muted.foreground'),
            'border-radius': theme('borderRadius.full'),
          },
        },
      });
    },
  ],
};
