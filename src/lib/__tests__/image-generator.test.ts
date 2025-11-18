import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateResultCardImage, downloadImage, dataUrlToFile } from '../image-generator';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

describe('image-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateResultCardImage', () => {
    it('should throw error if element not found', async () => {
      await expect(generateResultCardImage('non-existent')).rejects.toThrow(
        'Element with ID "non-existent" not found'
      );
    });
  });

  describe('downloadImage', () => {
    it('should create download link with correct attributes', async () => {
      const mockClick = vi.fn();
      const mockLink = {
        download: '',
        href: '',
        click: mockClick,
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

      await downloadImage('data:image/png;base64,test', 'test.png');

      expect(mockLink.download).toBe('test.png');
      expect(mockLink.href).toBe('data:image/png;base64,test');
      expect(mockClick).toHaveBeenCalled();
    });
  });
});
