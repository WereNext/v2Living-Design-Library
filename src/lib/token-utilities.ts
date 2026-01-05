/**
 * Token Utilities
 * 
 * Universal design token parser supporting ANY well-structured token format
 * including W3C Design Tokens, Style Dictionary, Tokens Studio, Theo, and custom formats
 * 
 * Supports theme-aware parsing with naming convention: {ThemeName}/{Category}/{TokenName}
 */

export interface TokenSet {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  [key: string]: Record<string, string>; // Support custom categories
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  tokens: TokenSet;
}

export interface MultiThemeSystem {
  name: string;
  description?: string;
  themes: Theme[];
}

// Figma color value type
interface FigmaColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// Figma variable mode value can be color, number, string, or boolean
type FigmaModeValue = FigmaColorValue | number | string | boolean;

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaModeValue>;
}

export interface FigmaCollection {
  id: string;
  name: string;
  modes: Array<{ modeId: string; name: string }>;
  variableIds: string[];
}

export interface FigmaExport {
  name?: string;
  variables?: FigmaVariable[];
  collections?: FigmaCollection[];
}

/**
 * Parse various token formats into a standardized TokenSet
 * Supports:
 * - Standard format (flat object with categories)
 * - W3C Design Tokens Format (nested with $value)
 * - Style Dictionary format
 * - Tokens Studio format
 * - Theo format
 * - Figma Variables
 * - CSS Variables
 * - Any nested structure
 */
// Input types for parseTokens
type TokenInput =
  | { tokens: Partial<TokenSet> }
  | FigmaExport
  | NestedTokenStructure
  | Partial<TokenSet>;

// Nested token structure (W3C, Style Dictionary, etc.)
interface TokenWithValue {
  $value?: string | number;
  value?: string | number;
  $type?: string;
  type?: string;
}

type NestedTokenValue = string | number | TokenWithValue | NestedTokenStructure;

interface NestedTokenStructure {
  [key: string]: NestedTokenValue;
}

export function parseTokens(input: TokenInput): TokenSet {
  const inputRecord = input as Record<string, unknown>;

  // Already in standard format
  if (inputRecord.tokens && typeof inputRecord.tokens === 'object') {
    return normalizeTokenSet(inputRecord.tokens as Partial<TokenSet>);
  }

  // Figma Variables format
  if (inputRecord.variables && Array.isArray(inputRecord.variables)) {
    return parseFigmaVariables(input as FigmaExport);
  }

  // W3C Design Tokens format (nested with $value or value)
  if (isNestedTokenStructure(input)) {
    return parseNestedTokens(input as NestedTokenStructure);
  }

  // Direct token object (flat categories)
  if (inputRecord.colors || inputRecord.spacing || inputRecord.typography) {
    return normalizeTokenSet(input as Partial<TokenSet>);
  }

  throw new Error('Unable to parse token format. Please check the structure.');
}

/**
 * Check if input is a nested token structure (W3C, Style Dictionary, etc.)
 */
function isNestedTokenStructure(obj: unknown): obj is NestedTokenStructure {
  if (!obj || typeof obj !== 'object') return false;

  // Check for nested objects with $value or value properties
  const hasValueProperties = Object.values(obj as Record<string, unknown>).some((val: unknown) => {
    if (val && typeof val === 'object') {
      const valRecord = val as Record<string, unknown>;
      return '$value' in valRecord || 'value' in valRecord || isNestedTokenStructure(val);
    }
    return false;
  });

  return hasValueProperties;
}

/**
 * Parse nested token structures (W3C, Style Dictionary, Tokens Studio, Theo)
 * Supports:
 * - { "color": { "primary": { "$value": "#000", "$type": "color" } } }
 * - { "color": { "primary": { "value": "#000", "type": "color" } } }
 * - { "color": { "primary": "#000" } }
 * - Deeply nested structures with any depth
 */
function parseNestedTokens(input: NestedTokenStructure, _parentPath: string[] = []): TokenSet {
  const tokens: TokenSet = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    shadows: {},
  };

  function traverse(obj: NestedTokenStructure, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];

      // W3C Design Tokens format with $value
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const valueRecord = value as Record<string, unknown>;
        if ('$value' in valueRecord || 'value' in valueRecord) {
          const tokenValue = (valueRecord.$value || valueRecord.value) as string | number;
          const tokenType = (valueRecord.$type || valueRecord.type) as string | undefined;
          const tokenName = currentPath.join('-');

          // Use type if available, otherwise infer from path/name
          const category = inferCategory(tokenType, currentPath.join('/'));
          addTokenToCategory(tokens, category, tokenName, tokenValue);
        } else {
          // Nested object - traverse deeper
          traverse(value as NestedTokenStructure, currentPath);
        }
      }
      // Direct value - use path to determine category
      else if (value !== null && value !== undefined) {
        const tokenName = currentPath.join('-');
        const category = inferCategory(null, currentPath.join('/'));
        addTokenToCategory(tokens, category, tokenName, value);
      }
    }
  }

  traverse(input);
  return tokens;
}

