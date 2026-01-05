import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../hooks/useTheme';

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('class');
  });

  describe('Initialization', () => {
    it('should initialize with system theme by default', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(['light', 'dark']).toContain(result.current.theme);
    });

    it('should load saved theme from localStorage', () => {
      localStorage.setItem('theme-preference', 'dark');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('dark');
    });

    it('should apply theme class to document element', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Theme Switching', () => {
    it('should switch to light theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should switch to dark theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle between light and dark', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
    });

    it('should persist theme changes to localStorage', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });
  });

  describe('System Theme', () => {
    it('should respect system theme preference', () => {
      // Mock system preference for dark mode
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('system');
      });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('should update when system theme changes', () => {
      const listeners: ((e: any) => void)[] = [];
      
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: (event: string, listener: (e: any) => void) => {
          if (event === 'change') {
            listeners.push(listener);
          }
        },
        removeEventListener: vi.fn(),
      }));
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('system');
      });
      
      // Simulate system theme change
      act(() => {
        listeners.forEach(listener => listener({ matches: true }));
      });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('Custom Design System Themes', () => {
    it('should apply custom theme', () => {
      const { result } = renderHook(() => useTheme());
      
      const customTheme = {
        id: 'custom-1',
        name: 'Ocean',
        colors: {
          primary: '#0066cc',
          background: '#f0f8ff',
        },
      };
      
      act(() => {
        result.current.applyCustomTheme(customTheme);
      });
      
      expect(result.current.currentCustomTheme?.name).toBe('Ocean');
    });

    it('should inject custom theme CSS variables', () => {
      const { result } = renderHook(() => useTheme());
      
      const customTheme = {
        id: 'custom-1',
        name: 'Ocean',
        colors: {
          primary: '#0066cc',
        },
        spacing: {
          sm: '8px',
        },
      };
      
      act(() => {
        result.current.applyCustomTheme(customTheme);
      });
      
      const style = document.documentElement.style;
      expect(style.getPropertyValue('--colors-primary')).toBe('#0066cc');
      expect(style.getPropertyValue('--spacing-sm')).toBe('8px');
    });

    it('should clear custom theme', () => {
      const { result } = renderHook(() => useTheme());
      
      const customTheme = {
        id: 'custom-1',
        name: 'Ocean',
        colors: { primary: '#0066cc' },
      };
      
      act(() => {
        result.current.applyCustomTheme(customTheme);
      });
      
      expect(result.current.currentCustomTheme).not.toBeNull();
      
      act(() => {
        result.current.clearCustomTheme();
      });
      
      expect(result.current.currentCustomTheme).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid theme values', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('invalid' as any);
      });
      
      // Should fallback to a valid theme
      expect(['light', 'dark', 'system']).toContain(result.current.theme);
    });

    it('should cleanup listeners on unmount', () => {
      const removeListener = vi.fn();
      
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: removeListener,
      }));
      
      const { unmount } = renderHook(() => useTheme());
      
      unmount();
      
      expect(removeListener).toHaveBeenCalled();
    });

    it('should handle rapid theme changes', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
        result.current.setTheme('dark');
        result.current.setTheme('light');
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
    });

    it('should preserve custom theme when toggling system theme', () => {
      const { result } = renderHook(() => useTheme());
      
      const customTheme = {
        id: 'custom-1',
        name: 'Ocean',
        colors: { primary: '#0066cc' },
      };
      
      act(() => {
        result.current.applyCustomTheme(customTheme);
        result.current.setTheme('dark');
      });
      
      expect(result.current.currentCustomTheme?.name).toBe('Ocean');
      expect(document.documentElement.style.getPropertyValue('--colors-primary')).toBe('#0066cc');
    });
  });

  describe('Theme Detection', () => {
    it('should detect if current theme is dark', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.isDark).toBe(true);
    });

    it('should detect if current theme is light', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.isDark).toBe(false);
    });

    it('should provide resolved theme for system preference', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('system');
      });
      
      expect(result.current.resolvedTheme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });
  });
});
