import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveViewMode, loadViewMode, type ViewMode } from '../view-mode-storage';

describe('view-mode-storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveViewMode', () => {
    it('stores correct data structure', () => {
      const mode: ViewMode = 'grid';
      saveViewMode(mode);

      const stored = localStorage.getItem('anime-browse-preferences');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveProperty('viewMode', 'grid');
      expect(parsed).toHaveProperty('lastUpdated');
      expect(parsed).toHaveProperty('version', 1);
      expect(typeof parsed.lastUpdated).toBe('string');
    });

    it('stores all view modes correctly', () => {
      const modes: ViewMode[] = ['large', 'grid', 'list'];

      modes.forEach((mode) => {
        saveViewMode(mode);
        const stored = localStorage.getItem('anime-browse-preferences');
        const parsed = JSON.parse(stored!);
        expect(parsed.viewMode).toBe(mode);
      });
    });

    it('updates timestamp on each save', () => {
      saveViewMode('large');
      const first = JSON.parse(localStorage.getItem('anime-browse-preferences')!);
      
      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        saveViewMode('grid');
        const second = JSON.parse(localStorage.getItem('anime-browse-preferences')!);
        expect(second.lastUpdated).not.toBe(first.lastUpdated);
      }, 10);
    });
  });

  describe('loadViewMode', () => {
    it('retrieves correct data', () => {
      saveViewMode('list');
      const loaded = loadViewMode();
      expect(loaded).toBe('list');
    });

    it('returns default "large" when no data exists', () => {
      const loaded = loadViewMode();
      expect(loaded).toBe('large');
    });

    it('handles corrupted data gracefully', () => {
      // Store invalid JSON
      localStorage.setItem('anime-browse-preferences', 'invalid-json{');
      const loaded = loadViewMode();
      expect(loaded).toBe('large');
    });

    it('returns default when version mismatch', () => {
      const invalidVersion = {
        viewMode: 'grid',
        lastUpdated: new Date().toISOString(),
        version: 999,
      };
      localStorage.setItem('anime-browse-preferences', JSON.stringify(invalidVersion));
      
      const loaded = loadViewMode();
      expect(loaded).toBe('large');
    });

    it('returns default when viewMode is invalid', () => {
      const invalidMode = {
        viewMode: 'invalid-mode',
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
      localStorage.setItem('anime-browse-preferences', JSON.stringify(invalidMode));
      
      const loaded = loadViewMode();
      expect(loaded).toBe('large');
    });

    it('returns default on localStorage error', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const loaded = loadViewMode();
      expect(loaded).toBe('large');

      // Restore original
      localStorage.getItem = originalGetItem;
    });
  });
});
