/**
 * LDL Token Generator
 *
 * Generates various output formats from LDL token documents
 */

import {
  LDLTokenDocument,
  LDLColorTokens,
  LDLColorToken,
  LDLFontTokens,
  LDLModeTokens,
  OutputFormat,
  GeneratorOptions,
  GeneratorResult,
  isColorWithForeground
} from './types';

// =============================================================================
// Main Generator
// =============================================================================

/**
 * Generate output from LDL document
 */
export function generate(document: LDLTokenDocument, options: GeneratorOptions): GeneratorResult {
  const errors: string[] = [];

  try {
    let output: string;

    switch (options.format) {
      case 'css':
        output = generateCSS(document, options);
        break;
      case 'scss':
        output = generateSCSS(document, options);
        break;
      case 'tailwind-config':
        output = generateTailwindConfig(document, options);
        break;
      case 'tailwind-css':
        output = generateTailwindCSS(document, options);
        break;
      case 'json':
        output = generateJSON(document, options);
        break;
      case 'typescript':
        output = generateTypeScript(document, options);
        break;
      case 'ios-swift':
        output = generateSwift(document, options);
        break;
      case 'android-xml':
        output = generateAndroidXML(document, options);
        break;
      case 'w3c-dtcg':
        output = generateW3CDTCG(document, options);
        break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }

    return { success: true, output, errors };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'Generation failed');
    return { success: false, output: '', errors };
  }
}

// =============================================================================
// CSS Generator
// =============================================================================

function generateCSS(document: LDLTokenDocument, options: GeneratorOptions): string {
  const prefix = options.prefix || '';
  const lines: string[] = [];

  if (options.includeComments !== false) {
    lines.push(`/* ${document.$name} - LDL Tokens */`);
    if (document.$description) {
      lines.push(`/* ${document.$description} */`);
    }
    if (document.$version) {
      lines.push(`/* Version: ${document.$version} */`);
    }
    lines.push('');
  }

  lines.push(':root {');

  // Colors
  if (document.color) {
    if (options.includeComments !== false) lines.push('  /* Colors */');
    lines.push(...generateCSSColorVars(document.color, prefix));
  }

  // Space
  if (document.space) {
    if (options.includeComments !== false) lines.push('\n  /* Spacing */');
    for (const [name, value] of Object.entries(document.space)) {
      lines.push(`  --${prefix}space-${name}: ${value};`);
    }
  }

  // Radius
  if (document.radius) {
    if (options.includeComments !== false) lines.push('\n  /* Border Radius */');
    for (const [name, value] of Object.entries(document.radius)) {
      lines.push(`  --${prefix}radius-${name}: ${value};`);
    }
  }

  // Shadow
  if (document.shadow) {
    if (options.includeComments !== false) lines.push('\n  /* Shadows */');
    for (const [name, value] of Object.entries(document.shadow)) {
      lines.push(`  --${prefix}shadow-${name}: ${value};`);
    }
  }

  // Font
  if (document.font) {
    lines.push(...generateCSSFontVars(document.font, prefix, options.includeComments !== false));
  }

  // Duration
  if (document.duration) {
    if (options.includeComments !== false) lines.push('\n  /* Durations */');
    for (const [name, value] of Object.entries(document.duration)) {
      lines.push(`  --${prefix}duration-${name}: ${value};`);
    }
  }

  // Ease
  if (document.ease) {
    if (options.includeComments !== false) lines.push('\n  /* Easing */');
    for (const [name, value] of Object.entries(document.ease)) {
      lines.push(`  --${prefix}ease-${name}: ${value};`);
    }
  }

  lines.push('}');

  // Mode overrides
  if (options.includeModes !== false && document.mode) {
    lines.push('');
    lines.push(...generateCSSModes(document.mode, prefix, options));
  }

  return lines.join('\n');
}

function generateCSSColorVars(colors: LDLColorTokens, prefix: string): string[] {
  const lines: string[] = [];

  for (const [name, token] of Object.entries(colors)) {
    if (token === undefined) continue;

    if (isColorWithForeground(token)) {
      lines.push(`  --${prefix}color-${name}: ${token.value};`);
      lines.push(`  --${prefix}color-${name}-foreground: ${token.foreground};`);
    } else {
      lines.push(`  --${prefix}color-${name}: ${token};`);
    }
  }

  return lines;
}

