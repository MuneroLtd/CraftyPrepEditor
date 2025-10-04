import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders fallback UI when child component throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We apologize for the inconvenience/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText(/Oops! Something went wrong/i)).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('displays reload button that refreshes the page', async () => {
    const user = userEvent.setup();
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /reload page/i });
    expect(reloadButton).toBeInTheDocument();

    await user.click(reloadButton);
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('shows error details in development mode', () => {
    // Note: This test assumes import.meta.env.DEV is true in test environment
    // If not, the error details won't be shown

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check if error details are present (in development)
    const details = screen.queryByText(/Error Details/i);
    if (import.meta.env.DEV) {
      expect(details).toBeInTheDocument();
    }
  });

  it('has accessible fallback UI structure', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Check for button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('catches errors from deeply nested components', () => {
    const DeeplyNested = () => (
      <div>
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      </div>
    );

    render(
      <ErrorBoundary>
        <DeeplyNested />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
  });

  it('does not catch errors from event handlers', async () => {
    const user = userEvent.setup();
    let didThrow = false;

    const ErrorInHandler = () => {
      const handleClick = () => {
        didThrow = true;
        throw new Error('Event handler error');
      };

      return <button onClick={handleClick}>Throw Error</button>;
    };

    render(
      <ErrorBoundary>
        <ErrorInHandler />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button');

    // Error boundaries don't catch errors in event handlers
    // The error will be thrown but the boundary won't catch it
    try {
      await user.click(button);
    } catch (error) {
      // Expected - event handler errors are not caught by boundaries
      expect(didThrow).toBe(true);
      expect((error as Error).message).toBe('Event handler error');
    }

    // Verify the ErrorBoundary did NOT render fallback UI
    expect(screen.queryByText(/Oops! Something went wrong/i)).not.toBeInTheDocument();
  });
});
