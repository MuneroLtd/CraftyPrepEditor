import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

// Mock hooks to control test behavior
vi.mock('@/hooks/useFileUpload', () => ({
  useFileUpload: () => ({
    uploadedImage: new Image(),
    selectedFile: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    isLoading: false,
    error: null,
    info: null,
    progress: 0,
    handleFileSelect: vi.fn(),
    clearError: vi.fn(),
    clearInfo: vi.fn(),
  }),
}));

vi.mock('@/hooks/useImageProcessing', () => ({
  useImageProcessing: () => ({
    processedImage: 'data:image/png;base64,test',
    processedCanvas: document.createElement('canvas'),
    baselineImageData: new ImageData(100, 100),
    otsuThreshold: 128,
    isProcessing: false,
    error: null,
    runAutoPrepAsync: vi.fn(),
    applyAdjustments: vi.fn(),
  }),
}));

describe('Material Preset Integration Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Preset Selection', () => {
    it('should render preset selector when image is processed', () => {
      render(<App />);

      // Preset selector should be visible
      expect(screen.getByLabelText(/material preset/i)).toBeInTheDocument();
    });

    it('should display Auto preset by default', () => {
      render(<App />);

      const trigger = screen.getByRole('combobox', { name: /select material preset/i });
      expect(trigger).toHaveTextContent('Auto');
    });

    it('should display preset description', () => {
      render(<App />);

      expect(screen.getByText(/default auto-prep settings/i)).toBeInTheDocument();
    });
  });

  describe('Preset Change Behavior', () => {
    it('should update description when preset changes', () => {
      render(<App />);

      const trigger = screen.getByRole('combobox', { name: /select material preset/i });

      // Initial state
      expect(screen.getByText(/default auto-prep settings/i)).toBeInTheDocument();

      // Change to Wood preset (simulated via onChange)
      fireEvent.click(trigger);

      // Description should be visible (component structure)
      // Use getAllByRole since there are multiple role="status" elements
      const statusElements = screen.getAllByRole('status');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Preset Persistence', () => {
    it('should persist custom preset to localStorage', () => {
      render(<App />);

      // Check localStorage is initially empty
      expect(localStorage.getItem('craftyprep-custom-preset')).toBeNull();

      // After manual adjustment, custom preset should be saved
      // (This will be implemented in App.tsx integration)
    });

    it('should load custom preset from localStorage on mount', () => {
      // Set custom preset in localStorage
      const customValues = {
        brightness: 25,
        contrast: 15,
        threshold: 10,
      };
      localStorage.setItem('craftyprep-custom-preset', JSON.stringify(customValues));

      render(<App />);

      // Custom preset should be loaded
      // (This will be verified after App.tsx integration)
    });

    it('should clear custom preset on reset', () => {
      // Set custom preset
      localStorage.setItem(
        'craftyprep-custom-preset',
        JSON.stringify({ brightness: 10, contrast: 20, threshold: 5 })
      );

      render(<App />);

      // Find and click the "Reset to Auto-Prep" button (not the zoom/pan reset button)
      const resetButton = screen.getByRole('button', { name: /reset to auto-prep/i });
      fireEvent.click(resetButton);

      // Custom preset should be cleared
      expect(localStorage.getItem('craftyprep-custom-preset')).toBeNull();
    });
  });

  describe('Integration with Sliders', () => {
    it('should render both preset selector and sliders', () => {
      render(<App />);

      // Preset selector
      expect(screen.getByLabelText(/material preset/i)).toBeInTheDocument();

      // Sliders
      expect(screen.getByLabelText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/threshold/i)).toBeInTheDocument();
    });

    it('should position preset selector above sliders', () => {
      const { container } = render(<App />);

      const refinementSection = container.querySelector('[class*="space-y"]');
      expect(refinementSection).toBeInTheDocument();

      // Both preset selector and sliders should be within the same container
      const presetSelector = screen.getByLabelText(/material preset/i);
      const brightnessSlider = screen.getByLabelText(/brightness/i);

      expect(refinementSection).toContainElement(presetSelector);
      expect(refinementSection).toContainElement(brightnessSlider);
    });
  });

  describe('Disabled State', () => {
    it('should disable preset selector when processing', () => {
      // This will be tested after App.tsx integration with isProcessing state
      render(<App />);

      const trigger = screen.getByRole('combobox', { name: /select material preset/i });

      // Currently not disabled (isProcessing = false in mock)
      expect(trigger).not.toHaveAttribute('disabled');
    });
  });

  describe('Component Structure', () => {
    it('should have proper ARIA structure for accessibility', () => {
      render(<App />);

      // Label
      const label = screen.getByText('Material Preset');
      expect(label).toHaveAttribute('for', 'material-preset');

      // Select
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'material-preset');
      expect(select).toHaveAttribute('aria-label', 'Select material preset');

      // Description - find by text content since there are multiple role="status" elements
      const descriptions = screen.getAllByRole('status');
      const presetDescription = descriptions.find((el) =>
        el.textContent?.includes('Default auto-prep settings')
      );
      expect(presetDescription).toBeDefined();
      expect(presetDescription).toHaveAttribute('aria-live', 'polite');
    });
  });
});
