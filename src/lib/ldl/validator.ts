/**
 * LDL Token Validator
 *
 * Validates LDL token documents against the specification
 */

import {
  LDLTokenDocument,
  LDLColorTokens,
  LDLColorToken,
  LDLModeTokens,
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
  isColorWithForeground,
  RESERVED_COLOR_NAMES,
  TOKEN_CATEGORIES
} from './types';

// =============================================================================
// Main Validator
// =============================================================================

/**
 * Validate an LDL token document
 */
export function validate(document: LDLTokenDocument): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Required fields
  if (!document.$name) {
    issues.push(error('$name', '$name is required'));
  } else if (typeof document.$name !== 'string' || document.$name.trim() === '') {
    issues.push(error('$name', '$name must be a non-empty string'));
  }

  // Validate $version format if present
  if (document.$version && !isValidSemver(document.$version)) {
    issues.push(warning('$version', `$version "${document.$version}" is not valid semver format`, 'Use format like "1.0.0"'));
  }

  // Validate $schema URL if present
  if (document.$schema && !isValidUrl(document.$schema)) {
    issues.push(warning('$schema', '$schema should be a valid URL'));
  }

  // Validate each category
  if (document.color) {
    issues.push(...validateColors(document.color, 'color'));
  }

  if (document.space) {
    issues.push(...validateSpace(document.space, 'space'));
  }

  if (document.radius) {
    issues.push(...validateRadius(document.radius, 'radius'));
  }

  if (document.shadow) {
    issues.push(...validateShadow(document.shadow, 'shadow'));
  }

  if (document.font) {
    issues.push(...validateFont(document.font, 'font'));
  }

  if (document.duration) {
    issues.push(...validateDuration(document.duration, 'duration'));
  }

  if (document.ease) {
    issues.push(...validateEase(document.ease, 'ease'));
  }

  if (document.mode) {
    issues.push(...validateModes(document.mode, document, 'mode'));
  }

  // Check for token references
  issues.push(...validateReferences(document));

  return {
    valid: !issues.some(i => i.severity === 'error'),
    issues,
    document: issues.some(i => i.severity === 'error') ? undefined : document
  };
}

// =============================================================================
// Category Validators
// =============================================================================

function validateColors(colors: LDLColorTokens, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, token] of Object.entries(colors)) {
    if (token === undefined) continue;

    const path = `${basePath}.${name}`;

    // Validate token name
    issues.push(...validateTokenName(name, path));

    // Check if this is a background-type color that should have foreground
    const needsForeground = isBackgroundColor(name);

    if (isColorWithForeground(token)) {
      // Validate color value
      if (!isValidColorValue(token.value)) {
        issues.push(error(path, `Invalid color value: "${token.value}"`, 'Use hex (#fff), rgb(), hsl(), oklch(), or named color'));
      }

      // Validate foreground value
      if (!isValidColorValue(token.foreground)) {
        issues.push(error(`${path}.foreground`, `Invalid foreground color: "${token.foreground}"`));
      }

      // Check contrast (info only)
      const contrast = estimateContrast(token.value, token.foreground);
      if (contrast < 4.5) {
        issues.push(info(path, `Contrast ratio (~${contrast.toFixed(1)}:1) may not meet WCAG AA (4.5:1)`, 'Consider using a darker/lighter foreground'));
      }
    } else if (typeof token === 'string') {
      // Simple color value
      if (!isValidColorValue(token)) {
        issues.push(error(path, `Invalid color value: "${token}"`));
      }

      // Warn if this should have a foreground
      if (needsForeground) {
        issues.push(warning(path, `Color "${name}" is typically used as a background and should have a foreground`, 'Use { "value": "...", "foreground": "..." } format'));
      }
    } else {
      issues.push(error(path, 'Color token must be a string or { value, foreground } object'));
    }
  }

  // Suggest missing semantic colors
  const hasColors = Object.keys(colors);
  const missingSemantic = RESERVED_COLOR_NAMES.filter(
    name => !hasColors.some(c => c.toLowerCase() === name.toLowerCase())
  );

  if (missingSemantic.includes('primary')) {
    issues.push(info(basePath, 'Consider adding a "primary" color for main actions'));
  }

  if (missingSemantic.includes('background')) {
    issues.push(info(basePath, 'Consider adding a "background" color for page backgrounds'));
  }

  return issues;
}

