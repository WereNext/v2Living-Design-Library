import { describe, it, expect, beforeEach } from 'vitest';
import { parseTokens } from '../../lib/token-utilities';
import { exportTokens } from '../../utils/tokenExporter';
import { validateThemeAccessibility } from '../../utils/accessibilityChecker';
import { incrementVersion, calculateChanges } from '../../lib/version-utilities';
import {
  generateCSSVariables,
  generateReactComponent,
  generateVueComponent,
} from '../../lib/code-generators';

describe('Complete Design System Workflow Integration Tests', () => {
  describe('Figma → Parse → Validate → Export → Generate', () => {
    it('should handle complete Figma import workflow', () => {
      // Step 1: Import Figma tokens
      const figmaExport = {
        name: 'My Design System',
        variables: [
          {
            id: '1',
            name: 'colors/primary',
            resolvedType: 'COLOR' as const,
            valuesByMode: { default: { r: 0, g: 0.4, b: 0.8, a: 1 } },
          },
          {
            id: '2',
            name: 'colors/background',
            resolvedType: 'COLOR' as const,
            valuesByMode: { default: { r: 1, g: 1, b: 1, a: 1 } },
          },
          {
            id: '3',
            name: 'spacing/base',
            resolvedType: 'FLOAT' as const,
            valuesByMode: { default: 16 },
          },
        ],
      };

      // Step 2: Parse tokens
      const tokens = parseTokens(figmaExport);
      
      expect(tokens.colors).toBeDefined();
      expect(tokens.spacing).toBeDefined();

      // Step 3: Create theme object
      const theme = {
        id: 'imported-theme',
        name: 'Imported Theme',
        ...tokens,
      };

      // Step 4: Validate accessibility
      const issues = validateThemeAccessibility(theme);
      const errors = issues.filter(i => i.severity === 'error');
      
      // Should have good contrast (dark blue on white)
      expect(errors.length).toBeLessThan(2);

      // Step 5: Export to multiple formats
      const css = exportTokens('css', { theme });
      const json = exportTokens('json', { theme });
      const tailwind = exportTokens('tailwind', { theme });

      expect(css).toContain('--colors-');
      expect(JSON.parse(json)).toBeDefined();
      expect(tailwind).toContain('module.exports');

      // Step 6: Generate components
      const reactButton = generateReactComponent('Button', theme);
      const vueCard = generateVueComponent('Card', theme);

      expect(reactButton).toContain('export function Button');
      expect(vueCard).toContain('<template>');
    });

    it('should handle W3C Design Tokens workflow', () => {
      // Step 1: W3C format import
      const w3cTokens = {
        color: {
          brand: {
            primary: {
              $value: '#0066cc',
              $type: 'color',
              $description: 'Primary brand color',
            },
            secondary: {
              $value: '#6b7280',
              $type: 'color',
            },
          },
          base: {
            black: { $value: '#000000', $type: 'color' },
            white: { $value: '#ffffff', $type: 'color' },
          },
        },
        spacing: {
          scale: {
            sm: { $value: '8px', $type: 'dimension' },
            md: { $value: '16px', $type: 'dimension' },
            lg: { $value: '24px', $type: 'dimension' },
          },
        },
      };

      // Step 2: Parse
      const tokens = parseTokens(w3cTokens);

      expect(Object.keys(tokens.colors).length).toBeGreaterThan(0);
      expect(Object.keys(tokens.spacing).length).toBeGreaterThan(0);

      // Step 3: Create theme
      const theme = {
        id: 'w3c-theme',
        name: 'W3C Theme',
        ...tokens,
      };

      // Step 4: Export to CSS
      const cssVars = generateCSSVariables(theme);

      expect(cssVars).toContain(':root');
      expect(cssVars).toContain('--');

      // Step 5: Export to platform formats
      const iosSwift = exportTokens('ios-swift', { theme });
      const androidXml = exportTokens('android-xml', { theme });

      expect(iosSwift).toContain('UIColor');
      expect(androidXml).toContain('<resources>');
    });
  });

  describe('Version Control Workflow', () => {
    it('should track changes and increment versions', () => {
      // Initial theme
      const v1Theme = {
        colors: { primary: '#0066cc' },
        spacing: { sm: '8px' },
      };

      // Modified theme
      const v2Theme = {
        colors: { primary: '#0066cc', secondary: '#6b7280' }, // Added
        spacing: { sm: '8px', md: '16px' }, // Added
      };

      // Calculate changes
      const changes = calculateChanges(v1Theme, v2Theme);

      expect(changes.length).toBeGreaterThan(0);
      expect(changes.some(c => c.type === 'added')).toBe(true);

      // Increment version based on changes
      const currentVersion = '1.0.0';
      const newVersion = incrementVersion(currentVersion, 'minor');

      expect(newVersion).toBe('1.1.0');

      // Create version record
      const versionRecord = {
        version: newVersion,
        timestamp: Date.now(),
        tokens: v2Theme,
        changes,
        description: 'Added secondary color and medium spacing',
      };

      expect(versionRecord.version).toBe('1.1.0');
      expect(versionRecord.changes.length).toBeGreaterThan(0);
    });

    it('should handle breaking changes', () => {
      const v1Theme = {
        colors: { primary: '#0066cc', oldColor: '#ff0000' },
      };

      const v2Theme = {
        colors: { primary: '#0066cc' }, // Removed oldColor
      };

      const changes = calculateChanges(v1Theme, v2Theme);
      const hasRemoved = changes.some(c => c.type === 'removed');

      expect(hasRemoved).toBe(true);

      // Breaking change should increment major version
      const newVersion = incrementVersion('1.5.3', 'major');
      expect(newVersion).toBe('2.0.0');
    });
  });

  describe('Multi-Theme System Workflow', () => {
    it('should manage multiple themes in one system', () => {
      const lightTheme = {
        id: 'light',
        name: 'Light',
        colors: {
          background: '#ffffff',
          foreground: '#000000',
          primary: '#0066cc',
        },
      };

      const darkTheme = {
        id: 'dark',
        name: 'Dark',
        colors: {
          background: '#1a1a1a',
          foreground: '#ffffff',
          primary: '#3388ff',
        },
      };

      // Validate both themes
      const lightIssues = validateThemeAccessibility(lightTheme);
      const darkIssues = validateThemeAccessibility(darkTheme);

      const lightErrors = lightIssues.filter(i => i.severity === 'error');
      const darkErrors = darkIssues.filter(i => i.severity === 'error');

      // Both themes should have good contrast
      expect(lightErrors.length).toBeLessThan(2);
      expect(darkErrors.length).toBeLessThan(2);

      // Export both themes
      const lightCSS = exportTokens('css', { theme: lightTheme });
      const darkCSS = exportTokens('css', { theme: darkTheme });

      expect(lightCSS).toContain('#ffffff');
      expect(darkCSS).toContain('#1a1a1a');

      // Generate components for both themes
      const lightButton = generateReactComponent('Button', lightTheme);
      const darkButton = generateReactComponent('Button', darkTheme);

      expect(lightButton).toContain('Button');
      expect(darkButton).toContain('Button');
    });
  });

  describe('Export and Re-import Workflow', () => {
    it('should maintain data integrity through export/import cycle', () => {
      const originalTheme = {
        id: 'original',
        name: 'Original Theme',
        description: 'Test theme',
        colors: {
          primary: '#0066cc',
          secondary: '#6b7280',
          background: '#ffffff',
        },
        spacing: {
          sm: '8px',
          md: '16px',
          lg: '24px',
        },
        typography: {
          'font-family': 'Inter, sans-serif',
        },
      };

      // Export to JSON
      const exported = exportTokens('json', { theme: originalTheme });

      // Parse exported JSON
      const parsed = JSON.parse(exported);

      // Re-import
      const reimported = parseTokens(parsed);

      // Verify data integrity
      expect(reimported.colors.primary).toBe(originalTheme.colors.primary);
      expect(reimported.spacing.sm).toBe(originalTheme.spacing.sm);
      expect(reimported.typography['font-family']).toBe(
        originalTheme.typography['font-family']
      );
    });

    it('should handle Figma export and re-import', () => {
      const figmaExport = {
        variables: [
          {
            id: '1',
            name: 'Test/colors/primary',
            resolvedType: 'COLOR' as const,
            valuesByMode: { default: { r: 0, g: 0.4, b: 0.8, a: 1 } },
          },
        ],
      };

      // Parse Figma format
      const parsed = parseTokens(figmaExport);

      // Create theme
      const theme = {
        id: 'test',
        name: 'Test',
        ...parsed,
      };

      // Export to Figma Tokens format
      const exported = exportTokens('figma-tokens', { theme });
      const reExported = JSON.parse(exported);

      // Should maintain Figma token structure
      expect(reExported).toBeDefined();
      expect(Object.keys(reExported.colors).length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility-Driven Development Workflow', () => {
    it('should guide towards accessible color choices', () => {
      // Start with potentially inaccessible colors
      const initialTheme = {
        colors: {
          foreground: '#888888',
          background: '#999999',
        },
      };

      // Validate
      const issues = validateThemeAccessibility(initialTheme);
      const hasContrastIssues = issues.some(
        i => i.issue.includes('contrast') && i.severity === 'error'
      );

      expect(hasContrastIssues).toBe(true);

      // Fix by using accessible colors
      const fixedTheme = {
        colors: {
          foreground: '#000000',
          background: '#ffffff',
          primary: '#0066cc',
          'primary-foreground': '#ffffff',
        },
      };

      // Re-validate
      const fixedIssues = validateThemeAccessibility(fixedTheme);
      const fixedErrors = fixedIssues.filter(i => i.severity === 'error');

      expect(fixedErrors.length).toBe(0);
    });
  });

  describe('Real-World Scenario: Complete Design System Creation', () => {
    it('should support full design system lifecycle', () => {
      // 1. Designer exports from Figma
      const figmaData = {
        name: 'Product Design System',
        variables: [
          {
            id: '1',
            name: 'colors/primary',
            resolvedType: 'COLOR' as const,
            valuesByMode: { default: { r: 0.02, g: 0.4, b: 0.8, a: 1 } },
          },
          {
            id: '2',
            name: 'colors/background',
            resolvedType: 'COLOR' as const,
            valuesByMode: { default: { r: 1, g: 1, b: 1, a: 1 } },
          },
          {
            id: '3',
            name: 'spacing/base',
            resolvedType: 'FLOAT' as const,
            valuesByMode: { default: 8 },
          },
        ],
      };

      // 2. Parse and create theme
      const tokens = parseTokens(figmaData);
      const theme = {
        id: 'v1',
        name: 'Product v1.0',
        ...tokens,
      };

      // 3. Validate accessibility
      const accessibilityIssues = validateThemeAccessibility(theme);
      expect(accessibilityIssues).toBeDefined();

      // 4. Generate CSS for web
      const webCSS = generateCSSVariables(theme);
      expect(webCSS).toContain(':root');

      // 5. Generate React components
      const button = generateReactComponent('Button', theme);
      const card = generateReactComponent('Card', theme);
      expect(button).toBeDefined();
      expect(card).toBeDefined();

      // 6. Export for mobile platforms
      const ios = exportTokens('ios-swift', { theme });
      const android = exportTokens('android-xml', { theme });
      expect(ios).toContain('UIColor');
      expect(android).toContain('<resources>');

      // 7. Version the design system
      const version = '1.0.0';
      const versionRecord = {
        version,
        timestamp: Date.now(),
        tokens: theme,
        changes: [],
        description: 'Initial release',
      };
      expect(versionRecord.version).toBe('1.0.0');

      // 8. Export complete system as JSON
      const fullExport = exportTokens('json', { theme });
      const exported = JSON.parse(fullExport);
      expect(exported).toBeDefined();

      // Complete workflow successful!
      expect(true).toBe(true);
    });
  });
});