function generateCSSFontVars(font: LDLFontTokens, prefix: string, includeComments: boolean): string[] {
  const lines: string[] = [];

  if (font.family) {
    if (includeComments) lines.push('\n  /* Font Families */');
    for (const [name, value] of Object.entries(font.family)) {
      lines.push(`  --${prefix}font-family-${name}: ${value};`);
    }
  }

  if (font.size) {
    if (includeComments) lines.push('\n  /* Font Sizes */');
    for (const [name, value] of Object.entries(font.size)) {
      lines.push(`  --${prefix}font-size-${name}: ${value};`);
    }
  }

  if (font.weight) {
    if (includeComments) lines.push('\n  /* Font Weights */');
    for (const [name, value] of Object.entries(font.weight)) {
      lines.push(`  --${prefix}font-weight-${name}: ${value};`);
    }
  }

  if (font.leading) {
    if (includeComments) lines.push('\n  /* Line Heights */');
    for (const [name, value] of Object.entries(font.leading)) {
      lines.push(`  --${prefix}font-leading-${name}: ${value};`);
    }
  }

  if (font.tracking) {
    if (includeComments) lines.push('\n  /* Letter Spacing */');
    for (const [name, value] of Object.entries(font.tracking)) {
      lines.push(`  --${prefix}font-tracking-${name}: ${value};`);
    }
  }

  return lines;
}

function generateCSSModes(modes: LDLModeTokens, prefix: string, options: GeneratorOptions): string[] {
  const lines: string[] = [];
  const selector = options.modeSelector || 'class';

  for (const [modeName, override] of Object.entries(modes)) {
    if (!override) continue;

    let selectorStr: string;
    switch (selector) {
      case 'data-attribute':
        selectorStr = `[data-mode="${modeName}"]`;
        break;
      case 'media-query':
        if (modeName === 'dark') {
          selectorStr = '@media (prefers-color-scheme: dark)';
        } else {
          selectorStr = `.${modeName}`;
        }
        break;
      default:
        selectorStr = `.${modeName}`;
    }

    if (selector === 'media-query' && modeName === 'dark') {
      lines.push(`${selectorStr} {`);
      lines.push('  :root {');
    } else {
      lines.push(`${selectorStr} {`);
    }

    if (override.color) {
      for (const [name, token] of Object.entries(override.color)) {
        if (token === undefined) continue;
        const indent = selector === 'media-query' && modeName === 'dark' ? '    ' : '  ';

        if (isColorWithForeground(token)) {
          lines.push(`${indent}--${prefix}color-${name}: ${token.value};`);
          lines.push(`${indent}--${prefix}color-${name}-foreground: ${token.foreground};`);
        } else if (typeof token === 'string') {
          lines.push(`${indent}--${prefix}color-${name}: ${token};`);
        }
      }
    }

    if (override.shadow) {
      for (const [name, value] of Object.entries(override.shadow)) {
        const indent = selector === 'media-query' && modeName === 'dark' ? '    ' : '  ';
        lines.push(`${indent}--${prefix}shadow-${name}: ${value};`);
      }
    }

    if (selector === 'media-query' && modeName === 'dark') {
      lines.push('  }');
    }
    lines.push('}');
    lines.push('');
  }

  return lines;
}

// =============================================================================
// SCSS Generator
// =============================================================================

