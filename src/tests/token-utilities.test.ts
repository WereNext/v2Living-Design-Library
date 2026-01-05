import { describe, it, expect } from 'vitest';
import {
  parseTokens,
  parseFigmaVariables,
  parseMultiThemeSystem,
  normalizeTokenSet,
  exportToCSS,
  exportToJSON,
  TokenSet,
  FigmaExport,
} from '../lib/token-utilities';

describe('Token Utilities', () => {
  describe('parseTokens', () => {
    it('should parse standard format with tokens property', () => {
      const input = {
        tokens: {
          colors: { primary: '#0066cc' },
          spacing: { sm: '8px' },
        },
      };
      const result = parseTokens(input);
      
      expect(result.colors.primary).toBe('#0066cc');
      expect(result.spacing.sm).toBe('8px');
    });

    it('should parse flat category format', () => {
      const input = {
        colors: { primary: '#0066cc', secondary: '#6b7280' },
        spacing: { sm: '8px', md: '16px' },
        typography: { 'font-family': 'Inter' },
      };
      const result = parseTokens(input);
      
      expect(result.colors.primary).toBe('#0066cc');
      expect(result.spacing.sm).toBe('8px');
      expect(result.typography['font-family']).toBe('Inter');
    });

    it('should parse W3C Design Tokens format', () => {
      const input = {
        color: {
          primary: {
            $value: '#0066cc',
            $type: 'color',
          },
        },
      };
      const result = parseTokens(input);
      
      expect(result.colors['color-primary']).toBe('#0066cc');
    });

    it('should parse Style Dictionary format', () => {
      const input = {
        color: {
          brand: {
            primary: {
              value: '#0066cc',
              type: 'color',
            },
          },
        },
      };
      const result = parseTokens(input);
      
      expect(result.colors['color-brand-primary']).toBe('#0066cc');
    });

    it('should parse Tokens Studio format', () => {
      const input = {
        colors: {
          primary: { value: '#0066cc' },
          secondary: { value: '#6b7280' },
        },
      };
      const result = parseTokens(input);
      
      expect(result.colors['colors-primary']).toBe('#0066cc');
    });

    it('should parse Figma Variables format', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'colors/primary',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 0, g: 0.4, b: 0.8, a: 1 } },
          },
        ],
      };
      const result = parseTokens(input);
      
      expect(result.colors['colors-primary']).toBeDefined();
      expect(result.colors['colors-primary']).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should handle deeply nested structures', () => {
      const input = {
        design: {
          tokens: {
            colors: {
              brand: {
                primary: {
                  light: { $value: '#3388ff' },
                  dark: { $value: '#0066cc' },
                },
              },
            },
          },
        },
      };
      const result = parseTokens(input);
      
      expect(Object.keys(result.colors).length).toBeGreaterThan(0);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseTokens(null)).toThrow();
      expect(() => parseTokens(undefined)).toThrow();
      expect(() => parseTokens({})).toThrow();
      expect(() => parseTokens({ invalid: 'data' })).toThrow();
    });

    it('should handle mixed token types', () => {
      const input = {
        color: { primary: { $value: '#0066cc' } },
        spacing: { base: { $value: '8px' } },
        shadow: { card: { $value: '0 2px 4px rgba(0,0,0,0.1)' } },
      };
      const result = parseTokens(input);
      
      expect(result.colors['color-primary']).toBe('#0066cc');
      expect(result.spacing['spacing-base']).toBe('8px');
      expect(result.shadows['shadow-card']).toBe('0 2px 4px rgba(0,0,0,0.1)');
    });
  });

  describe('parseFigmaVariables', () => {
    it('should parse Figma color variables', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'Primary Color',
            resolvedType: 'COLOR',
            valuesByMode: {
              default: { r: 1, g: 0, b: 0, a: 1 },
            },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      expect(result.colors['Primary-Color']).toBe('#ff0000');
    });

    it('should parse Figma float variables as spacing', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'spacing/small',
            resolvedType: 'FLOAT',
            valuesByMode: { default: 8 },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      expect(result.spacing['spacing-small']).toBe('8px');
    });

    it('should parse Figma string variables', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'typography/font-family',
            resolvedType: 'STRING',
            valuesByMode: { default: 'Inter, sans-serif' },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      expect(result.typography['typography-font-family']).toBe('Inter, sans-serif');
    });

    it('should handle multiple modes in Figma variables', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'colors/primary',
            resolvedType: 'COLOR',
            valuesByMode: {
              light: { r: 0, g: 0.4, b: 0.8, a: 1 },
              dark: { r: 0.2, g: 0.6, b: 1, a: 1 },
            },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      // Should use first mode
      expect(result.colors['colors-primary']).toBeDefined();
    });

    it('should convert Figma color values to hex', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'test',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 1, g: 1, b: 1, a: 1 } },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      expect(result.colors.test).toBe('#ffffff');
    });

    it('should handle color with transparency', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'overlay',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 0, g: 0, b: 0, a: 0.5 } },
          },
        ],
      };
      const result = parseFigmaVariables(input);
      
      expect(result.colors.overlay).toContain('rgba');
    });
  });

  describe('parseMultiThemeSystem', () => {
    it('should parse multi-theme Figma export', () => {
      const input: FigmaExport = {
        name: 'Design System',
        variables: [
          {
            id: '1',
            name: 'Light/colors/primary',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 0, g: 0.4, b: 0.8, a: 1 } },
          },
          {
            id: '2',
            name: 'Dark/colors/primary',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 0.2, g: 0.6, b: 1, a: 1 } },
          },
        ],
      };
      const result = parseMultiThemeSystem(input);
      
      expect(result.name).toBe('Design System');
      expect(result.themes).toHaveLength(2);
      expect(result.themes.find(t => t.name === 'Light')).toBeDefined();
      expect(result.themes.find(t => t.name === 'Dark')).toBeDefined();
    });

    it('should group tokens by theme prefix', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'ThemeA/spacing/sm',
            resolvedType: 'FLOAT',
            valuesByMode: { default: 8 },
          },
          {
            id: '2',
            name: 'ThemeB/spacing/sm',
            resolvedType: 'FLOAT',
            valuesByMode: { default: 12 },
          },
        ],
      };
      const result = parseMultiThemeSystem(input);
      
      const themeA = result.themes.find(t => t.name === 'ThemeA');
      const themeB = result.themes.find(t => t.name === 'ThemeB');
      
      expect(themeA?.tokens.spacing['spacing-sm']).toBe('8px');
      expect(themeB?.tokens.spacing['spacing-sm']).toBe('12px');
    });

    it('should handle single theme with no prefix', () => {
      const input: FigmaExport = {
        variables: [
          {
            id: '1',
            name: 'colors/primary',
            resolvedType: 'COLOR',
            valuesByMode: { default: { r: 0, g: 0.4, b: 0.8, a: 1 } },
          },
        ],
      };
      const result = parseMultiThemeSystem(input);
      
      expect(result.themes).toHaveLength(1);
      expect(result.themes[0].name).toBe('Default');
    });
  });

  describe('normalizeTokenSet', () => {
    it('should ensure all required categories exist', () => {
      const input = {
        colors: { primary: '#0066cc' },
      };
      const result = normalizeTokenSet(input);
      
      expect(result).toHaveProperty('colors');
      expect(result).toHaveProperty('spacing');
      expect(result).toHaveProperty('typography');
      expect(result).toHaveProperty('borderRadius');
      expect(result).toHaveProperty('shadows');
    });

    it('should preserve existing categories', () => {
      const input = {
        colors: { primary: '#0066cc' },
        spacing: { sm: '8px' },
        customCategory: { value: 'test' },
      };
      const result = normalizeTokenSet(input);
      
      expect(result.colors.primary).toBe('#0066cc');
      expect(result.spacing.sm).toBe('8px');
      expect(result.customCategory).toEqual({ value: 'test' });
    });

    it('should handle empty input', () => {
      const result = normalizeTokenSet({});
      
      expect(result.colors).toEqual({});
      expect(result.spacing).toEqual({});
      expect(result.typography).toEqual({});
    });

    it('should handle null values', () => {
      const input = {
        colors: { primary: '#0066cc', disabled: null },
      };
      const result = normalizeTokenSet(input);
      
      expect(result.colors.primary).toBe('#0066cc');
    });
  });

  describe('exportToCSS', () => {
    it('should export tokens as CSS variables', () => {
      const tokens: TokenSet = {
        colors: { primary: '#0066cc' },
        spacing: { sm: '8px' },
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const css = exportToCSS(tokens);
      
      expect(css).toContain(':root');
      expect(css).toContain('--colors-primary: #0066cc');
      expect(css).toContain('--spacing-sm: 8px');
    });

    it('should handle nested objects', () => {
      const tokens: any = {
        colors: {
          brand: {
            primary: '#0066cc',
            secondary: '#6b7280',
          },
        },
        spacing: {},
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const css = exportToCSS(tokens);
      
      expect(css).toContain('--colors-brand-primary');
      expect(css).toContain('--colors-brand-secondary');
    });

    it('should skip empty categories', () => {
      const tokens: TokenSet = {
        colors: { primary: '#0066cc' },
        spacing: {},
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const css = exportToCSS(tokens);
      
      expect(css).toContain('--colors-primary');
      expect(css).not.toContain('--spacing');
      expect(css).not.toContain('--typography');
    });
  });

  describe('exportToJSON', () => {
    it('should export tokens as formatted JSON', () => {
      const tokens: TokenSet = {
        colors: { primary: '#0066cc' },
        spacing: { sm: '8px' },
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const json = exportToJSON(tokens);
      const parsed = JSON.parse(json);
      
      expect(parsed.colors.primary).toBe('#0066cc');
      expect(parsed.spacing.sm).toBe('8px');
    });

    it('should pretty-print JSON', () => {
      const tokens: TokenSet = {
        colors: { primary: '#0066cc' },
        spacing: {},
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const json = exportToJSON(tokens);
      
      expect(json).toContain('\n');
      expect(json).toContain('  ');
    });

    it('should preserve structure', () => {
      const tokens: any = {
        colors: { primary: '#0066cc' },
        spacing: { sm: '8px', md: '16px' },
        custom: { nested: { value: 'test' } },
        typography: {},
        borderRadius: {},
        shadows: {},
      };
      const json = exportToJSON(tokens);
      const parsed = JSON.parse(json);
      
      expect(parsed.custom.nested.value).toBe('test');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete token workflow', () => {
      // Parse W3C format
      const input = {
        color: {
          brand: {
            primary: { $value: '#0066cc', $type: 'color' },
          },
        },
        spacing: {
          scale: {
            sm: { $value: '8px', $type: 'dimension' },
          },
        },
      };
      
      const tokens = parseTokens(input);
      const css = exportToCSS(tokens);
      const json = exportToJSON(tokens);
      
      expect(css).toContain('--');
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should preserve all token data through parse and export', () => {
      const input = {
        colors: { primary: '#0066cc', secondary: '#6b7280' },
        spacing: { sm: '8px', md: '16px', lg: '24px' },
        shadows: { card: '0 2px 4px rgba(0,0,0,0.1)' },
      };
      
      const tokens = parseTokens(input);
      const json = exportToJSON(tokens);
      const reparsed = JSON.parse(json);
      
      expect(reparsed.colors.primary).toBe(input.colors.primary);
      expect(reparsed.spacing.sm).toBe(input.spacing.sm);
      expect(reparsed.shadows.card).toBe(input.shadows.card);
    });
  });
});
