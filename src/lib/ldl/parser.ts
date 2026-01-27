/**
 * LDL Token Parser
 *
 * Parses LDL token files and converts from other formats (W3C DTCG, Figma, Tokens Studio)
 */

import {
  LDLTokenDocument,
  LDLColorTokens,
  LDLColorToken,
  LDLColorWithForeground,
  LDLSpaceTokens,
  LDLRadiusTokens,
  LDLShadowTokens,
  LDLFontTokens,
  LDLDurationTokens,
  LDLEaseTokens,
  LDLModeTokens,
  InputFormat,
  ParseResult,
  isColorWithForeground
} from './types';

// =============================================================================
// Format Detection
// =============================================================================

/**
 * Detect the format of input JSON
 */
export function detectFormat(input: unknown): InputFormat {
  if (!input || typeof input !== 'object') {
    return 'unknown';
  }

  const obj = input as Record<string, unknown>;

  // LDL format - has $name and uses our category structure
  if (obj.$name && (obj.color || obj.space || obj.radius)) {
    return 'ldl';
  }

  // Design System format - has themes array with nested tokens
  // This is the custom format used by Living Design Library
  if (obj.themes && Array.isArray(obj.themes) && obj.themes.length > 0) {
    return 'ldl'; // Treat as LDL since we'll convert it
  }

  // W3C DTCG - uses $value and $type
  if (hasW3CTokens(obj)) {
    return 'w3c-dtcg';
  }

  // Figma Variables API - has meta.variables structure
  if (obj.meta && typeof obj.meta === 'object' && 'variables' in (obj.meta as object)) {
    return 'figma-variables';
  }

  // Tokens Studio - has $themes or specific structure
  if (obj.$themes || obj.$metadata || (obj.global && typeof obj.global === 'object')) {
    return 'tokens-studio';
  }

  // Style Dictionary - has nested structure with value properties
  if (hasStyleDictionaryTokens(obj)) {
    return 'style-dictionary';
  }

  return 'unknown';
}

function hasW3CTokens(obj: Record<string, unknown>): boolean {
  const check = (o: unknown): boolean => {
    if (!o || typeof o !== 'object') return false;
    const record = o as Record<string, unknown>;
    if ('$value' in record) return true;
    return Object.values(record).some(v => check(v));
  };
  return check(obj);
}

function hasStyleDictionaryTokens(obj: Record<string, unknown>): boolean {
  const check = (o: unknown): boolean => {
    if (!o || typeof o !== 'object') return false;
    const record = o as Record<string, unknown>;
    if ('value' in record && !('$value' in record) && !('foreground' in record)) return true;
    return Object.values(record).some(v => check(v));
  };
  return check(obj);
}

// =============================================================================
// Main Parser
// =============================================================================

/**
 * Parse any supported format into LDL
 */