function validateSpace(space: Record<string, string>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, value] of Object.entries(space)) {
    if (value === undefined) continue;

    const path = `${basePath}.${name}`;

    issues.push(...validateTokenName(name, path));

    if (typeof value !== 'string') {
      issues.push(error(path, 'Space value must be a string'));
    } else if (!isValidDimensionValue(value)) {
      issues.push(warning(path, `Space value "${value}" may not be a valid CSS dimension`, 'Use values like "0", "0.5rem", "16px"'));
    }
  }

  return issues;
}

function validateRadius(radius: Record<string, string>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, value] of Object.entries(radius)) {
    if (value === undefined) continue;

    const path = `${basePath}.${name}`;

    issues.push(...validateTokenName(name, path));

    if (typeof value !== 'string') {
      issues.push(error(path, 'Radius value must be a string'));
    } else if (!isValidDimensionValue(value) && value !== '9999px') {
      issues.push(warning(path, `Radius value "${value}" may not be a valid CSS dimension`));
    }
  }

  return issues;
}

function validateShadow(shadow: Record<string, string>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, value] of Object.entries(shadow)) {
    if (value === undefined) continue;

    const path = `${basePath}.${name}`;

    issues.push(...validateTokenName(name, path));

    if (typeof value !== 'string') {
      issues.push(error(path, 'Shadow value must be a string'));
    } else if (value !== 'none' && !isValidShadowValue(value)) {
      issues.push(warning(path, `Shadow value may not be valid CSS box-shadow`, 'Example: "0 4px 6px -1px rgb(0 0 0 / 0.1)"'));
    }
  }

  return issues;
}

function validateFont(font: Record<string, unknown>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validate font.family
  if (font.family && typeof font.family === 'object') {
    for (const [name, value] of Object.entries(font.family as Record<string, string>)) {
      const path = `${basePath}.family.${name}`;

      if (typeof value !== 'string') {
        issues.push(error(path, 'Font family must be a string'));
      }
    }
  }

  // Validate font.size
  if (font.size && typeof font.size === 'object') {
    for (const [name, value] of Object.entries(font.size as Record<string, string>)) {
      const path = `${basePath}.size.${name}`;

      if (typeof value !== 'string') {
        issues.push(error(path, 'Font size must be a string'));
      } else if (!isValidDimensionValue(value)) {
        issues.push(warning(path, `Font size "${value}" may not be a valid CSS dimension`));
      }
    }
  }

  // Validate font.weight
  if (font.weight && typeof font.weight === 'object') {
    for (const [name, value] of Object.entries(font.weight as Record<string, string>)) {
      const path = `${basePath}.weight.${name}`;

      if (typeof value !== 'string') {
        issues.push(error(path, 'Font weight must be a string'));
      } else if (!isValidFontWeight(value)) {
        issues.push(warning(path, `Font weight "${value}" should be a number 1-1000 or keyword`));
      }
    }
  }

  // Validate font.leading
  if (font.leading && typeof font.leading === 'object') {
    for (const [name, value] of Object.entries(font.leading as Record<string, string>)) {
      const path = `${basePath}.leading.${name}`;

      if (typeof value !== 'string') {
        issues.push(error(path, 'Line height must be a string'));
      }
    }
  }

  // Validate font.tracking
  if (font.tracking && typeof font.tracking === 'object') {
    for (const [name, value] of Object.entries(font.tracking as Record<string, string>)) {
      const path = `${basePath}.tracking.${name}`;

      if (typeof value !== 'string') {
        issues.push(error(path, 'Letter spacing must be a string'));
      }
    }
  }

  return issues;
}

