import { describe, it, expect } from 'vitest';
import { sanitizeFilename } from '@/lib/utils/sanitizeFilename';

describe('sanitizeFilename', () => {
  describe('special character replacement', () => {
    it('replaces forward slashes with underscores', () => {
      expect(sanitizeFilename('photo/name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('folder/subfolder/file.jpg')).toBe('folder_subfolder_file.jpg');
    });

    it('replaces backslashes with underscores', () => {
      expect(sanitizeFilename('photo\\name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('C:\\Users\\photo.jpg')).toBe('C__Users_photo.jpg');
    });

    it('replaces question marks with underscores', () => {
      expect(sanitizeFilename('photo?.png')).toBe('photo_.png');
      expect(sanitizeFilename('is-this-valid?.jpg')).toBe('is-this-valid_.jpg');
    });

    it('replaces percent signs with underscores', () => {
      expect(sanitizeFilename('photo%20.png')).toBe('photo_20.png');
      expect(sanitizeFilename('50%discount.jpg')).toBe('50_discount.jpg');
    });

    it('replaces asterisks with underscores', () => {
      expect(sanitizeFilename('photo*.png')).toBe('photo_.png');
      expect(sanitizeFilename('*important*.jpg')).toBe('_important_.jpg');
    });

    it('replaces colons with underscores', () => {
      expect(sanitizeFilename('photo:name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('12:30:45.jpg')).toBe('12_30_45.jpg');
    });

    it('replaces pipes with underscores', () => {
      expect(sanitizeFilename('photo|name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('option1|option2.jpg')).toBe('option1_option2.jpg');
    });

    it('replaces double quotes with underscores', () => {
      expect(sanitizeFilename('photo"name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('"quoted".jpg')).toBe('_quoted_.jpg');
    });

    it('replaces less-than signs with underscores', () => {
      expect(sanitizeFilename('photo<name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('<tag>.jpg')).toBe('_tag_.jpg');
    });

    it('replaces greater-than signs with underscores', () => {
      expect(sanitizeFilename('photo>name.png')).toBe('photo_name.png');
      expect(sanitizeFilename('a>b>c.jpg')).toBe('a_b_c.jpg');
    });
  });

  describe('multiple special characters', () => {
    it('handles multiple different special characters', () => {
      expect(sanitizeFilename('photo/\\?*.png')).toBe('photo____.png');
      expect(sanitizeFilename('a:b|c<d>e.jpg')).toBe('a_b_c_d_e.jpg');
    });

    it('handles all special characters at once', () => {
      expect(sanitizeFilename('test/\\?%*:|"<>.png')).toBe('test__________.png');
    });
  });

  describe('normal characters preservation', () => {
    it('preserves letters, numbers, hyphens, underscores, and periods', () => {
      expect(sanitizeFilename('photo-name_2024.png')).toBe('photo-name_2024.png');
      expect(sanitizeFilename('MyPhoto123.jpg')).toBe('MyPhoto123.jpg');
      expect(sanitizeFilename('test_file-v2.0.png')).toBe('test_file-v2.0.png');
    });

    it('preserves filenames with multiple dots', () => {
      expect(sanitizeFilename('my.photo.backup.2024.jpg')).toBe('my.photo.backup.2024.jpg');
    });

    it('preserves mixed case', () => {
      expect(sanitizeFilename('MyPhotoName.PNG')).toBe('MyPhotoName.PNG');
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(sanitizeFilename('')).toBe('');
    });

    it('handles extension-only filename', () => {
      expect(sanitizeFilename('.png')).toBe('.png');
      expect(sanitizeFilename('.hidden-file')).toBe('.hidden-file');
    });

    it('handles filename without extension', () => {
      expect(sanitizeFilename('photo')).toBe('photo');
      expect(sanitizeFilename('my-photo')).toBe('my-photo');
    });

    it('handles filename with only special characters', () => {
      expect(sanitizeFilename('???')).toBe('___');
      expect(sanitizeFilename('***')).toBe('___');
    });
  });
});