function generateSCSS(document: LDLTokenDocument, options: GeneratorOptions): string {
  const prefix = options.prefix || '';
  const lines: string[] = [];

  if (options.includeComments !== false) {
    lines.push(`// ${document.$name} - LDL Tokens`);
    if (document.$description) lines.push(`// ${document.$description}`);
    lines.push('');
  }

  // Colors
  if (document.color) {
    if (options.includeComments !== false) lines.push('// Colors');
    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      if (isColorWithForeground(token)) {
        lines.push(`$${prefix}color-${name}: ${token.value};`);
        lines.push(`$${prefix}color-${name}-foreground: ${token.foreground};`);
      } else {
        lines.push(`$${prefix}color-${name}: ${token};`);
      }
    }
    lines.push('');
  }

  // Space
  if (document.space) {
    if (options.includeComments !== false) lines.push('// Spacing');
    for (const [name, value] of Object.entries(document.space)) {
      lines.push(`$${prefix}space-${name}: ${value};`);
    }
    lines.push('');
  }

  // Radius
  if (document.radius) {
    if (options.includeComments !== false) lines.push('// Border Radius');
    for (const [name, value] of Object.entries(document.radius)) {
      lines.push(`$${prefix}radius-${name}: ${value};`);
    }
    lines.push('');
  }

  // Shadow
  if (document.shadow) {
    if (options.includeComments !== false) lines.push('// Shadows');
    for (const [name, value] of Object.entries(document.shadow)) {
      lines.push(`$${prefix}shadow-${name}: ${value};`);
    }
    lines.push('');
  }

  // Font
  if (document.font?.family) {
    if (options.includeComments !== false) lines.push('// Font Families');
    for (const [name, value] of Object.entries(document.font.family)) {
      lines.push(`$${prefix}font-family-${name}: ${value};`);
    }
    lines.push('');
  }

  if (document.font?.size) {
    if (options.includeComments !== false) lines.push('// Font Sizes');
    for (const [name, value] of Object.entries(document.font.size)) {
      lines.push(`$${prefix}font-size-${name}: ${value};`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// =============================================================================
// Tailwind Config Generator
// =============================================================================

function generateTailwindConfig(document: LDLTokenDocument, options: GeneratorOptions): string {
  const config: Record<string, unknown> = {
    theme: {
      extend: {}
    }
  };

  const extend = config.theme as { extend: Record<string, unknown> };

  // Colors
  if (document.color) {
    extend.extend.colors = {};
    const colors = extend.extend.colors as Record<string, unknown>;

    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      if (isColorWithForeground(token)) {
        colors[name] = {
          DEFAULT: token.value,
          foreground: token.foreground
        };
      } else {
        colors[name] = token;
      }
    }
  }

  // Spacing
  if (document.space) {
    extend.extend.spacing = document.space;
  }

  // Border Radius
  if (document.radius) {
    extend.extend.borderRadius = document.radius;
  }

  // Box Shadow
  if (document.shadow) {
    extend.extend.boxShadow = document.shadow;
  }

  // Font Family
  if (document.font?.family) {
    extend.extend.fontFamily = {};
    const families = extend.extend.fontFamily as Record<string, string[]>;
    for (const [name, value] of Object.entries(document.font.family)) {
      families[name] = value.split(',').map(f => f.trim());
    }
  }

  // Font Size
  if (document.font?.size) {
    extend.extend.fontSize = document.font.size;
  }

  // Duration
  if (document.duration) {
    extend.extend.transitionDuration = document.duration;
  }

  // Easing
  if (document.ease) {
    extend.extend.transitionTimingFunction = document.ease;
  }

  const header = options.includeComments !== false
    ? `/** @type {import('tailwindcss').Config} */\n// ${document.$name}\n`
    : '';

  return `${header}module.exports = ${JSON.stringify(config, null, 2)}`;
}

// =============================================================================
// Tailwind v4 CSS Generator
// =============================================================================

function generateTailwindCSS(document: LDLTokenDocument, options: GeneratorOptions): string {
  const lines: string[] = [];

  if (options.includeComments !== false) {
    lines.push(`/* ${document.$name} - Tailwind v4 Theme */`);
    lines.push('');
  }

  lines.push('@import "tailwindcss";');
  lines.push('');
  lines.push('@theme {');

  // Colors
  if (document.color) {
    if (options.includeComments !== false) lines.push('  /* Colors */');
    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      if (isColorWithForeground(token)) {
        lines.push(`  --color-${name}: ${token.value};`);
        lines.push(`  --color-${name}-foreground: ${token.foreground};`);
      } else {
        lines.push(`  --color-${name}: ${token};`);
      }
    }
    lines.push('');
  }

  // Spacing
  if (document.space) {
    if (options.includeComments !== false) lines.push('  /* Spacing */');
    for (const [name, value] of Object.entries(document.space)) {
      lines.push(`  --spacing-${name}: ${value};`);
    }
    lines.push('');
  }

  // Radius
  if (document.radius) {
    if (options.includeComments !== false) lines.push('  /* Border Radius */');
    for (const [name, value] of Object.entries(document.radius)) {
      lines.push(`  --radius-${name}: ${value};`);
    }
    lines.push('');
  }

  // Shadow
  if (document.shadow) {
    if (options.includeComments !== false) lines.push('  /* Shadows */');
    for (const [name, value] of Object.entries(document.shadow)) {
      lines.push(`  --shadow-${name}: ${value};`);
    }
    lines.push('');
  }

  // Font Family
  if (document.font?.family) {
    if (options.includeComments !== false) lines.push('  /* Font Families */');
    for (const [name, value] of Object.entries(document.font.family)) {
      lines.push(`  --font-${name}: ${value};`);
    }
    lines.push('');
  }

  lines.push('}');

  return lines.join('\n');
}

// =============================================================================
// JSON Generator
// =============================================================================

function generateJSON(document: LDLTokenDocument, options: GeneratorOptions): string {
  return JSON.stringify(document, null, 2);
}

// =============================================================================
// TypeScript Generator
// =============================================================================

function generateTypeScript(document: LDLTokenDocument, options: GeneratorOptions): string {
  const lines: string[] = [];

  if (options.includeComments !== false) {
    lines.push(`/**`);
    lines.push(` * ${document.$name} - Design Tokens`);
    if (document.$description) lines.push(` * ${document.$description}`);
    if (document.$version) lines.push(` * @version ${document.$version}`);
    lines.push(` */`);
    lines.push('');
  }

  lines.push('export const tokens = {');

  // Colors
  if (document.color) {
    lines.push('  color: {');
    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      if (isColorWithForeground(token)) {
        lines.push(`    ${formatTSKey(name)}: { value: '${token.value}', foreground: '${token.foreground}' },`);
      } else {
        lines.push(`    ${formatTSKey(name)}: '${token}',`);
      }
    }
    lines.push('  },');
  }

  // Space
  if (document.space) {
    lines.push('  space: {');
    for (const [name, value] of Object.entries(document.space)) {
      lines.push(`    ${formatTSKey(name)}: '${value}',`);
    }
    lines.push('  },');
  }

  // Radius
  if (document.radius) {
    lines.push('  radius: {');
    for (const [name, value] of Object.entries(document.radius)) {
      lines.push(`    ${formatTSKey(name)}: '${value}',`);
    }
    lines.push('  },');
  }

  // Shadow
  if (document.shadow) {
    lines.push('  shadow: {');
    for (const [name, value] of Object.entries(document.shadow)) {
      lines.push(`    ${formatTSKey(name)}: '${value}',`);
    }
    lines.push('  },');
  }

  lines.push('} as const;');
  lines.push('');
  lines.push('export type Tokens = typeof tokens;');

  return lines.join('\n');
}

