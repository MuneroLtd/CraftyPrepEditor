/**
 * Image Processing Library
 *
 * Pure functions for image manipulation using Canvas API.
 * All functions follow the pattern: ImageData → ImageData (no mutation).
 */

export { convertToGrayscale } from './grayscale';
export { applyHistogramEqualization } from './histogramEqualization';
export { calculateOptimalThreshold, applyOtsuThreshold } from './otsuThreshold';
