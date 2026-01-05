/**
 * Component Code Generator
 * 
 * Generates React/Vue/Svelte code from ComponentNode structure
 */

import type { ComponentNode, ImportedComponent, ImportedImage } from '../types/imported-component';

export class ComponentCodeGenerator {
  /**
   * Generate React component code
   */
  generateReact(component: ImportedComponent): string {
    const { structure, images, name } = component;
    const componentName = this.toComponentName(name);

    const imports = this.generateReactImports(images);
    const jsx = this.generateJSX(structure, images, 1, true); // Pass isRoot=true
    const styles = this.generateInlineStyles(structure);

    return `
import React from 'react';
${imports}

/**
 * ${componentName} - Imported from Figma
 * 
 * This component is responsive by default:
 * - Fixed widths > 400px are converted to max-width with width: 100%
 * - Elements with FILL sizing mode use 100% width
 * - Elements with AUTO sizing mode use auto width
 */
export function ${componentName}() {
  return (
${jsx}
  );
}

${styles ? `const styles = ${JSON.stringify(styles, null, 2)};` : ''}
    `.trim();
  }

  /**
   * Generate Vue component code
   */
  generateVue(component: ImportedComponent): string {
    const { structure, images, name } = component;
    
    const template = this.generateVueTemplate(structure, images, 1);
    const styles = this.generateCSSStyles(structure);

    return `
<template>
${template}
</template>

<script setup lang="ts">
// Component: ${name}
</script>

${styles ? `<style scoped>\n${styles}\n</style>` : ''}
    `.trim();
  }

  /**
   * Generate Svelte component code
   */
  generateSvelte(component: ImportedComponent): string {
    const { structure, images, name } = component;
    
    const markup = this.generateSvelteMarkup(structure, images, 0);
    const styles = this.generateCSSStyles(structure);

    return `
<script lang="ts">
  // Component: ${name}
</script>

${markup}

${styles ? `<style>\n${styles}\n</style>` : ''}
    `.trim();
  }