function validateDuration(duration: Record<string, string>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, value] of Object.entries(duration)) {
    if (value === undefined) continue;

    const path = `${basePath}.${name}`;

    if (typeof value !== 'string') {
      issues.push(error(path, 'Duration must be a string'));
    } else if (!isValidDurationValue(value)) {
      issues.push(warning(path, `Duration "${value}" should include unit (ms or s)`, 'Example: "200ms" or "0.2s"'));
    }
  }

  return issues;
}

function validateEase(ease: Record<string, string>, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, value] of Object.entries(ease)) {
    if (value === undefined) continue;

    const path = `${basePath}.${name}`;

    if (typeof value !== 'string') {
      issues.push(error(path, 'Easing must be a string'));
    } else if (!isValidEasingValue(value)) {
      issues.push(warning(path, `Easing "${value}" may not be valid`, 'Use "linear", "ease-in-out", or "cubic-bezier(...)"'));
    }
  }

  return issues;
}

function validateModes(modes: LDLModeTokens, document: LDLTokenDocument, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [modeName, modeOverride] of Object.entries(modes)) {
    if (!modeOverride) continue;

    const modePath = `${basePath}.${modeName}`;

    // Check that mode only overrides existing tokens
    if (modeOverride.color) {
      for (const colorName of Object.keys(modeOverride.color)) {
        if (!document.color || !(colorName in document.color)) {
          issues.push(warning(`${modePath}.color.${colorName}`, `Mode "${modeName}" overrides "${colorName}" which doesn't exist in base colors`));
        }
      }

      // Validate the override colors themselves
      issues.push(...validateColors(modeOverride.color as LDLColorTokens, `${modePath}.color`));
    }

    if (modeOverride.shadow) {
      for (const shadowName of Object.keys(modeOverride.shadow)) {
        if (!document.shadow || !(shadowName in document.shadow)) {
          issues.push(warning(`${modePath}.shadow.${shadowName}`, `Mode "${modeName}" overrides "${shadowName}" which doesn't exist in base shadows`));
        }
      }
    }
  }

  return issues;
}

// =============================================================================
// Token Name Validation
// =============================================================================

function validateTokenName(name: string, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Cannot start with $
  if (name.startsWith('$')) {
    issues.push(error(path, `Token name "${name}" cannot start with $`));
  }

  // Cannot contain { } .
  if (/[{}.]/g.test(name)) {
    issues.push(error(path, `Token name "${name}" cannot contain { } or .`));
  }

  // Warn about spaces
  if (/\s/.test(name)) {
    issues.push(warning(path, `Token name "${name}" contains spaces`, 'Use kebab-case: "my-token"'));
  }

  // Warn about uppercase
  if (/[A-Z]/.test(name)) {
    issues.push(info(path, `Token name "${name}" contains uppercase`, 'Consider using kebab-case for consistency'));
  }

  return issues;
}

// =============================================================================
// Reference Validation
// =============================================================================

function validateReferences(document: LDLTokenDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const checkReferences = (obj: unknown, path: string) => {
    if (typeof obj === 'string') {
      // Check for {reference} syntax
      const matches = obj.match(/\{([^}]+)\}/g);
      if (matches) {
        for (const match of matches) {
          const ref = match.slice(1, -1); // Remove { }
          if (!resolveReference(ref, document)) {
            issues.push(error(path, `Reference "${match}" points to non-existent token`));
          }
        }
      }
    } else if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        checkReferences(value, `${path}.${key}`);
      }
    }
  };

  checkReferences(document, '');

  return issues;
}

function resolveReference(ref: string, document: LDLTokenDocument): boolean {
  const parts = ref.split('.');
  let current: unknown = document;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return false;
    }
  }

  return current !== undefined;
}

// =============================================================================
// Value Validation Helpers
// =============================================================================

