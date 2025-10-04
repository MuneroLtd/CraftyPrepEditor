import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../../components/Header';

describe('Header Component', () => {
  it('renders with semantic header element', () => {
    render(<Header />);

    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('has banner role (implicit from header element)', () => {
    render(<Header />);

    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
  });

  it('renders application title', () => {
    render(<Header />);

    // Application title should be present
    const title = screen.getByText(/CraftyPrep/i);
    expect(title).toBeInTheDocument();
  });

  it('uses proper heading hierarchy', () => {
    render(<Header />);

    // Should have an h1 for the main application title
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/CraftyPrep/i);
  });

  it('applies responsive padding and layout', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');

    // Verify header has classes
    expect(header?.className).toBeTruthy();
    expect(header?.className.length).toBeGreaterThan(0);

    // Should have responsive padding classes
    expect(header?.className).toMatch(/p-|px-|py-/);
  });

  it('has accessible contrast for text', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');

    // Should have text color classes (specific contrast will be validated visually)
    expect(header?.className).toMatch(/text-/);
  });
});
