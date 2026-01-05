import { describe, it, expect } from 'vitest';
import {
  generateCSSVariables,
  generateReactComponent,
  generateVueComponent,
  generateSvelteComponent,
  generateAngularComponent,
} from '../lib/code-generators';

describe('Code Generators', () => {
  const mockTheme = {
    id: 'test-theme',
    name: 'Test Theme',
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
      'font-size-base': '16px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
    },
  };

  describe('generateCSSVariables', () => {
    it('should generate CSS custom properties', () => {
      const css = generateCSSVariables(mockTheme);
      
      expect(css).toContain(':root {');
      expect(css).toContain('--primary:');
      expect(css).toContain('--secondary:');
      expect(css).toContain('}');
    });

    it('should include all token categories', () => {
      const css = generateCSSVariables(mockTheme);
      
      expect(css).toContain('/* Colors */');
      expect(css).toContain('/* Typography */');
      expect(css).toContain('/* Spacing */');
      expect(css).toContain('/* Border Radius */');
      expect(css).toContain('/* Shadows */');
    });

    it('should format color values correctly', () => {
      const css = generateCSSVariables(mockTheme);
      
      expect(css).toContain('#0066cc');
      expect(css).toContain('#6b7280');
    });

    it('should handle HSL color values', () => {
      const themeWithHSL = {
        ...mockTheme,
        colors: {
          primary: 'hsl(210, 100%, 40%)',
        },
      };
      
      const css = generateCSSVariables(themeWithHSL);
      expect(css).toContain('hsl(210, 100%, 40%)');
    });

    it('should handle empty theme categories', () => {
      const minimalTheme = {
        id: 'minimal',
        name: 'Minimal',
        colors: { primary: '#000' },
      };
      
      const css = generateCSSVariables(minimalTheme as any);
      expect(css).toContain(':root {');
      expect(css).toContain('}');
    });

    it('should properly indent CSS', () => {
      const css = generateCSSVariables(mockTheme);
      const lines = css.split('\n');
      
      // Properties should be indented with 2 spaces
      const propertyLines = lines.filter(l => l.includes('--'));
      expect(propertyLines.every(l => l.startsWith('  --'))).toBe(true);
    });
  });

  describe('generateReactComponent', () => {
    it('should generate a valid React component', () => {
      const code = generateReactComponent('Button', mockTheme);
      
      expect(code).toContain('import React from');
      expect(code).toContain('export function Button');
      expect(code).toContain('return');
    });

    it('should include theme styling', () => {
      const code = generateReactComponent('Button', mockTheme);
      
      expect(code).toContain('primary');
      expect(code).toContain('style');
    });

    it('should use TypeScript', () => {
      const code = generateReactComponent('Card', mockTheme);
      
      expect(code).toContain('interface');
      expect(code).toMatch(/Props/);
    });

    it('should handle component names correctly', () => {
      const code = generateReactComponent('MyCustomButton', mockTheme);
      
      expect(code).toContain('function MyCustomButton');
      expect(code).toContain('export');
    });

    it('should include children prop for container components', () => {
      const code = generateReactComponent('Container', mockTheme);
      
      expect(code).toContain('children');
      expect(code).toContain('React.ReactNode');
    });

    it('should use theme colors in styling', () => {
      const code = generateReactComponent('Button', mockTheme);
      
      expect(code).toMatch(/#0066cc|var\(--primary\)/);
    });
  });

  describe('generateVueComponent', () => {
    it('should generate a valid Vue component', () => {
      const code = generateVueComponent('Button', mockTheme);
      
      expect(code).toContain('<template>');
      expect(code).toContain('</template>');
      expect(code).toContain('<script>');
      expect(code).toContain('</script>');
      expect(code).toContain('<style>');
      expect(code).toContain('</style>');
    });

    it('should use Vue 3 composition API', () => {
      const code = generateVueComponent('Button', mockTheme);
      
      expect(code).toContain('setup');
    });

    it('should include scoped styles', () => {
      const code = generateVueComponent('Card', mockTheme);
      
      expect(code).toContain('<style scoped>');
    });

    it('should use theme tokens in CSS', () => {
      const code = generateVueComponent('Button', mockTheme);
      
      expect(code).toContain('var(--');
    });

    it('should define props correctly', () => {
      const code = generateVueComponent('Button', mockTheme);
      
      expect(code).toContain('props');
    });

    it('should emit events properly', () => {
      const code = generateVueComponent('Button', mockTheme);
      
      expect(code).toContain('@click' || 'emit');
    });
  });

  describe('generateSvelteComponent', () => {
    it('should generate a valid Svelte component', () => {
      const code = generateSvelteComponent('Button', mockTheme);
      
      expect(code).toContain('<script>');
      expect(code).toContain('</script>');
    });

    it('should use Svelte syntax for props', () => {
      const code = generateSvelteComponent('Button', mockTheme);
      
      expect(code).toContain('export let');
    });

    it('should include component styling', () => {
      const code = generateSvelteComponent('Card', mockTheme);
      
      expect(code).toContain('<style>');
      expect(code).toContain('</style>');
    });

    it('should use theme tokens', () => {
      const code = generateSvelteComponent('Button', mockTheme);
      
      expect(code).toContain('var(--');
    });

    it('should handle events properly', () => {
      const code = generateSvelteComponent('Button', mockTheme);
      
      expect(code).toContain('on:click');
    });

    it('should support reactive statements', () => {
      const code = generateSvelteComponent('Button', mockTheme);
      
      // Svelte reactive statements use $:
      expect(code).toMatch(/\$:|reactive/i);
    });
  });

  describe('generateAngularComponent', () => {
    it('should generate a valid Angular component', () => {
      const code = generateAngularComponent('Button', mockTheme);
      
      expect(code).toContain('@Component');
      expect(code).toContain('selector:');
      expect(code).toContain('template:');
      expect(code).toContain('export class');
    });

    it('should use proper Angular decorators', () => {
      const code = generateAngularComponent('Button', mockTheme);
      
      expect(code).toContain('@Component');
      expect(code).toContain('@Input');
    });

    it('should include component metadata', () => {
      const code = generateAngularComponent('Card', mockTheme);
      
      expect(code).toContain('selector:');
      expect(code).toContain('templateUrl:' || 'template:');
      expect(code).toContain('styleUrls:' || 'styles:');
    });

    it('should use TypeScript for class definition', () => {
      const code = generateAngularComponent('Button', mockTheme);
      
      expect(code).toContain('class');
      expect(code).toContain(': string' || ': boolean');
    });

    it('should include Input decorators for props', () => {
      const code = generateAngularComponent('Button', mockTheme);
      
      expect(code).toContain('@Input()');
    });

    it('should use theme tokens in styles', () => {
      const code = generateAngularComponent('Button', mockTheme);
      
      expect(code).toContain('var(--');
    });
  });

  describe('Cross-Framework Consistency', () => {
    it('should generate similar structure across frameworks', () => {
      const react = generateReactComponent('Button', mockTheme);
      const vue = generateVueComponent('Button', mockTheme);
      const svelte = generateSvelteComponent('Button', mockTheme);
      const angular = generateAngularComponent('Button', mockTheme);
      
      // All should reference the primary color
      expect(react).toContain('primary');
      expect(vue).toContain('primary');
      expect(svelte).toContain('primary');
      expect(angular).toContain('primary');
    });

    it('should use consistent naming conventions', () => {
      const componentName = 'MyButton';
      
      const react = generateReactComponent(componentName, mockTheme);
      const vue = generateVueComponent(componentName, mockTheme);
      const svelte = generateSvelteComponent(componentName, mockTheme);
      const angular = generateAngularComponent(componentName, mockTheme);
      
      expect(react).toContain(componentName);
      expect(vue).toContain(componentName);
      expect(svelte).toContain(componentName);
      expect(angular).toContain(componentName);
    });

    it('should apply theme tokens consistently', () => {
      const react = generateReactComponent('Card', mockTheme);
      const vue = generateVueComponent('Card', mockTheme);
      const svelte = generateSvelteComponent('Card', mockTheme);
      const angular = generateAngularComponent('Card', mockTheme);
      
      // All should use CSS custom properties
      [react, vue, svelte, angular].forEach(code => {
        expect(code).toContain('var(--');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimal theme', () => {
      const minimalTheme = {
        id: 'minimal',
        name: 'Minimal',
        colors: { primary: '#000' },
      };
      
      expect(() => generateCSSVariables(minimalTheme as any)).not.toThrow();
      expect(() => generateReactComponent('Button', minimalTheme as any)).not.toThrow();
    });

    it('should handle special characters in component names', () => {
      const code = generateReactComponent('My-Custom-Button', mockTheme);
      
      // Should convert to valid identifier
      expect(code).toMatch(/MyCustomButton|My_Custom_Button/);
    });

    it('should handle empty theme gracefully', () => {
      const emptyTheme = { id: 'empty', name: 'Empty' };
      
      const css = generateCSSVariables(emptyTheme as any);
      expect(css).toContain(':root {');
      expect(css).toContain('}');
    });

    it('should escape special characters in values', () => {
      const specialTheme = {
        ...mockTheme,
        typography: {
          'font-family': '"Helvetica Neue", Arial',
        },
      };
      
      const css = generateCSSVariables(specialTheme);
      expect(css).toContain('"Helvetica Neue"');
    });

    it('should handle numeric values', () => {
      const numericTheme = {
        ...mockTheme,
        lineHeight: {
          base: 1.5,
          heading: 1.2,
        },
      };
      
      const css = generateCSSVariables(numericTheme as any);
      expect(css).toContain('1.5');
      expect(css).toContain('1.2');
    });
  });
});
