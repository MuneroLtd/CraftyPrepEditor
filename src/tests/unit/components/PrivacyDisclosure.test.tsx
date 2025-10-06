import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrivacyDisclosure } from '@/components/PrivacyDisclosure';

describe('PrivacyDisclosure', () => {
  it('renders privacy disclosure message', () => {
    render(<PrivacyDisclosure />);

    const message = screen.getByText(/settings are saved locally in your browser/i);
    expect(message).toBeInTheDocument();
  });

  it('displays complete privacy message with both sentences', () => {
    render(<PrivacyDisclosure />);

    const message = screen.getByText(
      'Settings are saved locally in your browser. No data leaves your device.'
    );
    expect(message).toBeInTheDocument();
  });

  it('renders as a paragraph element', () => {
    const { container } = render(<PrivacyDisclosure />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
  });

  it('has text-xs styling class', () => {
    const { container } = render(<PrivacyDisclosure />);

    const paragraph = container.querySelector('p');
    expect(paragraph?.className).toContain('text-xs');
  });

  it('has text-muted-foreground styling class', () => {
    const { container } = render(<PrivacyDisclosure />);

    const paragraph = container.querySelector('p');
    expect(paragraph?.className).toContain('text-muted-foreground');
  });

  it('mounts and unmounts without errors', () => {
    const { unmount } = render(<PrivacyDisclosure />);

    expect(() => unmount()).not.toThrow();
  });

  it('text is accessible and readable by screen readers', () => {
    render(<PrivacyDisclosure />);

    const message = screen.getByText(/settings are saved locally in your browser/i);

    // Text should be visible to screen readers (not hidden)
    expect(message).toBeVisible();
    expect(message).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the same content on multiple renders', () => {
    const { rerender } = render(<PrivacyDisclosure />);

    const firstRender = screen.getByText(
      'Settings are saved locally in your browser. No data leaves your device.'
    );

    rerender(<PrivacyDisclosure />);

    const secondRender = screen.getByText(
      'Settings are saved locally in your browser. No data leaves your device.'
    );

    expect(firstRender.textContent).toBe(secondRender.textContent);
  });

  it('contains privacy-focused language about local storage', () => {
    render(<PrivacyDisclosure />);

    // Verify key privacy terms are present
    expect(screen.getByText(/locally/i)).toBeInTheDocument();
    expect(screen.getByText(/no data leaves your device/i)).toBeInTheDocument();
  });

  it('has role="note" for enhanced screen reader accessibility', () => {
    const { container } = render(<PrivacyDisclosure />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveAttribute('role', 'note');
  });

  it('can be found by role="note"', () => {
    render(<PrivacyDisclosure />);

    const note = screen.getByRole('note');
    expect(note).toBeInTheDocument();
    expect(note).toHaveTextContent(
      'Settings are saved locally in your browser. No data leaves your device.'
    );
  });
});