export function parse(input: string | object): ParseResult {
  const errors: string[] = [];

  // Parse JSON if string
  let data: unknown;
  if (typeof input === 'string') {
    try {
      data = JSON.parse(input);
    } catch (e) {
      return {
        success: false,
        format: 'unknown',
        errors: [`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`]
      };
    }
  } else {
    data = input;
  }

  // Detect format
  const format = detectFormat(data);

  // Parse based on format
  let document: LDLTokenDocument | undefined;

  try {
    switch (format) {
      case 'ldl':
        document = parseLDL(data as Record<string, unknown>);
        break;
      case 'w3c-dtcg':
        document = parseW3CDTCG(data as Record<string, unknown>);
        break;
      case 'figma-variables':
        document = parseFigmaVariables(data as Record<string, unknown>);
        break;
      case 'tokens-studio':
        document = parseTokensStudio(data as Record<string, unknown>);
        break;
      case 'style-dictionary':
        document = parseStyleDictionary(data as Record<string, unknown>);
        break;
      default:
        // Try generic parsing
        document = parseGeneric(data as Record<string, unknown>);
    }
  } catch (e) {
    errors.push(`Parse error: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  return {
    success: !!document && errors.length === 0,
    format,
    document,
    errors
  };
}

// =============================================================================
// LDL Native Parser
// =============================================================================

function parseLDL(data: Record<string, unknown>): LDLTokenDocument {
  // Handle design system format with themes array
  if (data.themes && Array.isArray(data.themes) && data.themes.length > 0) {
    return parseDesignSystemFormat(data);
  }

  const doc: LDLTokenDocument = {
    $name: String(data.$name || 'Untitled')
  };

  if (data.$schema) doc.$schema = String(data.$schema);
  if (data.$description) doc.$description = String(data.$description);
  if (data.$version) doc.$version = String(data.$version);

  if (data.color) doc.color = data.color as LDLColorTokens;
  if (data.space) doc.space = data.space as LDLSpaceTokens;
  if (data.radius) doc.radius = data.radius as LDLRadiusTokens;
  if (data.shadow) doc.shadow = data.shadow as LDLShadowTokens;
  if (data.font) doc.font = data.font as LDLFontTokens;
  if (data.duration) doc.duration = data.duration as LDLDurationTokens;
  if (data.ease) doc.ease = data.ease as LDLEaseTokens;
  if (data.mode) doc.mode = data.mode as LDLModeTokens;

  return doc;
}

// =============================================================================
// Design System Format Parser (themes array)
// =============================================================================

/**
 * Parse Living Design Library's design system format
 * This format has tokens nested inside a themes array:
 * { name: "...", themes: [{ colors: {...}, spacing: {...}, ... }] }
 */
function parseDesignSystemFormat(data: Record<string, unknown>): LDLTokenDocument {
  const themes = data.themes as Array<Record<string, unknown>>;
  const theme = themes[0]; // Use first theme

  const doc: LDLTokenDocument = {
    $name: String(data.name || theme.name || 'Imported Design System')
  };

  if (data.description) doc.$description = String(data.description);
  if (data.version) doc.$version = String(data.version);

  // Extract colors
  if (theme.colors && typeof theme.colors === 'object') {
    const colors: LDLColorTokens = {};
    for (const [key, value] of Object.entries(theme.colors as Record<string, string>)) {
      colors[key] = createColorToken(value);
    }
    if (Object.keys(colors).length > 0) doc.color = colors;
  }

  // Extract spacing
  if (theme.spacing && typeof theme.spacing === 'object') {
    doc.space = theme.spacing as LDLSpaceTokens;
  }

  // Extract border radius
  if (theme.borderRadius && typeof theme.borderRadius === 'object') {
    doc.radius = theme.borderRadius as LDLRadiusTokens;
  }

  // Extract shadows
  if (theme.shadows && typeof theme.shadows === 'object') {
    doc.shadow = theme.shadows as LDLShadowTokens;
  }

  // Extract typography
  if (theme.typography && typeof theme.typography === 'object') {
    const typography = theme.typography as Record<string, string>;
    const fontFamily: Record<string, string> = {};

    for (const [key, value] of Object.entries(typography)) {
      // font-sans, font-serif, font-mono -> sans, serif, mono
      const cleanKey = key.replace(/^font-/, '');
      fontFamily[cleanKey] = value;
    }

    if (Object.keys(fontFamily).length > 0) {
      doc.font = { family: fontFamily };
    }
  }

  return doc;
}

// =============================================================================
// W3C DTCG Parser
// =============================================================================

function parseW3CDTCG(data: Record<string, unknown>): LDLTokenDocument {
  const doc: LDLTokenDocument = {
    $name: String(data.$name || data.name || 'Imported W3C Tokens')
  };

  if (data.$description) doc.$description = String(data.$description);

  const colors: LDLColorTokens = {};
  const space: LDLSpaceTokens = {};
  const radius: LDLRadiusTokens = {};
  const shadow: LDLShadowTokens = {};
  const fontFamily: Record<string, string> = {};
  const fontSize: Record<string, string> = {};
  const fontWeight: Record<string, string> = {};
  const duration: LDLDurationTokens = {};
  const ease: LDLEaseTokens = {};

  // Recursively extract tokens
  const extract = (obj: Record<string, unknown>, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;

      const path = prefix ? `${prefix}-${key}` : key;

      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;

        if ('$value' in record) {
          const tokenValue = record.$value;
          const tokenType = record.$type as string | undefined;
          const stringValue = stringifyValue(tokenValue);

          // Categorize by type or infer from name
          if (tokenType === 'color' || isColorName(path)) {
            colors[path] = createColorToken(stringValue);
          } else if (tokenType === 'dimension') {
            if (isRadiusName(path)) {
              radius[path] = stringValue;
            } else {
              space[path] = stringValue;
            }
          } else if (tokenType === 'shadow') {
            shadow[path] = stringValue;
          } else if (tokenType === 'fontFamily') {
            fontFamily[path] = stringValue;
          } else if (tokenType === 'fontSize') {
            fontSize[path] = stringValue;
          } else if (tokenType === 'fontWeight') {
            fontWeight[path] = stringValue;
          } else if (tokenType === 'duration') {
            duration[path] = stringValue;
          } else if (tokenType === 'cubicBezier') {
            ease[path] = stringValue;
          }
        } else {
          extract(record, path);
        }
      }
    }
  };

  extract(data);

  if (Object.keys(colors).length > 0) doc.color = colors;
  if (Object.keys(space).length > 0) doc.space = space;
  if (Object.keys(radius).length > 0) doc.radius = radius;
  if (Object.keys(shadow).length > 0) doc.shadow = shadow;
  if (Object.keys(duration).length > 0) doc.duration = duration;
  if (Object.keys(ease).length > 0) doc.ease = ease;

  if (Object.keys(fontFamily).length > 0 || Object.keys(fontSize).length > 0 || Object.keys(fontWeight).length > 0) {
    doc.font = {};
    if (Object.keys(fontFamily).length > 0) doc.font.family = fontFamily;
    if (Object.keys(fontSize).length > 0) doc.font.size = fontSize;
    if (Object.keys(fontWeight).length > 0) doc.font.weight = fontWeight;
  }

  return doc;
}

// =============================================================================
// Figma Variables API Parser
// =============================================================================

interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, unknown>;
}

interface FigmaMeta {
  variables: Record<string, FigmaVariable>;
  variableCollections?: Record<string, { name: string; modes: Array<{ modeId: string; name: string }> }>;
}

function parseFigmaVariables(data: Record<string, unknown>): LDLTokenDocument {
  const meta = data.meta as FigmaMeta | undefined;

  if (!meta?.variables) {
    throw new Error('Invalid Figma Variables format: missing meta.variables');
  }

  const doc: LDLTokenDocument = {
    $name: 'Imported Figma Variables'
  };

  const colors: LDLColorTokens = {};
  const space: LDLSpaceTokens = {};
  const radius: LDLRadiusTokens = {};

  // Get first mode ID for default values
  const getFirstModeValue = (variable: FigmaVariable): unknown => {
    const modeIds = Object.keys(variable.valuesByMode);
    return modeIds.length > 0 ? variable.valuesByMode[modeIds[0]] : undefined;
  };

  for (const variable of Object.values(meta.variables)) {
    // Clean up name: "colors/primary" -> "primary"
    const nameParts = variable.name.split('/');
    const tokenName = nameParts[nameParts.length - 1].toLowerCase().replace(/\s+/g, '-');
    const category = nameParts.length > 1 ? nameParts[0].toLowerCase() : '';

    const value = getFirstModeValue(variable);

    if (variable.resolvedType === 'COLOR' && value) {
      const colorValue = value as { r: number; g: number; b: number; a: number };
      const hex = rgbaToHex(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
      colors[tokenName] = createColorToken(hex);
    } else if (variable.resolvedType === 'FLOAT' && typeof value === 'number') {
      const pxValue = `${value}px`;
      if (category.includes('radius') || tokenName.includes('radius')) {
        radius[tokenName] = pxValue;
      } else {
        space[tokenName] = pxValue;
      }
    }
  }

  if (Object.keys(colors).length > 0) doc.color = colors;
  if (Object.keys(space).length > 0) doc.space = space;
  if (Object.keys(radius).length > 0) doc.radius = radius;

  return doc;
}

// =============================================================================
// Tokens Studio Parser
// =============================================================================

function parseTokensStudio(data: Record<string, unknown>): LDLTokenDocument {
  const doc: LDLTokenDocument = {
    $name: 'Imported Tokens Studio'
  };

  // Find the main token set (could be in 'global' or a named theme)
  let tokenSet: Record<string, unknown> = {};

  if (data.global && typeof data.global === 'object') {
    tokenSet = data.global as Record<string, unknown>;
  } else {
    // Find first non-metadata key
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith('$') && typeof value === 'object' && value !== null) {
        tokenSet = value as Record<string, unknown>;
        break;
      }
    }
  }

  const colors: LDLColorTokens = {};
  const space: LDLSpaceTokens = {};
  const radius: LDLRadiusTokens = {};
  const shadow: LDLShadowTokens = {};

  // Process each category
  for (const [category, tokens] of Object.entries(tokenSet)) {
    if (!tokens || typeof tokens !== 'object') continue;

    const processTokens = (obj: Record<string, unknown>, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}-${key}` : key;

        if (value && typeof value === 'object') {
          const record = value as Record<string, unknown>;

          if ('value' in record) {
            const tokenValue = String(record.value);
            const tokenType = record.type as string | undefined;

            if (tokenType === 'color' || category === 'color' || category === 'colors') {
              colors[path] = createColorToken(tokenValue);
            } else if (tokenType === 'spacing' || category === 'spacing' || category === 'space') {
              space[path] = tokenValue;
            } else if (tokenType === 'borderRadius' || category === 'borderRadius' || category === 'radii') {
              radius[path] = tokenValue;
            } else if (tokenType === 'boxShadow' || category === 'boxShadow' || category === 'shadows') {
              shadow[path] = tokenValue;
            }
          } else {
            processTokens(record, path);
          }
        }
      }
    };

    processTokens(tokens as Record<string, unknown>);
  }

  if (Object.keys(colors).length > 0) doc.color = colors;
  if (Object.keys(space).length > 0) doc.space = space;
  if (Object.keys(radius).length > 0) doc.radius = radius;
  if (Object.keys(shadow).length > 0) doc.shadow = shadow;

  return doc;
}

