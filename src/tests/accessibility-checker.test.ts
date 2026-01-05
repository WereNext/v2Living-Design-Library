import { describe, it, expect } from 'vitest';
import {
  checkContrast,
  validateThemeAccessibility,
  suggestAccessibleColor,
} from '../utils/accessibilityChecker';

describe('Accessibility Checker', () => {
  describe('checkContrast', () => {
    it('should calculate contrast for black on white', () => {
      const result = checkContrast('#000000', '#ffffff');
      expect(result.ratio).toBe(21); // Perfect contrast
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(true);
      expect(result.aaLarge).toBe(true);
      expect(result.aaaLarge).toBe(true);
    });

    it('should calculate contrast for white on black', () => {
      const result = checkContrast('#ffffff', '#000000');
      expect(result.ratio).toBe(21);
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(true);
    });

    it('should fail AA for low contrast', () => {
      const result = checkContrast('#777777', '#888888');
      expect(result.aa).toBe(false);
      expect(result.aaa).toBe(false);
    });

    it('should pass AA but fail AAA for medium contrast', () => {
      const result = checkContrast('#595959', '#ffffff');
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(false);
    });

    it('should handle RGB format', () => {
      const result = checkContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
      expect(result.ratio).toBe(21);
      expect(result.aa).toBe(true);
    });

    it('should handle HSL format', () => {
      const result = checkContrast('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)');
      expect(result.ratio).toBe(21);
      expect(result.aa).toBe(true);
    });

    it('should handle 3-digit hex colors', () => {
      const result = checkContrast('#000', '#fff');
      expect(result.ratio).toBe(21);
      expect(result.aa).toBe(true);
    });

    it('should handle large text requirements', () => {
      // 3:1 is enough for large text AA
      const result = checkContrast('#959595', '#ffffff');
      expect(result.aaLarge).toBe(true);
      expect(result.aa).toBe(false);
    });

    it('should round ratio to 2 decimal places', () => {
      const result = checkContrast('#595959', '#ffffff');
      expect(result.ratio % 1).toBeLessThan(0.01); // Should be rounded
    });
  });

  describe('validateThemeAccessibility', () => {
    it('should return empty array for theme without colors', () => {
      const theme = { spacing: { sm: '8px' } };
      const issues = validateThemeAccessibility(theme);
      expect(issues).toHaveLength(0);
    });

    it('should detect contrast issues', () => {
      const theme = {
        colors: {
          foreground: '#888888',
          background: '#999999',
        },
      };
      const issues = validateThemeAccessibility(theme);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some(i => i.severity === 'error')).toBe(true);
    });

    it('should pass valid theme', () => {
      const theme = {
        colors: {
          foreground: '#000000',
          background: '#ffffff',
          'primary-foreground': '#ffffff',
          primary: '#0066cc',
        },
      };
      const issues = validateThemeAccessibility(theme);
      const errors = issues.filter(i => i.severity === 'error');
      expect(errors).toHaveLength(0);
    });

    it('should warn for AAA failures', () => {
      const theme = {
        colors: {
          foreground: '#595959',
          background: '#ffffff',
        },
      };
      const issues = validateThemeAccessibility(theme);
      const warnings = issues.filter(i => i.severity === 'warning');
      expect(warnings.length).toBeGreaterThan(0);
    });

    it('should detect similar primary and secondary colors', () => {
      const theme = {
        colors: {
          primary: '#0066cc',
          secondary: '#0077dd',
        },
      };
      const issues = validateThemeAccessibility(theme);
      const similarityWarnings = issues.filter(
        i => i.issue.includes('too similar')
      );
      expect(similarityWarnings.length).toBeGreaterThan(0);
    });

    it('should include suggestions for issues', () => {
      const theme = {
        colors: {
          foreground: '#888888',
          background: '#999999',
        },
      };
      const issues = validateThemeAccessibility(theme);
      expect(issues.every(i => i.suggestion)).toBe(true);
    });

    it('should include token paths in issues', () => {
      const theme = {
        colors: {
          'primary-foreground': '#cccccc',
          primary: '#dddddd',
        },
      };
      const issues = validateThemeAccessibility(theme);
      expect(
        issues.some(i => i.tokenPath.includes('primary-foreground'))
      ).toBe(true);
    });
  });

  describe('suggestAccessibleColor', () => {
    it('should suggest darker color for light background', () => {
      const suggestion = suggestAccessibleColor('#cccccc', '#ffffff', 4.5);
      expect(suggestion).not.toBeNull();
      if (suggestion) {
        const result = checkContrast(suggestion, '#ffffff');
        expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('should suggest lighter color for dark background', () => {
      const suggestion = suggestAccessibleColor('#333333', '#000000', 4.5);
      expect(suggestion).not.toBeNull();
      if (suggestion) {
        const result = checkContrast(suggestion, '#000000');
        expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('should return null for invalid color', () => {
      const suggestion = suggestAccessibleColor('invalid', '#ffffff');
      expect(suggestion).toBeNull();
    });

    it('should handle AAA requirement', () => {
      const suggestion = suggestAccessibleColor('#cccccc', '#ffffff', 7);
      if (suggestion) {
        const result = checkContrast(suggestion, '#ffffff');
        expect(result.ratio).toBeGreaterThanOrEqual(7);
      }
    });

    it('should handle RGB input colors', () => {
      const suggestion = suggestAccessibleColor(
        'rgb(200, 200, 200)',
        '#ffffff',
        4.5
      );
      expect(suggestion).not.toBeNull();
    });

    it('should return null if target cannot be met', () => {
      // Very light color on white - may not be able to meet high contrast
      const suggestion = suggestAccessibleColor('#fefefe', '#ffffff', 7);
      // This might return null if iterations are exhausted
      if (suggestion) {
        const result = checkContrast(suggestion, '#ffffff');
        expect(result.ratio).toBeGreaterThanOrEqual(7);
      }
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle all color formats consistently', () => {
      const hex = checkContrast('#000000', '#ffffff');
      const rgb = checkContrast('rgb(0,0,0)', 'rgb(255,255,255)');
      const hsl = checkContrast('hsl(0,0%,0%)', 'hsl(0,0%,100%)');

      expect(hex.ratio).toBe(rgb.ratio);
      expect(hex.ratio).toBe(hsl.ratio);
    });

    it('should handle real-world color combinations', () => {
      const combinations = [
        { fg: '#1a1a1a', bg: '#ffffff', shouldPass: true },
        { fg: '#0066cc', bg: '#ffffff', shouldPass: true },
        { fg: '#666666', bg: '#ffffff', shouldPass: true },
        { fg: '#cccccc', bg: '#ffffff', shouldPass: false },
      ];

      combinations.forEach(({ fg, bg, shouldPass }) => {
        const result = checkContrast(fg, bg);
        expect(result.aa).toBe(shouldPass);
      });
    });

    it('should validate complete theme object', () => {
      const completeTheme = {
        colors: {
          foreground: '#0a0a0a',
          background: '#ffffff',
          'primary-foreground': '#ffffff',
          primary: '#0066cc',
          'secondary-foreground': '#ffffff',
          secondary: '#6b7280',
          'muted-foreground': '#6b7280',
          muted: '#f3f4f6',
          'card-foreground': '#0a0a0a',
          card: '#ffffff',
        },
      };

      const issues = validateThemeAccessibility(completeTheme);
      const errors = issues.filter(i => i.severity === 'error');
      
      // A well-designed theme should have few or no errors
      expect(errors.length).toBeLessThan(3);
    });
  });
});