function formatTSKey(key: string): string {
  // Quote keys with special characters
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
    return key;
  }
  return `'${key}'`;
}

// =============================================================================
// iOS Swift Generator
// =============================================================================

function generateSwift(document: LDLTokenDocument, options: GeneratorOptions): string {
  const name = document.$name.replace(/[^a-zA-Z0-9]/g, '');
  const lines: string[] = [];

  lines.push('import UIKit');
  lines.push('');

  if (options.includeComments !== false) {
    lines.push(`/// ${document.$name} Design Tokens`);
    if (document.$description) lines.push(`/// ${document.$description}`);
  }

  lines.push(`enum ${name}Tokens {`);

  // Colors
  if (document.color) {
    lines.push('    enum Colors {');
    for (const [colorName, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      const swiftName = toCamelCase(colorName);
      const value = isColorWithForeground(token) ? token.value : token;
      const uiColor = hexToSwiftUIColor(value);

      lines.push(`        static let ${swiftName} = ${uiColor}`);

      if (isColorWithForeground(token)) {
        const fgColor = hexToSwiftUIColor(token.foreground);
        lines.push(`        static let ${swiftName}Foreground = ${fgColor}`);
      }
    }
    lines.push('    }');
    lines.push('');
  }

  // Spacing
  if (document.space) {
    lines.push('    enum Spacing {');
    for (const [spaceName, value] of Object.entries(document.space)) {
      const swiftName = toCamelCase(`space_${spaceName}`);
      const cgFloat = parseToCGFloat(value);
      lines.push(`        static let ${swiftName}: CGFloat = ${cgFloat}`);
    }
    lines.push('    }');
    lines.push('');
  }

  // Radius
  if (document.radius) {
    lines.push('    enum Radius {');
    for (const [radiusName, value] of Object.entries(document.radius)) {
      const swiftName = toCamelCase(radiusName);
      const cgFloat = parseToCGFloat(value);
      lines.push(`        static let ${swiftName}: CGFloat = ${cgFloat}`);
    }
    lines.push('    }');
  }

  lines.push('}');

  return lines.join('\n');
}

function hexToSwiftUIColor(hex: string): string {
  if (!hex.startsWith('#')) return `UIColor.clear /* ${hex} */`;

  const cleanHex = hex.slice(1);
  let r: number, g: number, b: number, a: number = 1;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  } else if (cleanHex.length === 8) {
    r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    b = parseInt(cleanHex.slice(4, 6), 16) / 255;
    a = parseInt(cleanHex.slice(6, 8), 16) / 255;
  } else {
    return `UIColor.clear /* ${hex} */`;
  }

  return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: ${a.toFixed(3)})`;
}

function parseToCGFloat(value: string): string {
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num.toString();
  }
  return `0 /* ${value} */`;
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, chr => chr.toLowerCase());
}

// =============================================================================
// Android XML Generator
// =============================================================================

function generateAndroidXML(document: LDLTokenDocument, options: GeneratorOptions): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="utf-8"?>');

  if (options.includeComments !== false) {
    lines.push(`<!-- ${document.$name} Design Tokens -->`);
  }

  lines.push('<resources>');

  // Colors
  if (document.color) {
    lines.push('    <!-- Colors -->');
    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      const androidName = toSnakeCase(name);
      const value = isColorWithForeground(token) ? token.value : token;
      const androidColor = toAndroidColor(value);

      lines.push(`    <color name="color_${androidName}">${androidColor}</color>`);

      if (isColorWithForeground(token)) {
        const fgColor = toAndroidColor(token.foreground);
        lines.push(`    <color name="color_${androidName}_foreground">${fgColor}</color>`);
      }
    }
    lines.push('');
  }

  // Spacing/Dimensions
  if (document.space) {
    lines.push('    <!-- Spacing -->');
    for (const [name, value] of Object.entries(document.space)) {
      const androidName = toSnakeCase(`space_${name}`);
      const dimenValue = toAndroidDimen(value);
      lines.push(`    <dimen name="${androidName}">${dimenValue}</dimen>`);
    }
    lines.push('');
  }

  // Radius
  if (document.radius) {
    lines.push('    <!-- Border Radius -->');
    for (const [name, value] of Object.entries(document.radius)) {
      const androidName = toSnakeCase(`radius_${name}`);
      const dimenValue = toAndroidDimen(value);
      lines.push(`    <dimen name="${androidName}">${dimenValue}</dimen>`);
    }
  }

  lines.push('</resources>');

  return lines.join('\n');
}

function toSnakeCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

function toAndroidColor(color: string): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    if (hex.length === 6) {
      return `#${hex}`;
    }
    if (hex.length === 8) {
      // Android uses ARGB, CSS uses RGBA
      return `#${hex.slice(6)}${hex.slice(0, 6)}`;
    }
  }
  return color;
}

