import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  const renderWithTheme = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders a button', () => {
      renderWithTheme();
      const button = screen.getByRole('button');
      expect(button).toBeTruthy();
    });

    it('has accessible label', () => {
      renderWithTheme();
      const button = screen.getByRole('button', { name: /theme/i });
      expect(button).toBeTruthy();
    });

    it('displays Sun icon for light theme', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toMatch(/light/i);
    });

    it('displays Moon icon for dark theme', async () => {
      localStorage.setItem('craftyprep-theme', 'dark');
      renderWithTheme();

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toMatch(/dark/i);
    });

    it('displays Monitor icon for system theme', async () => {
      localStorage.setItem('craftyprep-theme', 'system');
      renderWithTheme();

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toMatch(/system/i);
    });
  });

  describe('cycling through themes', () => {
    it('cycles from light to dark on first click', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      await user.click(button);

      expect(localStorage.getItem('craftyprep-theme')).toBe('dark');
      expect(button.getAttribute('aria-label')).toMatch(/dark/i);
    });

    it('cycles from dark to system on second click', async () => {
      localStorage.setItem('craftyprep-theme', 'dark');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      await user.click(button);

      expect(localStorage.getItem('craftyprep-theme')).toBe('system');
      expect(button.getAttribute('aria-label')).toMatch(/system/i);
    });

    it('cycles from system to light on third click', async () => {
      localStorage.setItem('craftyprep-theme', 'system');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      await user.click(button);

      expect(localStorage.getItem('craftyprep-theme')).toBe('light');
      expect(button.getAttribute('aria-label')).toMatch(/light/i);
    });

    it('completes full cycle: light → dark → system → light', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      // Light → Dark
      await user.click(button);
      expect(localStorage.getItem('craftyprep-theme')).toBe('dark');

      // Dark → System
      await user.click(button);
      expect(localStorage.getItem('craftyprep-theme')).toBe('system');

      // System → Light
      await user.click(button);
      expect(localStorage.getItem('craftyprep-theme')).toBe('light');
    });
  });

  describe('keyboard accessibility', () => {
    it('is keyboard focusable', () => {
      renderWithTheme();
      const button = screen.getByRole('button');

      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('activates on Enter key', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(localStorage.getItem('craftyprep-theme')).toBe('dark');
    });

    it('activates on Space key', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(localStorage.getItem('craftyprep-theme')).toBe('dark');
    });
  });

  describe('ARIA attributes', () => {
    it('has appropriate role', () => {
      renderWithTheme();
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('has descriptive aria-label that includes current theme', () => {
      localStorage.setItem('craftyprep-theme', 'dark');
      renderWithTheme();

      const button = screen.getByRole('button');
      const label = button.getAttribute('aria-label');

      expect(label).toBeTruthy();
      expect(label).toMatch(/dark/i);
    });

    it('updates aria-label when theme changes', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      const initialLabel = button.getAttribute('aria-label');
      expect(initialLabel).toMatch(/light/i);

      await user.click(button);

      const updatedLabel = button.getAttribute('aria-label');
      expect(updatedLabel).toMatch(/dark/i);
    });
  });

  describe('visual feedback', () => {
    it('applies hover styles', () => {
      renderWithTheme();
      const button = screen.getByRole('button');

      // Check for hover-related classes
      expect(button.className).toMatch(/hover:/);
    });

    it('applies focus-visible styles', () => {
      renderWithTheme();
      const button = screen.getByRole('button');

      // Check for focus-visible classes
      expect(button.className).toMatch(/focus-visible:/);
    });
  });

  describe('touch target size', () => {
    it('has classes for minimum touch target size (44x44px)', () => {
      renderWithTheme();
      const button = screen.getByRole('button');

      // Check for width and height classes (w-11 = 44px, h-11 = 44px)
      // These Tailwind classes ensure WCAG AAA compliance
      expect(button.className).toMatch(/w-11/);
      expect(button.className).toMatch(/h-11/);
    });
  });

  describe('document class application', () => {
    it('applies dark class when switching to dark theme', async () => {
      localStorage.setItem('craftyprep-theme', 'light');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      await user.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class when switching to light theme', async () => {
      localStorage.setItem('craftyprep-theme', 'dark');
      renderWithTheme();

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      // Should start with dark class
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Click twice: dark → system → light
      await user.click(button);
      await user.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