  /**
   * Generate HTML with inline styles
   */
  generateHTML(component: ImportedComponent): string {
    const { structure, name } = component;
    const html = this.generateHTMLMarkup(structure, 1);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
</head>
<body>
${html}
</body>
</html>
    `.trim();
  }

  /**
   * Generate React imports
   */
  private generateReactImports(images: ImportedImage[]): string {
    if (images.length === 0) return '';

    const imports = images.map((img, index) => {
      const varName = `image${index}`;
      return `// import ${varName} from './assets/${img.name}.${img.format}';`;
    });

    return imports.join('\n');
  }

  /**
   * Generate JSX
   */
  private generateJSX(
    node: ComponentNode,
    images: ImportedImage[],
    depth: number,
    isRoot: boolean = false
  ): string {
    const indent = '  '.repeat(depth);
    const style = this.combineStyles(node.styles);
    const styleAttr = Object.keys(style).length > 0 
      ? ` style={${JSON.stringify(style)}}`
      : '';

    // Text node
    if (node.type === 'text') {
      const text = node.props.text || '';
      return `${indent}<div${styleAttr}>\n${indent}  ${text}\n${indent}</div>`;
    }

    // Image node
    if (node.type === 'image') {
      const imgIndex = images.findIndex(img => 
        img.usedInNodes.includes(node.id)
      );
      const src = imgIndex >= 0 
        ? `{image${imgIndex}}` 
        : `"${node.props.imageSrc || ''}"`;
      const alt = node.props.imageAlt || node.name;
      
      return `${indent}<img src=${src} alt="${alt}"${styleAttr} />`;
    }

    // Button node
    if (node.type === 'button') {
      const children = node.children
        ?.map(child => this.generateJSX(child, images, depth + 1))
        .join('\n') || '';
      
      return `${indent}<button${styleAttr}>\n${children}\n${indent}</button>`;
    }

    // Input node
    if (node.type === 'input') {
      const type = node.props.inputType || 'text';
      const placeholder = node.props.placeholder || node.props.text || '';
      
      return `${indent}<input type="${type}" placeholder="${placeholder}"${styleAttr} />`;
    }

    // Container nodes
    const children = node.children
      ?.map(child => this.generateJSX(child, images, depth + 1))
      .join('\n') || '';

    const tag = node.type === 'component' ? 'div' : 'div';
    
    if (children) {
      return `${indent}<${tag}${styleAttr}>\n${children}\n${indent}</${tag}>`;
    }
    
    return `${indent}<${tag}${styleAttr} />`;
  }

  /**
   * Generate Vue template
   */
  private generateVueTemplate(
    node: ComponentNode,
    images: ImportedImage[],
    depth: number
  ): string {
    const indent = '  '.repeat(depth);
    const classAttr = ` class="${this.toClassName(node.id)}"`;

    if (node.type === 'text') {
      return `${indent}<div${classAttr}>${node.props.text || ''}</div>`;
    }

    if (node.type === 'image') {
      const src = node.props.imageSrc || '';
      const alt = node.props.imageAlt || node.name;
      return `${indent}<img src="${src}" alt="${alt}"${classAttr} />`;
    }

    if (node.type === 'button') {
      const children = node.children
        ?.map(child => this.generateVueTemplate(child, images, depth + 1))
        .join('\n') || '';
      return `${indent}<button${classAttr}>\n${children}\n${indent}</button>`;
    }

    if (node.type === 'input') {
      const type = node.props.inputType || 'text';
      const placeholder = node.props.placeholder || '';
      return `${indent}<input type="${type}" placeholder="${placeholder}"${classAttr} />`;
    }

    const children = node.children
      ?.map(child => this.generateVueTemplate(child, images, depth + 1))
      .join('\n') || '';

    if (children) {
      return `${indent}<div${classAttr}>\n${children}\n${indent}</div>`;
    }
    
    return `${indent}<div${classAttr} />`;
  }

  /**
   * Generate Svelte markup
   */
  private generateSvelteMarkup(
    node: ComponentNode,
    images: ImportedImage[],
    depth: number
  ): string {
    // Similar to Vue template generation
    return this.generateVueTemplate(node, images, depth);
  }

  /**
   * Generate HTML markup
   */
  private generateHTMLMarkup(node: ComponentNode, depth: number): string {
    const indent = '  '.repeat(depth);
    const style = this.combineStyles(node.styles);
    const styleAttr = Object.keys(style).length > 0
      ? ` style="${this.styleObjectToString(style)}"`
      : '';

    if (node.type === 'text') {
      return `${indent}<div${styleAttr}>${node.props.text || ''}</div>`;
    }

    if (node.type === 'image') {
      const src = node.props.imageSrc || '';
      const alt = node.props.imageAlt || node.name;
      return `${indent}<img src="${src}" alt="${alt}"${styleAttr}>`;
    }

    if (node.type === 'button') {
      const children = node.children
        ?.map(child => this.generateHTMLMarkup(child, depth + 1))
        .join('\n') || '';
      return `${indent}<button${styleAttr}>\n${children}\n${indent}</button>`;
    }

    if (node.type === 'input') {
      const type = node.props.inputType || 'text';
      const placeholder = node.props.placeholder || '';
      return `${indent}<input type="${type}" placeholder="${placeholder}"${styleAttr}>`;
    }

    const children = node.children
      ?.map(child => this.generateHTMLMarkup(child, depth + 1))
      .join('\n') || '';

    if (children) {
      return `${indent}<div${styleAttr}>\n${children}\n${indent}</div>`;
    }
    
    return `${indent}<div${styleAttr}></div>`;
  }

  /**
   * Generate CSS styles
   */
  private generateCSSStyles(node: ComponentNode): string {
    const styles: string[] = [];

    const collectStyles = (n: ComponentNode) => {
      const className = this.toClassName(n.id);
      const style = this.combineStyles(n.styles);
      
      if (Object.keys(style).length > 0) {
        const css = Object.entries(style)
          .map(([key, value]) => `  ${this.camelToKebab(key)}: ${value};`)
          .join('\n');
        styles.push(`.${className} {\n${css}\n}`);
      }

      n.children?.forEach(collectStyles);
    };

    collectStyles(node);
    return styles.join('\n\n');
  }

  /**
   * Generate inline styles object
   */
  private generateInlineStyles(node: ComponentNode): Record<string, any> {
    const styles: Record<string, any> = {};

    const collectStyles = (n: ComponentNode) => {
      const style = this.combineStyles(n.styles);
      if (Object.keys(style).length > 0) {
        styles[n.id] = style;
      }
      n.children?.forEach(collectStyles);
    };

    collectStyles(node);
    return styles;
  }

  /**
   * Combine all style objects into one
   */
  private combineStyles(styles: ComponentNode['styles']): Record<string, any> {
    const combined = {
      ...styles.layout,
      ...styles.appearance,
      ...styles.typography,
      ...styles.spacing,
      ...styles.effects,
    };

    // Make fixed pixel widths more responsive
    if (combined.width && typeof combined.width === 'string' && combined.width.endsWith('px')) {
      const pixelValue = parseInt(combined.width);
      // For widths > 400px, add max-width instead to allow responsiveness
      if (pixelValue > 400) {
        combined.maxWidth = combined.width;
        combined.width = '100%';
      }
    }

    return combined;
  }

  /**
   * Convert style object to CSS string
   */
  private styleObjectToString(style: Record<string, any>): string {
    return Object.entries(style)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Convert name to component name (PascalCase)
   */
  private toComponentName(name: string): string {
    return name
      .split(/[^a-zA-Z0-9]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Convert ID to CSS class name
   */
  private toClassName(id: string): string {
    return `node-${id.replace(/[^a-zA-Z0-9]/g, '-')}`;
  }
}