function toAndroidDimen(value: string): string {
  // Convert rem to dp (assuming 1rem = 16dp)
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) {
    const dp = parseFloat(remMatch[1]) * 16;
    return `${dp}dp`;
  }

  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) {
    return `${pxMatch[1]}dp`;
  }

  return value;
}

// =============================================================================
// W3C DTCG Generator
// =============================================================================

function generateW3CDTCG(document: LDLTokenDocument, options: GeneratorOptions): string {
  const output: Record<string, unknown> = {};

  if (document.$name) output.$name = document.$name;
  if (document.$description) output.$description = document.$description;

  // Colors
  if (document.color) {
    output.color = {};
    const colors = output.color as Record<string, unknown>;

    for (const [name, token] of Object.entries(document.color)) {
      if (token === undefined) continue;

      if (isColorWithForeground(token)) {
        colors[name] = {
          $value: token.value,
          $type: 'color',
          $description: token.description
        };
        colors[`${name}-foreground`] = {
          $value: token.foreground,
          $type: 'color'
        };
      } else {
        colors[name] = {
          $value: token,
          $type: 'color'
        };
      }
    }
  }

  // Space
  if (document.space) {
    output.space = {};
    const space = output.space as Record<string, unknown>;

    for (const [name, value] of Object.entries(document.space)) {
      space[name] = {
        $value: value,
        $type: 'dimension'
      };
    }
  }

  // Radius
  if (document.radius) {
    output.radius = {};
    const radius = output.radius as Record<string, unknown>;

    for (const [name, value] of Object.entries(document.radius)) {
      radius[name] = {
        $value: value,
        $type: 'dimension'
      };
    }
  }

  // Shadow
  if (document.shadow) {
    output.shadow = {};
    const shadow = output.shadow as Record<string, unknown>;

    for (const [name, value] of Object.entries(document.shadow)) {
      shadow[name] = {
        $value: value,
        $type: 'shadow'
      };
    }
  }

  return JSON.stringify(output, null, 2);
}

// =============================================================================
// Convenience Exports
// =============================================================================

/**
 * Generate CSS from LDL document
 */
export function toCSS(document: LDLTokenDocument, prefix?: string): string {
  return generate(document, { format: 'css', prefix }).output;
}

/**
 * Generate Tailwind config from LDL document
 */
export function toTailwind(document: LDLTokenDocument): string {
  return generate(document, { format: 'tailwind-config' }).output;
}

/**
 * Generate TypeScript from LDL document
 */
export function toTypeScript(document: LDLTokenDocument): string {
  return generate(document, { format: 'typescript' }).output;
}
