import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('Project Setup Validation', () => {
  describe('React Setup', () => {
    it('should render App component', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have correct heading text', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('CraftyPrep - Laser Engraving Image Prep');
    });

    it('should apply Tailwind CSS classes', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
    });
  });

  describe('Environment', () => {
    it('should have jsdom environment', () => {
      expect(typeof window).toBe('object');
      expect(typeof document).toBe('object');
    });

    it('should support modern JavaScript features', () => {
      const testArray = [1, 2, 3];
      const doubled = testArray.map((x) => x * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });
  });
});
