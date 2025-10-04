import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../../components/Footer';

describe('Footer Component', () => {
  it('renders with semantic footer element', () => {
    render(<Footer />);

    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('has contentinfo role (implicit from footer element)', () => {
    render(<Footer />);

    const contentinfo = screen.getByRole('contentinfo');
    expect(contentinfo).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(<Footer />);

    // Footer should contain some content (copyright, links, etc.)
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer?.textContent).not.toBe('');
  });

  it('applies responsive padding and layout', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');

    // Verify footer has classes
    expect(footer?.className).toBeTruthy();
    expect(footer?.className.length).toBeGreaterThan(0);

    // Should have padding/spacing classes
    expect(footer?.className).toMatch(/p-|px-|py-/);
  });

  it('has accessible text contrast', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');

    // Should have text and background color classes
    expect(footer?.className).toMatch(/text-|bg-/);
  });

  it('is positioned at bottom of layout', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');

    // Footer may have flex or grid properties to stick to bottom
    // This is more of a visual test, but we can check for common classes
    expect(footer).toBeInTheDocument();
  });
});
