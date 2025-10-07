import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollapsibleSection } from '../../../../components/layout/CollapsibleSection';
import { Settings } from 'lucide-react';

describe('CollapsibleSection', () => {
  it('should render title and icon', () => {
    render(
      <CollapsibleSection id="test" title="Test Section" icon={<Settings data-testid="icon" />}>
        <div>Content</div>
      </CollapsibleSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render children when expanded', () => {
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={true}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should not render children when collapsed', () => {
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={false}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    // Content is NOT in DOM when collapsed (conditional rendering for accessibility)
    const content = screen.queryByTestId('child-content');
    expect(content).not.toBeInTheDocument();

    // Check ARIA attribute to verify collapsed state
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should toggle on click', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={false}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    // Initially collapsed
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByText('Test Section'));

    // After click, should be expanded
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should toggle with Enter key', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={false}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    button.focus();

    await user.keyboard('{Enter}');

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should toggle with Space key', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={false}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    button.focus();

    await user.keyboard(' ');

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should work in controlled mode', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <CollapsibleSection id="test" title="Test Section" expanded={false} onToggle={onToggle}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    // Initially collapsed
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByText('Test Section'));
    expect(onToggle).toHaveBeenCalled();

    // Simulate parent updating expanded prop
    rerender(
      <CollapsibleSection id="test" title="Test Section" expanded={true} onToggle={onToggle}>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSection>
    );

    // After rerender with expanded=true, should be expanded
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should have proper ARIA attributes when expanded', () => {
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={true}>
        <div>Content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should have proper ARIA attributes when collapsed', () => {
    render(
      <CollapsibleSection id="test" title="Test Section" defaultExpanded={false}>
        <div>Content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should use button element for accessibility', () => {
    render(
      <CollapsibleSection id="test" title="Test Section">
        <div>Content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });
});
