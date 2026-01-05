import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDesignSystems } from '../../hooks/useDesignSystems';

describe('useDesignSystems Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      expect(result.current.designSystems).toEqual([]);
      expect(result.current.currentSystem).toBeNull();
      expect(result.current.currentTheme).toBeNull();
    });

    it('should load saved design systems from localStorage', () => {
      const savedSystems = [
        {
          id: 'test-1',
          name: 'Test System',
          themes: [
            {
              id: 'theme-1',
              name: 'Light',
              colors: { primary: '#0066cc' },
              spacing: { sm: '8px' },
            },
          ],
        },
      ];
      
      localStorage.setItem('designSystems', JSON.stringify(savedSystems));
      
      const { result } = renderHook(() => useDesignSystems());
      
      expect(result.current.designSystems).toHaveLength(1);
      expect(result.current.designSystems[0].name).toBe('Test System');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('designSystems', 'invalid-json');
      
      const { result } = renderHook(() => useDesignSystems());
      
      expect(result.current.designSystems).toEqual([]);
    });
  });

  describe('Creating Design Systems', () => {
    it('should create a new design system', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      act(() => {
        result.current.createDesignSystem({
          name: 'New System',
          description: 'A test system',
          themes: [],
        });
      });
      
      expect(result.current.designSystems).toHaveLength(1);
      expect(result.current.designSystems[0].name).toBe('New System');
      expect(result.current.designSystems[0].id).toBeDefined();
    });

    it('should save new design system to localStorage', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      act(() => {
        result.current.createDesignSystem({
          name: 'New System',
          themes: [],
        });
      });
      
      const saved = JSON.parse(localStorage.getItem('designSystems') || '[]');
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe('New System');
    });

    it('should generate unique IDs for design systems', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      act(() => {
        result.current.createDesignSystem({ name: 'System 1', themes: [] });
        result.current.createDesignSystem({ name: 'System 2', themes: [] });
      });
      
      const ids = result.current.designSystems.map(s => s.id);
      expect(new Set(ids).size).toBe(2);
    });
  });

  describe('Updating Design Systems', () => {
    it('should update an existing design system', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Original Name',
          themes: [],
        });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.updateDesignSystem(systemId, {
          name: 'Updated Name',
          description: 'New description',
        });
      });
      
      expect(result.current.designSystems[0].name).toBe('Updated Name');
      expect(result.current.designSystems[0].description).toBe('New description');
    });

    it('should persist updates to localStorage', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({ name: 'Test', themes: [] });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.updateDesignSystem(systemId, { name: 'Updated' });
      });
      
      const saved = JSON.parse(localStorage.getItem('designSystems') || '[]');
      expect(saved[0].name).toBe('Updated');
    });
  });

  describe('Deleting Design Systems', () => {
    it('should delete a design system', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({ name: 'To Delete', themes: [] });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.deleteDesignSystem(systemId);
      });
      
      expect(result.current.designSystems).toHaveLength(0);
    });

    it('should remove from localStorage when deleted', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({ name: 'To Delete', themes: [] });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.deleteDesignSystem(systemId);
      });
      
      const saved = JSON.parse(localStorage.getItem('designSystems') || '[]');
      expect(saved).toHaveLength(0);
    });
  });

  describe('Theme Management', () => {
    it('should set current system and theme', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      let themeId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Test System',
          themes: [
            {
              id: 'theme-1',
              name: 'Light',
              colors: { primary: '#0066cc' },
            },
          ],
        });
        systemId = result.current.designSystems[0].id;
        themeId = result.current.designSystems[0].themes[0].id;
      });
      
      act(() => {
        result.current.setCurrentSystem(systemId);
        result.current.setCurrentTheme(themeId);
      });
      
      expect(result.current.currentSystem?.id).toBe(systemId);
      expect(result.current.currentTheme?.id).toBe(themeId);
    });

    it('should add a theme to a design system', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Test System',
          themes: [],
        });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.addTheme(systemId, {
          name: 'Dark Theme',
          colors: { primary: '#333' },
        });
      });
      
      expect(result.current.designSystems[0].themes).toHaveLength(1);
      expect(result.current.designSystems[0].themes[0].name).toBe('Dark Theme');
    });

    it('should update a theme', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      let themeId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Test System',
          themes: [
            {
              id: 'theme-1',
              name: 'Light',
              colors: { primary: '#fff' },
            },
          ],
        });
        systemId = result.current.designSystems[0].id;
        themeId = result.current.designSystems[0].themes[0].id;
      });
      
      act(() => {
        result.current.updateTheme(systemId, themeId, {
          colors: { primary: '#0066cc' },
        });
      });
      
      expect(result.current.designSystems[0].themes[0].colors.primary).toBe('#0066cc');
    });

    it('should delete a theme', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      let themeId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Test System',
          themes: [
            { id: 'theme-1', name: 'Light', colors: {} },
            { id: 'theme-2', name: 'Dark', colors: {} },
          ],
        });
        systemId = result.current.designSystems[0].id;
        themeId = result.current.designSystems[0].themes[0].id;
      });
      
      act(() => {
        result.current.deleteTheme(systemId, themeId);
      });
      
      expect(result.current.designSystems[0].themes).toHaveLength(1);
      expect(result.current.designSystems[0].themes[0].id).toBe('theme-2');
    });
  });

  describe('Import/Export', () => {
    it('should export design system as JSON', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Export Test',
          themes: [
            {
              id: 'theme-1',
              name: 'Light',
              colors: { primary: '#0066cc' },
            },
          ],
        });
        systemId = result.current.designSystems[0].id;
      });
      
      const exported = result.current.exportDesignSystem(systemId);
      const parsed = JSON.parse(exported);
      
      expect(parsed.name).toBe('Export Test');
      expect(parsed.themes).toHaveLength(1);
      expect(parsed.themes[0].colors.primary).toBe('#0066cc');
    });

    it('should import design system from JSON', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      const importData = JSON.stringify({
        name: 'Imported System',
        themes: [
          {
            id: 'theme-1',
            name: 'Theme',
            colors: { primary: '#ff0000' },
          },
        ],
      });
      
      act(() => {
        result.current.importDesignSystem(importData);
      });
      
      expect(result.current.designSystems).toHaveLength(1);
      expect(result.current.designSystems[0].name).toBe('Imported System');
    });

    it('should handle invalid import data', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      expect(() => {
        act(() => {
          result.current.importDesignSystem('invalid-json');
        });
      }).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle operations on non-existent design systems', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      act(() => {
        result.current.updateDesignSystem('non-existent-id', { name: 'Test' });
      });
      
      expect(result.current.designSystems).toHaveLength(0);
    });

    it('should handle concurrent updates', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      act(() => {
        result.current.createDesignSystem({ name: 'System 1', themes: [] });
        result.current.createDesignSystem({ name: 'System 2', themes: [] });
        result.current.createDesignSystem({ name: 'System 3', themes: [] });
      });
      
      expect(result.current.designSystems).toHaveLength(3);
    });

    it('should preserve theme order', () => {
      const { result } = renderHook(() => useDesignSystems());
      
      let systemId: string;
      
      act(() => {
        result.current.createDesignSystem({
          name: 'Test',
          themes: [],
        });
        systemId = result.current.designSystems[0].id;
      });
      
      act(() => {
        result.current.addTheme(systemId, { name: 'First', colors: {} });
        result.current.addTheme(systemId, { name: 'Second', colors: {} });
        result.current.addTheme(systemId, { name: 'Third', colors: {} });
      });
      
      const themes = result.current.designSystems[0].themes;
      expect(themes[0].name).toBe('First');
      expect(themes[1].name).toBe('Second');
      expect(themes[2].name).toBe('Third');
    });
  });
});