// =============================================================================
// Style Dictionary Parser
// =============================================================================

function parseStyleDictionary(data: Record<string, unknown>): LDLTokenDocument {
  const doc: LDLTokenDocument = {
    $name: 'Imported Style Dictionary'
  };

  const colors: LDLColorTokens = {};
  const space: LDLSpaceTokens = {};
  const radius: LDLRadiusTokens = {};
  const shadow: LDLShadowTokens = {};

  const extract = (obj: Record<string, unknown>, prefix = '', category = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}-${key}` : key;
      const currentCategory = category || key.toLowerCase();

      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;

        if ('value' in record && !('$value' in record)) {
          const tokenValue = String(record.value);

          if (currentCategory.includes('color')) {
            colors[path] = createColorToken(tokenValue);
          } else if (currentCategory.includes('space') || currentCategory.includes('size')) {
            space[path] = tokenValue;
          } else if (currentCategory.includes('radius') || currentCategory.includes('radii')) {
            radius[path] = tokenValue;
          } else if (currentCategory.includes('shadow')) {
            shadow[path] = tokenValue;
          }
        } else {
          extract(record, path, currentCategory);
        }
      }
    }
  };

  extract(data);

  if (Object.keys(colors).length > 0) doc.color = colors;
  if (Object.keys(space).length > 0) doc.space = space;
  if (Object.keys(radius).length > 0) doc.radius = radius;
  if (Object.keys(shadow).length > 0) doc.shadow = shadow;

  return doc;
}

// =============================================================================
// Generic Parser (fallback)
// =============================================================================

function parseGeneric(data: Record<string, unknown>): LDLTokenDocument {
  const doc: LDLTokenDocument = {
    $name: String(data.name || data.$name || 'Imported Tokens')
  };

  // Try to find color-like objects
  const colorKeys = ['colors', 'color', 'palette'];
  const spaceKeys = ['spacing', 'space', 'sizes'];
  const radiusKeys = ['radius', 'radii', 'borderRadius'];
  const shadowKeys = ['shadows', 'shadow', 'boxShadow'];

  for (const key of colorKeys) {
    if (data[key] && typeof data[key] === 'object') {
      doc.color = extractSimpleTokens(data[key] as Record<string, unknown>, 'color');
      break;
    }
  }

  for (const key of spaceKeys) {
    if (data[key] && typeof data[key] === 'object') {
      doc.space = extractSimpleTokens(data[key] as Record<string, unknown>, 'space') as LDLSpaceTokens;
      break;
    }
  }

  for (const key of radiusKeys) {
    if (data[key] && typeof data[key] === 'object') {
      doc.radius = extractSimpleTokens(data[key] as Record<string, unknown>, 'radius') as LDLRadiusTokens;
      break;
    }
  }

  for (const key of shadowKeys) {
    if (data[key] && typeof data[key] === 'object') {
      doc.shadow = extractSimpleTokens(data[key] as Record<string, unknown>, 'shadow') as LDLShadowTokens;
      break;
    }
  }

  return doc;
}

function extractSimpleTokens(obj: Record<string, unknown>, type: string): Record<string, LDLColorToken | string> {
  const result: Record<string, LDLColorToken | string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (type === 'color') {
        result[key] = createColorToken(value);
      } else {
        result[key] = value;
      }
    } else if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if ('value' in record) {
        const tokenValue = String(record.value);
        if (type === 'color') {
          result[key] = createColorToken(tokenValue);
        } else {
          result[key] = tokenValue;
        }
      }
    }
  }

  return result;
}

// =============================================================================
// Utility Functions
// =============================================================================

function stringifyValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    // Cubic bezier
    if (value.length === 4 && value.every(v => typeof v === 'number')) {
      return `cubic-bezier(${value.join(', ')})`;
    }
    return value.join(', ');
  }
  if (value && typeof value === 'object') {
    // RGBA color object
    const rgba = value as { r?: number; g?: number; b?: number; a?: number };
    if ('r' in rgba && 'g' in rgba && 'b' in rgba) {
      return rgbaToHex(rgba.r ?? 0, rgba.g ?? 0, rgba.b ?? 0, rgba.a ?? 1);
    }
    // Dimension object
    const dim = value as { value?: number; unit?: string };
    if ('value' in dim && 'unit' in dim) {
      return `${dim.value}${dim.unit}`;
    }
  }
  return String(value);
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  // Figma uses 0-1 range
  const toHex = (n: number) => {
    const val = Math.round(n * 255);
    return val.toString(16).padStart(2, '0');
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (a < 1) {
    return `${hex}${toHex(a)}`;
  }

  return hex;
}

function createColorToken(value: string): LDLColorToken {
  // Create color with auto-generated foreground
  const foreground = getContrastingColor(value);

  return {
    value,
    foreground
  };
}

function getContrastingColor(color: string): string {
  // Simple luminance check - could be enhanced with proper WCAG calculation
  try {
    const hex = color.replace('#', '').slice(0, 6);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  } catch {
    return '#000000';
  }
}

function isColorName(name: string): boolean {
  const colorKeywords = ['color', 'background', 'foreground', 'primary', 'secondary', 'accent', 'border', 'text', 'fill', 'stroke'];
  const lower = name.toLowerCase();
  return colorKeywords.some(kw => lower.includes(kw));
}

function isRadiusName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes('radius') || lower.includes('radii') || lower.includes('corner');
}

// =============================================================================
// Export Helpers
// =============================================================================

/**
 * Parse and get document or throw
 */
export function parseOrThrow(input: string | object): LDLTokenDocument {
  const result = parse(input);
  if (!result.success || !result.document) {
    throw new Error(result.errors.join(', ') || 'Failed to parse tokens');
  }
  return result.document;
}

/**
 * Try to parse, return undefined on failure
 */
export function tryParse(input: string | object): LDLTokenDocument | undefined {
  const result = parse(input);
  return result.document;
}
