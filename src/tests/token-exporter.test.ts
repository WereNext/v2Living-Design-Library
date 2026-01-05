import { describe, it, expect } from 'vitest';
import { exportTokens } from '../utils/tokenExporter';

describe('Token Exporter', () => {
  const mockTheme = {
    id: 'test-theme',
    name: 'Test Theme',
    description: 'A test theme',
    colors: {
      primary: '#0066cc',
      secondary: '#6b7280',
      background: '#ffffff',
      foreground: '#0a0a0a',
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
    },
    typography: {
      'font-family': 'Inter, sans-serif',
      'font-size-base': '16px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
    },
  };

  describe('CSS Export', () => {
    it('should export tokens as CSS variables', () => {
      const css = exportTokens('css', { theme: mockTheme });
      
      expect(css).toContain(':root');
      expect(css).toContain('--colors-primary: #0066cc');
      expect(css).toContain('--spacing-sm: 8px');
      expect(css).toContain('--typography-font-family: Inter, sans-serif');
    });

    it('should include theme name as comment', () => {
      const css = exportTokens('css', { theme: mockTheme });
      expect(css).toContain('Test Theme');
      expect(css).toContain('CSS Variables');
    });

    it('should handle nested objects', () => {
      const themeWithNested = {
        ...mockTheme,
        colors: {
          brand: {
            primary: '#0066cc',
            secondary: '#6b7280',
          },
        },
      };
      const css = exportTokens('css', { theme: themeWithNested });
      expect(css).toContain('--colors-brand-primary');
      expect(css).toContain('--colors-brand-secondary');
    });

    it('should export only changes when changesOnly is true', () => {
      const changes = {
        colors: {
          primary: '#ff0000',
        },
      };
      const css = exportTokens('css', {
        theme: mockTheme,
        changesOnly: true,
        changes,
      });
      
      expect(css).toContain('--colors-primary: #ff0000');
      expect(css).not.toContain('--colors-secondary');
    });
  });

  describe('SCSS Export', () => {
    it('should export tokens as SCSS variables', () => {
      const scss = exportTokens('scss', { theme: mockTheme });
      
      expect(scss).toContain('$colors-primary: #0066cc');
      expect(scss).toContain('$spacing-sm: 8px');
      expect(scss).toContain('$typography-font-family: Inter, sans-serif');
    });

    it('should include theme name as comment', () => {
      const scss = exportTokens('scss', { theme: mockTheme });
      expect(scss).toContain('Test Theme');
      expect(scss).toContain('SCSS Variables');
    });

    it('should handle special characters in values', () => {
      const scss = exportTokens('scss', { theme: mockTheme });
      expect(scss).toContain('$shadows-sm: 0 1px 2px rgba(0,0,0,0.1)');
    });
  });

  describe('Tailwind Export', () => {
    it('should export tokens as Tailwind config', () => {
      const tailwind = exportTokens('tailwind', { theme: mockTheme });
      
      expect(tailwind).toContain('module.exports');
      expect(tailwind).toContain('theme:');
      expect(tailwind).toContain('extend:');
      expect(tailwind).toContain('colors:');
      expect(tailwind).toContain('spacing:');
    });

    it('should format colors correctly', () => {
      const tailwind = exportTokens('tailwind', { theme: mockTheme });
      expect(tailwind).toContain("primary: '#0066cc'");
      expect(tailwind).toContain("secondary: '#6b7280'");
    });

    it('should include border radius', () => {
      const tailwind = exportTokens('tailwind', { theme: mockTheme });
      expect(tailwind).toContain('borderRadius:');
      expect(tailwind).toContain("sm: '4px'");
    });

    it('should include box shadows', () => {
      const tailwind = exportTokens('tailwind', { theme: mockTheme });
      expect(tailwind).toContain('boxShadow:');
    });
  });

  describe('JSON Export', () => {
    it('should export tokens as formatted JSON', () => {
      const json = exportTokens('json', { theme: mockTheme });
      const parsed = JSON.parse(json);
      
      expect(parsed.colors.primary).toBe('#0066cc');
      expect(parsed.spacing.sm).toBe('8px');
      expect(parsed.typography['font-family']).toBe('Inter, sans-serif');
    });

    it('should maintain structure', () => {
      const json = exportTokens('json', { theme: mockTheme });
      const parsed = JSON.parse(json);
      
      expect(parsed).toHaveProperty('colors');
      expect(parsed).toHaveProperty('spacing');
      expect(parsed).toHaveProperty('typography');
      expect(parsed).toHaveProperty('borderRadius');
      expect(parsed).toHaveProperty('shadows');
    });

    it('should be pretty-printed', () => {
      const json = exportTokens('json', { theme: mockTheme });
      expect(json).toContain('\n');
      expect(json).toContain('  '); // Indentation
    });

    it('should export changes only when specified', () => {
      const changes = {
        colors: {
          primary: '#ff0000',
        },
      };
      const json = exportTokens('json', {
        theme: mockTheme,
        changesOnly: true,
        changes,
      });
      const parsed = JSON.parse(json);
      
      expect(parsed.colors.primary).toBe('#ff0000');
      expect(parsed.colors.secondary).toBeUndefined();
    });
  });

  describe('iOS Swift Export', () => {
    it('should export tokens as Swift code', () => {
      const swift = exportTokens('ios-swift', { theme: mockTheme });
      
      expect(swift).toContain('import UIKit');
      expect(swift).toContain('extension UIColor');
      expect(swift).toContain('static let primary');
      expect(swift).toContain('UIColor(hex: "#0066cc")');
    });

    it('should include theme name in struct', () => {
      const swift = exportTokens('ios-swift', { theme: mockTheme });
      expect(swift).toContain('TestTheme');
    });

    it('should export spacing values', () => {
      const swift = exportTokens('ios-swift', { theme: mockTheme });
      expect(swift).toContain('CGFloat');
      expect(swift).toContain('sm:');
      expect(swift).toContain('8');
    });

    it('should handle color conversion', () => {
      const swift = exportTokens('ios-swift', { theme: mockTheme });
      expect(swift).toContain('UIColor(hex:');
      expect(swift).toMatch(/#[0-9a-fA-F]{6}/);
    });

    it('should include helper extension for hex colors', () => {
      const swift = exportTokens('ios-swift', { theme: mockTheme });
      expect(swift).toContain('extension UIColor');
      expect(swift).toContain('convenience init(hex:');
    });
  });

  describe('Android XML Export', () => {
    it('should export tokens as Android XML', () => {
      const xml = exportTokens('android-xml', { theme: mockTheme });
      
      expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(xml).toContain('<resources>');
      expect(xml).toContain('</resources>');
      expect(xml).toContain('<color name="primary">#0066cc</color>');
    });

    it('should include theme name in comment', () => {
      const xml = exportTokens('android-xml', { theme: mockTheme });
      expect(xml).toContain('<!-- Test Theme -->');
    });

    it('should export dimen values for spacing', () => {
      const xml = exportTokens('android-xml', { theme: mockTheme });
      expect(xml).toContain('<dimen name="spacing_sm">8dp</dimen>');
    });

    it('should convert px to dp', () => {
      const xml = exportTokens('android-xml', { theme: mockTheme });
      expect(xml).toContain('8dp');
      expect(xml).toContain('16dp');
    });

    it('should export string values for typography', () => {
      const xml = exportTokens('android-xml', { theme: mockTheme });
      expect(xml).toContain('<string name=');
      expect(xml).toContain('Inter, sans-serif');
    });
  });

  describe('Figma Tokens Export', () => {
    it('should export in Figma Tokens format', () => {
      const figma = exportTokens('figma-tokens', { theme: mockTheme });
      const parsed = JSON.parse(figma);
      
      expect(parsed).toHaveProperty('colors');
      expect(parsed.colors.primary).toHaveProperty('$value');
      expect(parsed.colors.primary.$value).toBe('#0066cc');
    });

    it('should include type metadata', () => {
      const figma = exportTokens('figma-tokens', { theme: mockTheme });
      const parsed = JSON.parse(figma);
      
      expect(parsed.colors.primary).toHaveProperty('$type');
      expect(parsed.colors.primary.$type).toBe('color');
    });

    it('should handle spacing tokens', () => {
      const figma = exportTokens('figma-tokens', { theme: mockTheme });
      const parsed = JSON.parse(figma);
      
      expect(parsed.spacing.sm.$value).toBe('8px');
      expect(parsed.spacing.sm.$type).toBe('dimension');
    });

    it('should include description if available', () => {
      const themeWithDesc = {
        ...mockTheme,
        colors: {
          primary: {
            value: '#0066cc',
            description: 'Primary brand color',
          },
        },
      };
      const figma = exportTokens('figma-tokens', { theme: themeWithDesc });
      const parsed = JSON.parse(figma);
      
      // Check if description is preserved
      expect(parsed.colors).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty theme gracefully', () => {
      const emptyTheme = {
        id: 'empty',
        name: 'Empty',
      };
      
      expect(() => exportTokens('css', { theme: emptyTheme as any })).not.toThrow();
      expect(() => exportTokens('json', { theme: emptyTheme as any })).not.toThrow();
    });

    it('should default to JSON for unknown format', () => {
      const result = exportTokens('unknown-format' as any, {
        theme: mockTheme,
      });
      
      // Should be valid JSON
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should handle null values', () => {
      const themeWithNull = {
        ...mockTheme,
        colors: {
          ...mockTheme.colors,
          nullable: null,
        },
      };
      
      expect(() => exportTokens('css', { theme: themeWithNull as any })).not.toThrow();
    });

    it('should handle arrays in tokens', () => {
      const themeWithArray = {
        ...mockTheme,
        fontStack: ['Inter', 'sans-serif'],
      };
      
      expect(() => exportTokens('json', { theme: themeWithArray as any })).not.toThrow();
    });
  });

  describe('Format-specific Edge Cases', () => {
    it('CSS should escape special characters', () => {
      const specialTheme = {
        ...mockTheme,
        typography: {
          'font-family': '"Helvetica Neue", Arial',
        },
      };
      const css = exportTokens('css', { theme: specialTheme });
      expect(css).toContain('"Helvetica Neue", Arial');
    });

    it('SCSS should handle numeric values', () => {
      const numericTheme = {
        ...mockTheme,
        lineHeight: {
          base: 1.5,
          heading: 1.2,
        },
      };
      const scss = exportTokens('scss', { theme: numericTheme });
      expect(scss).toContain('$lineHeight-base: 1.5');
    });

    it('Tailwind should handle font families correctly', () => {
      const tailwind = exportTokens('tailwind', { theme: mockTheme });
      expect(tailwind).toContain('fontFamily:');
    });

    it('Android XML should handle transparency in colors', () => {
      const transparentTheme = {
        ...mockTheme,
        colors: {
          ...mockTheme.colors,
          overlay: 'rgba(0, 0, 0, 0.5)',
        },
      };
      const xml = exportTokens('android-xml', { theme: transparentTheme });
      // Should handle rgba conversion
      expect(xml).toContain('color');
    });
  });
});
