/**
 * ComponentCodeGenerator Unit Tests
 */

import { ComponentCodeGenerator } from '../lib/component-code-generator';
import type { ImportedComponent, ComponentNode } from '../types/imported-component';

describe('ComponentCodeGenerator', () => {
  let generator: ComponentCodeGenerator;

  beforeEach(() => {
    generator = new ComponentCodeGenerator();
  });

  const createMockComponent = (structure: ComponentNode, name = 'TestComponent'): ImportedComponent => ({
    id: 'test-1',
    name,
    source: { type: 'manual' },
    category: 'custom',
    structure,
    images: [],
    code: { jsx: '', imports: [] },
    metadata: {
      importedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    isEditable: true,
  });

  describe('React code generation', () => {
    test('should generate basic React component', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {
          layout: { display: 'flex', flexDirection: 'column' },
        },
        children: [],
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('import React from \'react\'');
      expect(code).toContain('export function TestComponent()');
      expect(code).toContain('return');
      expect(code).toContain('display: "flex"');
      expect(code).toContain('flexDirection: "column"');
    });

    test('should generate text node', () => {
      const structure: ComponentNode = {
        id: 'text',
        name: 'Text',
        type: 'text',
        props: { text: 'Hello World' },
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('Hello World');
      expect(code).toContain('<div');
    });

    test('should generate button node', () => {
      const structure: ComponentNode = {
        id: 'btn',
        name: 'Button',
        type: 'button',
        props: { text: 'Click Me' },
        styles: {},
        children: [{
          id: 'btn-text',
          name: 'Text',
          type: 'text',
          props: { text: 'Click Me' },
          styles: {},
        }],
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('<button');
      expect(code).toContain('Click Me');
      expect(code).toContain('</button>');
    });

    test('should generate input node', () => {
      const structure: ComponentNode = {
        id: 'input',
        name: 'Input',
        type: 'input',
        props: { 
          inputType: 'email',
          placeholder: 'Enter email',
        },
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('<input');
      expect(code).toContain('type="email"');
      expect(code).toContain('placeholder="Enter email"');
    });

    test('should generate nested structure', () => {
      const structure: ComponentNode = {
        id: 'container',
        name: 'Container',
        type: 'frame',
        props: {},
        styles: {},
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'frame',
            props: {},
            styles: {},
            children: [{
              id: 'title',
              name: 'Title',
              type: 'text',
              props: { text: 'Title' },
              styles: {},
            }],
          },
          {
            id: 'content',
            name: 'Content',
            type: 'text',
            props: { text: 'Content' },
            styles: {},
          },
        ],
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('Title');
      expect(code).toContain('Content');
      // Should have nested divs
      expect((code.match(/<div/g) || []).length).toBeGreaterThan(1);
    });
  });

  describe('Vue code generation', () => {
    test('should generate Vue component', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {
          layout: { display: 'flex' },
        },
      };

      const component = createMockComponent(structure);
      const code = generator.generateVue(component);

      expect(code).toContain('<template>');
      expect(code).toContain('</template>');
      expect(code).toContain('<script setup lang="ts">');
      expect(code).toContain('</script>');
    });

    test('should generate CSS styles in Vue', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {
          appearance: { backgroundColor: 'red' },
        },
      };

      const component = createMockComponent(structure);
      const code = generator.generateVue(component);

      expect(code).toContain('<style scoped>');
      expect(code).toContain('background-color: red');
    });
  });

  describe('Svelte code generation', () => {
    test('should generate Svelte component', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateSvelte(component);

      expect(code).toContain('<script lang="ts">');
      expect(code).toContain('</script>');
      expect(code).toContain('<div');
    });
  });

  describe('HTML code generation', () => {
    test('should generate HTML document', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateHTML(component);

      expect(code).toContain('<!DOCTYPE html>');
      expect(code).toContain('<html lang="en">');
      expect(code).toContain('<head>');
      expect(code).toContain('<body>');
      expect(code).toContain('</html>');
    });

    test('should include component name in title', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure, 'MyComponent');
      const code = generator.generateHTML(component);

      expect(code).toContain('<title>MyComponent</title>');
    });
  });

  describe('Style handling', () => {
    test('should combine multiple style objects', () => {
      const structure: ComponentNode = {
        id: 'styled',
        name: 'Styled',
        type: 'frame',
        props: {},
        styles: {
          layout: { display: 'flex', gap: '16px' },
          appearance: { backgroundColor: 'blue', borderRadius: '8px' },
          typography: { fontSize: '16px', color: 'white' },
        },
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('display: "flex"');
      expect(code).toContain('gap: "16px"');
      expect(code).toContain('backgroundColor: "blue"');
      expect(code).toContain('borderRadius: "8px"');
      expect(code).toContain('fontSize: "16px"');
      expect(code).toContain('color: "white"');
    });

    test('should convert camelCase to kebab-case for CSS', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {
          appearance: { 
            backgroundColor: 'red',
            borderRadius: '4px',
          },
        },
      };

      const component = createMockComponent(structure);
      const code = generator.generateVue(component);

      expect(code).toContain('background-color: red');
      expect(code).toContain('border-radius: 4px');
    });
  });

  describe('Image handling', () => {
    test('should generate image imports for React', () => {
      const component = createMockComponent(
        {
          id: 'root',
          name: 'Root',
          type: 'frame',
          props: {},
          styles: {},
        },
        'ImageComponent'
      );

      component.images = [
        {
          id: 'img1',
          name: 'hero-image',
          format: 'png',
          width: 800,
          height: 600,
          usedInNodes: [],
        },
      ];

      const code = generator.generateReact(component);

      expect(code).toContain('// import image0 from');
      expect(code).toContain('hero-image.png');
    });

    test('should reference images in JSX', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'image',
        props: { 
          imageSrc: 'img-ref',
          imageAlt: 'Hero',
        },
        styles: {},
      };

      const component = createMockComponent(structure);
      component.images = [{
        id: 'root',
        name: 'hero',
        format: 'png',
        width: 800,
        height: 600,
        usedInNodes: ['root'],
      }];

      const code = generator.generateReact(component);

      expect(code).toContain('<img');
      expect(code).toContain('alt="Hero"');
      expect(code).toContain('src={image0}');
    });
  });

  describe('Component naming', () => {
    test('should convert name to PascalCase', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure, 'my awesome component');
      const code = generator.generateReact(component);

      expect(code).toContain('export function MyAwesomeComponent()');
    });

    test('should handle special characters in name', () => {
      const structure: ComponentNode = {
        id: 'root',
        name: 'Root',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure, 'hero-section-v2');
      const code = generator.generateReact(component);

      expect(code).toContain('export function HeroSectionV2()');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty component', () => {
      const structure: ComponentNode = {
        id: 'empty',
        name: 'Empty',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('export function TestComponent()');
      expect(code).toContain('return');
    });

    test('should handle component with no styles', () => {
      const structure: ComponentNode = {
        id: 'nostyled',
        name: 'NoStyle',
        type: 'frame',
        props: {},
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toBeDefined();
      expect(code).toContain('<div');
    });

    test('should handle text with special characters', () => {
      const structure: ComponentNode = {
        id: 'text',
        name: 'Text',
        type: 'text',
        props: { text: 'Hello "World" & <Friends>' },
        styles: {},
      };

      const component = createMockComponent(structure);
      const code = generator.generateReact(component);

      expect(code).toContain('Hello "World" & <Friends>');
    });
  });
});