/**
 * Infer token category from type or path
 */
function inferCategory(type: string | null | undefined, path: string): keyof TokenSet {
  const lowerPath = path.toLowerCase();
  const lowerType = (type || '').toLowerCase();
  
  // Explicit type mapping (W3C Design Tokens types)
  if (lowerType === 'color' || lowerType === 'colors') return 'colors';
  if (lowerType === 'dimension' || lowerType === 'spacing' || lowerType === 'space') return 'spacing';
  if (lowerType === 'fontsize' || lowerType === 'fontfamily' || lowerType === 'fontweight' || 
      lowerType === 'lineheight' || lowerType === 'typography') return 'typography';
  if (lowerType === 'borderradius' || lowerType === 'radius') return 'borderRadius';
  if (lowerType === 'shadow' || lowerType === 'boxshadow') return 'shadows';
  
  // Path-based inference
  if (lowerPath.includes('color') || lowerPath.includes('primary') || lowerPath.includes('secondary') ||
      lowerPath.includes('background') || lowerPath.includes('foreground') || lowerPath.includes('accent') ||
      lowerPath.includes('border') && !lowerPath.includes('radius')) return 'colors';
      
  if (lowerPath.includes('spacing') || lowerPath.includes('space') || lowerPath.includes('gap') ||
      lowerPath.includes('padding') || lowerPath.includes('margin') || lowerPath.includes('size')) return 'spacing';
      
  if (lowerPath.includes('font') || lowerPath.includes('text') || lowerPath.includes('typography') ||
      lowerPath.includes('lineheight') || lowerPath.includes('line-height')) return 'typography';
      
  if (lowerPath.includes('radius') || lowerPath.includes('rounded') || lowerPath.includes('border-radius')) return 'borderRadius';
  
  if (lowerPath.includes('shadow') || lowerPath.includes('elevation')) return 'shadows';
  
  // Default to spacing for numeric values
  return 'spacing';
}

/**
 * Add token to appropriate category with normalization
 */
function addTokenToCategory(tokens: TokenSet, category: keyof TokenSet, name: string, value: string | number) {
  const normalizedName = normalizeTokenName(name);

  if (category === 'colors') {
    tokens.colors[normalizedName] = normalizeColorValue(String(value));
  } else if (category === 'spacing') {
    tokens.spacing[normalizedName] = normalizeSpacingValue(value);
  } else if (category === 'borderRadius') {
    tokens.borderRadius[normalizedName] = normalizeSpacingValue(value);
  } else if (category === 'typography') {
    tokens.typography[normalizedName] = String(value);
  } else if (category === 'shadows') {
    tokens.shadows[normalizedName] = String(value);
  }
}

/**
 * Parse Figma Variables export format
 */
export function parseFigmaVariables(figmaExport: FigmaExport): TokenSet {
  const tokens: TokenSet = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    shadows: {},
  };

  if (!figmaExport.variables) {
    throw new Error('No variables found in Figma export');
  }

  figmaExport.variables.forEach((variable) => {
    const { name, resolvedType, valuesByMode } = variable;
    // Get the first mode's value
    const value = Object.values(valuesByMode)[0];

    if (!value) return;

    const normalizedName = normalizeTokenName(name);

    // Categorize by type and name
    if (resolvedType === 'COLOR' || name.toLowerCase().includes('color')) {
      tokens.colors[normalizedName] = normalizeColorValue(value);
    } else if (name.toLowerCase().includes('spacing') || name.toLowerCase().includes('space') || name.toLowerCase().includes('gap')) {
      tokens.spacing[normalizedName] = normalizeSpacingValue(value);
    } else if (name.toLowerCase().includes('font') || name.toLowerCase().includes('text') || name.toLowerCase().includes('typography')) {
      tokens.typography[normalizedName] = String(value);
    } else if (name.toLowerCase().includes('radius') || name.toLowerCase().includes('rounded')) {
      tokens.borderRadius[normalizedName] = normalizeSpacingValue(value);
    } else if (name.toLowerCase().includes('shadow') || name.toLowerCase().includes('elevation')) {
      tokens.shadows[normalizedName] = String(value);
    } else {
      // Default to spacing for numeric values
      if (typeof value === 'number' || !isNaN(parseFloat(value))) {
        tokens.spacing[normalizedName] = normalizeSpacingValue(value);
      }
    }
  });

  return tokens;
}