function isValidColorValue(value: string): boolean {
  // Hex
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) return true;

  // RGB/RGBA
  if (/^rgba?\s*\(/.test(value)) return true;

  // HSL/HSLA
  if (/^hsla?\s*\(/.test(value)) return true;

  // OKLCH
  if (/^oklch\s*\(/.test(value)) return true;

  // Named colors (basic check)
  const namedColors = ['transparent', 'currentColor', 'inherit', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey'];
  if (namedColors.includes(value.toLowerCase())) return true;

  // CSS color keywords
  if (/^[a-z]+$/i.test(value)) return true; // Allow any lowercase word as potential named color

  return false;
}

function isValidDimensionValue(value: string): boolean {
  // Zero
  if (value === '0') return true;

  // Number with unit
  if (/^-?[\d.]+(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/.test(value)) return true;

  // CSS calc/var
  if (/^(?:calc|var)\s*\(/.test(value)) return true;

  return false;
}

function isValidShadowValue(value: string): boolean {
  // Basic shadow pattern: offset-x offset-y blur spread color
  // Very permissive check
  return /\d/.test(value) && (/rgb|hsl|#|[a-z]/i.test(value) || value.includes('var('));
}

function isValidDurationValue(value: string): boolean {
  return /^[\d.]+(?:ms|s)$/.test(value) || value === '0';
}

function isValidEasingValue(value: string): boolean {
  const keywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
  if (keywords.includes(value)) return true;
  if (/^cubic-bezier\s*\(/.test(value)) return true;
  if (/^steps\s*\(/.test(value)) return true;
  return false;
}

function isValidFontWeight(value: string): boolean {
  const keywords = ['thin', 'hairline', 'extralight', 'ultralight', 'light', 'normal', 'regular', 'medium', 'semibold', 'demibold', 'bold', 'extrabold', 'ultrabold', 'black', 'heavy'];
  if (keywords.includes(value.toLowerCase())) return true;
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 1 && num <= 1000;
}

function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?$/.test(version);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// Semantic Helpers
// =============================================================================

function isBackgroundColor(name: string): boolean {
  const bgColors = ['primary', 'secondary', 'background', 'card', 'popover', 'muted', 'accent', 'destructive', 'success', 'warning', 'info'];
  return bgColors.includes(name.toLowerCase());
}

function estimateContrast(bg: string, fg: string): number {
  try {
    const bgLum = getRelativeLuminance(bg);
    const fgLum = getRelativeLuminance(fg);
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21; // Assume good contrast on error
  }
}

function getRelativeLuminance(color: string): number {
  let r = 0, g = 0, b = 0;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else {
      r = parseInt(hex.slice(0, 2), 16) / 255;
      g = parseInt(hex.slice(2, 4), 16) / 255;
      b = parseInt(hex.slice(4, 6), 16) / 255;
    }
  } else {
    return 0.5; // Unknown format
  }

  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// =============================================================================
// Issue Factories
// =============================================================================

function error(path: string, message: string, suggestion?: string): ValidationIssue {
  return { severity: 'error', path, message, suggestion };
}

function warning(path: string, message: string, suggestion?: string): ValidationIssue {
  return { severity: 'warning', path, message, suggestion };
}

function info(path: string, message: string, suggestion?: string): ValidationIssue {
  return { severity: 'info', path, message, suggestion };
}

// =============================================================================
// Utility Exports
// =============================================================================

/**
 * Quick check if document is valid (no errors)
 */
export function isValid(document: LDLTokenDocument): boolean {
  return validate(document).valid;
}

/**
 * Get only errors (no warnings/info)
 */
export function getErrors(document: LDLTokenDocument): ValidationIssue[] {
  return validate(document).issues.filter(i => i.severity === 'error');
}

/**
 * Format validation issues as string
 */
export function formatIssues(issues: ValidationIssue[]): string {
  return issues.map(issue => {
    const prefix = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
    let line = `${prefix} [${issue.path}] ${issue.message}`;
    if (issue.suggestion) {
      line += `\n   → ${issue.suggestion}`;
    }
    return line;
  }).join('\n');
}
