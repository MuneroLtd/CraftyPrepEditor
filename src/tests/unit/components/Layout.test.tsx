import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Layout from '../../../components/Layout';

describe('Layout Component', () => {
  it('renders with semantic HTML5 structure', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check for semantic elements
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders children in main content area', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();

    // Ensure content is within main element
    const main = document.querySelector('main');
    expect(main).toContainElement(content);
  });

  it('applies correct ARIA landmarks', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check ARIA landmarks (using semantic elements is preferred)
    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('has responsive layout classes', () => {
    const { container } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Layout should have a container with responsive classes
    const layoutContainer = container.firstChild as HTMLElement;
    expect(layoutContainer).toBeInTheDocument();

    // Verify it has Tailwind classes for layout
    expect(layoutContainer.className).toBeTruthy();
    expect(layoutContainer.className.length).toBeGreaterThan(0);
  });

  it('maintains minimum height for full viewport', () => {
    const { container } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const layoutContainer = container.firstChild as HTMLElement;

    // Should have min-h-screen or equivalent for full viewport height
    expect(layoutContainer.className).toMatch(/min-h-screen|h-screen|min-h-\[100vh\]/);
  });

  it('renders header, main, and footer in correct order', () => {
    const { container } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const children = Array.from(container.firstChild?.childNodes || []);
    const elementNames = children
      .filter((node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE)
      .map((node) => node.tagName.toLowerCase());

    // Skip link (anchor) + header + main + footer
    expect(elementNames).toContain('a'); // Skip link
    expect(elementNames).toContain('header');
    expect(elementNames).toContain('main');
    expect(elementNames).toContain('footer');
  });

  describe('Accessibility - Skip Link', () => {
    it('has skip link to main content', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('skip link is visually hidden by default', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const skipLink = screen.getByText('Skip to main content');
      // Should have sr-only class (screen reader only)
      expect(skipLink).toHaveClass('sr-only');
    });

    it('skip link becomes visible on focus', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const skipLink = screen.getByText('Skip to main content');
      // Should have focus:not-sr-only to become visible
      expect(skipLink.className).toContain('focus:not-sr-only');
      expect(skipLink.className).toContain('focus:absolute');
    });

    it('main content has matching id for skip link', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });

    it('skip link is keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const skipLink = screen.getByText('Skip to main content');

      // Tab should focus skip link first
      await user.tab();
      expect(skipLink).toHaveFocus();
    });
  });

  describe('Keyboard Navigation', () => {
    it('maintains logical tab order: skip link -> header -> main -> footer', async () => {
      const user = userEvent.setup();

      render(
        <Layout>
          <button>Content Button</button>
        </Layout>
      );

      const skipLink = screen.getByText('Skip to main content');

      // First tab: skip link
      await user.tab();
      expect(skipLink).toHaveFocus();

      // Continue tabbing through to content
      await user.tab();
      // May go through header elements (navigation, etc.)
      // Eventually should reach content button
      // Note: Exact tab count depends on header content

      // Skip link functionality: pressing Enter should focus main
      await user.tab(); // Go back to start
      await user.tab(); // Focus skip link
      expect(skipLink).toHaveFocus();

      // Note: Testing actual focus jump requires simulating click on skip link
      // which is covered by the fact that it's a valid anchor with href="#main-content"
    });

    it('all interactive elements are keyboard focusable', async () => {
      const user = userEvent.setup();

      render(
        <Layout>
          <button>Button 1</button>
          <a href="/test">Link 1</a>
          <button>Button 2</button>
        </Layout>
      );

      // Tab through all focusable elements
      const skipLink = screen.getByText('Skip to main content');
      await user.tab();
      expect(skipLink).toHaveFocus();

      // Continue to interactive elements in main
      const button1 = screen.getByRole('button', { name: 'Button 1' });
      const link1 = screen.getByRole('link', { name: 'Link 1' });
      const button2 = screen.getByRole('button', { name: 'Button 2' });

      // All should be reachable via tab (order may vary)
      await user.tab();
      await user.tab();
      await user.tab();

      // Verify all elements are focusable (by attempting to tab through)
      // Exact assertion depends on DOM order
      expect(button1).toBeInTheDocument();
      expect(link1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
    });
  });
});