/**
 * Parse CSS variables format
 */
export function parseCSSVariables(cssText: string): TokenSet {
  const tokens: TokenSet = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    shadows: {},
  };

  const lines = cssText.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/--([^:]+):\s*([^;]+);?/);
    if (!match) return;

    const [, rawName, rawValue] = match;
    const name = rawName.trim();
    const value = rawValue.trim();

    // Categorize by name
    if (name.includes('color') || name.includes('primary') || name.includes('secondary') || 
        name.includes('accent') || name.includes('background') || name.includes('foreground') ||
        name.includes('border') || name.includes('destructive') || name.includes('muted')) {
      tokens.colors[name] = normalizeColorValue(value);
    } else if (name.includes('spacing') || name.includes('space') || name.includes('gap')) {
      tokens.spacing[name.replace(/^space-/, '')] = normalizeSpacingValue(value);
    } else if (name.includes('font') || name.includes('text') || name.includes('line-height')) {
      tokens.typography[name] = value;
    } else if (name.includes('radius') || name.includes('rounded')) {
      tokens.borderRadius[name.replace(/^radius-/, '')] = normalizeSpacingValue(value);
    } else if (name.includes('shadow')) {
      tokens.shadows[name.replace(/^shadow-/, '')] = value;
    }
  });

  return tokens;
}

/**
 * Normalize token names (remove prefixes, convert to kebab-case)
 */
function normalizeTokenName(name: string): string {
  return name
    .replace(/^(color|spacing|font|text|radius|shadow)-/gi, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Normalize color values to HSL format
 */
export function normalizeColorValue(color: string): string {
  // Already in HSL space-separated format
  if (/^\d+\.?\d*\s+\d+\.?\d*%\s+\d+\.?\d*%$/.test(color.trim())) {
    return color.trim();
  }

  // Remove hsl() wrapper if present
  if (color.includes('hsl(')) {
    const match = color.match(/hsl\(([^)]+)\)/);
    if (match) {
      return match[1].replace(/,\s*/g, ' ').trim();
    }
  }

  // Hex color - convert to HSL
  if (color.startsWith('#')) {
    return hexToHSL(color);
  }

  // RGB format
  if (color.includes('rgb')) {
    return rgbToHSL(color);
  }

  // Return as-is if we can't parse
  return color;
}

/**
 * Normalize spacing values to rem
 */
function normalizeSpacingValue(value: string | number): string {
  if (typeof value === 'number') {
    // Assume pixels, convert to rem (16px = 1rem)
    return `${value / 16}rem`;
  }

  const str = String(value);

  // Already in rem
  if (str.includes('rem')) {
    return str;
  }

  // Convert px to rem
  if (str.includes('px')) {
    const px = parseFloat(str);
    return `${px / 16}rem`;
  }

  // Return as-is
  return str;
}

/**
 * Convert hex to HSL space-separated format
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Convert RGB to HSL space-separated format
 */
function rgbToHSL(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/);
  if (!match) return rgb;

  const r = parseInt(match[1]) / 255;
  const g = parseInt(match[2]) / 255;
  const b = parseInt(match[3]) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Normalize a token set to ensure all categories exist
 */
function normalizeTokenSet(tokens: Partial<TokenSet>): TokenSet {
  return {
    colors: tokens.colors || {},
    spacing: tokens.spacing || {},
    typography: tokens.typography || {},
    borderRadius: tokens.borderRadius || {},
    shadows: tokens.shadows || {},
  };
}

/**
 * Convert TokenSet to CSS variables
 */
export function tokenSetToCSS(tokens: TokenSet, options: { includeRoot?: boolean } = {}): string {
  const { includeRoot = true } = options;
  
  let css = includeRoot ? ':root {\n' : '';

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    css += `  --space-${key}: ${value};\n`;
  });

  // Typography
  Object.entries(tokens.typography).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });

  // Border Radius
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    const cssKey = key.startsWith('radius-') ? key : `radius-${key}`;
    css += `  --${cssKey}: ${value};\n`;
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    const cssKey = key.startsWith('shadow-') ? key : `shadow-${key}`;
    css += `  --${cssKey}: ${value};\n`;
  });

  css += includeRoot ? '}' : '';
  return css;
}

/**
 * Apply tokens to document
 */
