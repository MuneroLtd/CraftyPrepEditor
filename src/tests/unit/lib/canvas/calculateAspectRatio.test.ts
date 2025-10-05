import { describe, it, expect } from 'vitest';
import { calculateAspectRatio } from '@/lib/canvas/calculateAspectRatio';

describe('calculateAspectRatio', () => {
  it('calculates dimensions for landscape image', () => {
    const result = calculateAspectRatio(
      { width: 1600, height: 800 }, // Image: 2:1
      { width: 800, height: 600 } // Canvas
    );
    expect(result).toEqual({
      width: 800,
      height: 400,
      x: 0,
      y: 100, // Centered vertically
    });
  });

  it('calculates dimensions for portrait image', () => {
    const result = calculateAspectRatio(
      { width: 800, height: 1600 }, // Image: 1:2
      { width: 800, height: 600 } // Canvas
    );
    expect(result).toEqual({
      width: 300, // Scaled to fit height
      height: 600,
      x: 250, // Centered horizontally
      y: 0,
    });
  });

  it('handles exact fit (no scaling needed)', () => {
    const result = calculateAspectRatio({ width: 800, height: 600 }, { width: 800, height: 600 });
    expect(result).toEqual({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    });
  });

  it('handles square image on rectangular canvas', () => {
    const result = calculateAspectRatio(
      { width: 1000, height: 1000 }, // Square 1:1
      { width: 800, height: 600 } // Canvas
    );
    expect(result).toEqual({
      width: 600, // Fit to height (smaller dimension)
      height: 600,
      x: 100, // Centered horizontally
      y: 0,
    });
  });

  it('handles extreme landscape ratio (10:1)', () => {
    const result = calculateAspectRatio(
      { width: 5000, height: 500 }, // Very wide
      { width: 800, height: 600 }
    );
    expect(result).toEqual({
      width: 800,
      height: 80,
      x: 0,
      y: 260, // Centered vertically
    });
  });

  it('handles extreme portrait ratio (1:10)', () => {
    const result = calculateAspectRatio(
      { width: 500, height: 5000 }, // Very tall
      { width: 800, height: 600 }
    );
    expect(result).toEqual({
      width: 60,
      height: 600,
      x: 370, // Centered horizontally
      y: 0,
    });
  });
});