export function applyTokensToDocument(tokens: TokenSet): void {
  const root = document.documentElement;

  // Apply colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    const cssKey = key.startsWith('space-') ? key : `space-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });

  // Apply typography
  Object.entries(tokens.typography).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply border radius
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    const cssKey = key.startsWith('radius-') ? key : `radius-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });

  // Apply shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    const cssKey = key.startsWith('shadow-') ? key : `shadow-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });
}

/**
 * Get tokens currently applied to document
 */
export function getTokensFromDocument(): TokenSet {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  const tokens: TokenSet = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    shadows: {},
  };

  // Common color token names
  const colorTokens = [
    'background', 'foreground', 'primary', 'primary-foreground',
    'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
    'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
    'border', 'input', 'ring', 'card', 'card-foreground'
  ];

  colorTokens.forEach(token => {
    const value = computedStyle.getPropertyValue(`--${token}`).trim();
    if (value) {
      tokens.colors[token] = value;
    }
  });

  // Common spacing tokens
  ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].forEach(size => {
    const value = computedStyle.getPropertyValue(`--space-${size}`).trim();
    if (value) {
      tokens.spacing[size] = value;
    }
  });

  // Common radius tokens
  ['sm', 'md', 'lg', 'xl', 'full'].forEach(size => {
    const value = computedStyle.getPropertyValue(`--radius-${size}`).trim();
    if (value) {
      tokens.borderRadius[size] = value;
    }
  });

  // Common shadow tokens
  ['sm', 'md', 'lg', 'xl'].forEach(size => {
    const value = computedStyle.getPropertyValue(`--shadow-${size}`).trim();
    if (value) {
      tokens.shadows[size] = value;
    }
  });

  return tokens;
}

/**
 * Validate token set
 */
export function validateTokenSet(tokens: Partial<TokenSet>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if at least one category has tokens
  const hasTokens = Object.values(tokens).some(
    category => category && Object.keys(category).length > 0
  );

  if (!hasTokens) {
    errors.push('Token set is empty. Please provide at least one token category.');
  }

  // Validate color format
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (!value || typeof value !== 'string') {
        errors.push(`Invalid color value for "${key}"`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate component code with token references
 */
export function generateComponentCodeWithTokens(
  componentName: string,
  framework: 'react' | 'vue' | 'svelte' | 'html',
  tokens: TokenSet
): string {
  const cssVars = tokenSetToCSS(tokens);

  const templates: Record<string, string> = {
    react: `import React from 'react';

// ${componentName} Component
// This component uses design tokens from your design system

const ${componentName} = ({ children, ...props }) => {
  return (
    <button 
      className="bg-primary text-primary-foreground rounded-[var(--radius-md)] px-[var(--space-md)] py-[var(--space-sm)] hover:opacity-90 transition-all"
      {...props}
    >
      {children}
    </button>
  );
};

// Required CSS Variables:
// Add these to your global stylesheet
/*
${cssVars}
*/

export default ${componentName};`,
    
    vue: `<template>
  <button 
    class="bg-primary text-primary-foreground rounded-[var(--radius-md)] px-[var(--space-md)] py-[var(--space-sm)] hover:opacity-90 transition-all"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: '${componentName}',
};
</script>

<style>
/* Required CSS Variables */
${cssVars}
</style>`,
    
    svelte: `<button 
  class="bg-primary text-primary-foreground rounded-[var(--radius-md)] px-[var(--space-md)] py-[var(--space-sm)] hover:opacity-90 transition-all"
>
  <slot />
</button>

<style>
/* Required CSS Variables */
:global(:root) {
${cssVars.split('\n').filter(l => l.trim() && !l.includes(':root')).map(l => '  ' + l).join('\n')}
}
</style>`,
    
    html: `<!-- ${componentName} -->
<button class="btn-primary">
  Button Text
</button>

<style>
/* Required CSS Variables */
${cssVars}

.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>`,
  };

  return templates[framework] || templates.react;
}

/**
 * Parse theme-aware tokens with naming convention: {ThemeName}/{Category}/{TokenName}
 *
 * Examples:
 * - "Light/colors/primary" -> Theme: Light, Category: colors, Token: primary
 * - "Dark/spacing/md" -> Theme: Dark, Category: spacing, Token: md
 *
 * Returns a MultiThemeSystem with all themes grouped
 */
export function parseThemeAwareTokens(input: Record<string, string | number>): MultiThemeSystem {
  const themeMap = new Map<string, TokenSet>();
  
  // Process each token path
  Object.entries(input).forEach(([path, value]) => {
    const parts = path.split('/');
    
    // Check if this is theme-aware (has at least 2 segments)
    if (parts.length >= 2) {
      const themeName = parts[0];
      const category = parts[1];
      const tokenName = parts.slice(2).join('-') || category;
      
      // Initialize theme if doesn't exist
      if (!themeMap.has(themeName)) {
        themeMap.set(themeName, {
          colors: {},
          spacing: {},
          typography: {},
          borderRadius: {},
          shadows: {},
        });
      }
      
      const theme = themeMap.get(themeName)!;
      
      // Categorize the token
      const normalizedValue = categorizeAndNormalizeToken(category, tokenName, value);
      
      if (normalizedValue.category === 'colors') {
        theme.colors[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'spacing') {
        theme.spacing[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'typography') {
        theme.typography[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'borderRadius') {
        theme.borderRadius[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'shadows') {
        theme.shadows[normalizedValue.name] = normalizedValue.value;
      }
    } else {
      // Single segment - treat as single-theme fallback
      const singleThemeName = 'Default';
      
      if (!themeMap.has(singleThemeName)) {
        themeMap.set(singleThemeName, {
          colors: {},
          spacing: {},
          typography: {},
          borderRadius: {},
          shadows: {},
        });
      }
      
      const theme = themeMap.get(singleThemeName)!;
      const tokenName = parts[0];
      
      // Try to categorize by name
      const normalizedValue = categorizeAndNormalizeToken('auto', tokenName, value);
      
      if (normalizedValue.category === 'colors') {
        theme.colors[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'spacing') {
        theme.spacing[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'typography') {
        theme.typography[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'borderRadius') {
        theme.borderRadius[normalizedValue.name] = normalizedValue.value;
      } else if (normalizedValue.category === 'shadows') {
        theme.shadows[normalizedValue.name] = normalizedValue.value;
      }
    }
  });
  
  // Convert map to themes array
  const themes: Theme[] = Array.from(themeMap.entries()).map(([name, tokens]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    tokens
  }));
  
  return {
    name: 'Imported Design System',
    description: `Design system with ${themes.length} theme${themes.length !== 1 ? 's' : ''}`,
    themes
  };
}

/**
 * Categorize and normalize a token based on category hint and token name
 */
function categorizeAndNormalizeToken(
  categoryHint: string,
  tokenName: string,
  value: string | number
): { category: keyof TokenSet; name: string; value: string } {
  const lowerCategory = categoryHint.toLowerCase();
  const lowerName = tokenName.toLowerCase();
  
  // Determine category
  let category: keyof TokenSet = 'colors'; // default
  
  if (lowerCategory.includes('color') || lowerCategory === 'colors' ||
      lowerName.includes('color') || lowerName.includes('primary') || 
      lowerName.includes('secondary') || lowerName.includes('background') ||
      lowerName.includes('foreground') || lowerName.includes('accent') ||
      lowerName.includes('border') || lowerName.includes('text')) {
    category = 'colors';
  } else if (lowerCategory.includes('spacing') || lowerCategory.includes('space') ||
             lowerName.includes('spacing') || lowerName.includes('space') ||
             lowerName.includes('gap') || lowerName.includes('padding') ||
             lowerName.includes('margin')) {
    category = 'spacing';
  } else if (lowerCategory.includes('typography') || lowerCategory.includes('font') ||
             lowerCategory.includes('text') || lowerName.includes('font') ||
             lowerName.includes('text') || lowerName.includes('line-height')) {
    category = 'typography';
  } else if (lowerCategory.includes('radius') || lowerCategory.includes('borderradius') ||
             lowerName.includes('radius') || lowerName.includes('rounded')) {
    category = 'borderRadius';
  } else if (lowerCategory.includes('shadow') || lowerCategory.includes('elevation') ||
             lowerName.includes('shadow') || lowerName.includes('elevation')) {
    category = 'shadows';
  }
  
  // Normalize value based on category
  let normalizedValue: string;
  
  if (category === 'colors') {
    normalizedValue = normalizeColorValue(String(value));
  } else if (category === 'spacing' || category === 'borderRadius') {
    normalizedValue = normalizeSpacingValue(value);
  } else {
    normalizedValue = String(value);
  }
  
  // Clean up token name
  const cleanName = tokenName
    .replace(/^(color|spacing|font|text|radius|shadow)-/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  return {
    category,
    name: cleanName,
    value: normalizedValue
  };
}

/**
 * Check if tokens follow theme-aware naming convention
 */
export function isThemeAware(input: Record<string, unknown>): boolean {
  const paths = Object.keys(input);
  
  // Check if majority of paths have at least 2 segments (theme/category)
  const themeAwarePaths = paths.filter(path => path.split('/').length >= 2);
  
  return themeAwarePaths.length > paths.length * 0.5; // > 50% threshold
}