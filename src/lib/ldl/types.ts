/**
 * LDL Token Specification v1.0 - Type Definitions
 *
 * Complete TypeScript types for the Living Design Library Token Format
 */

// =============================================================================
// Core Value Types
// =============================================================================

/**
 * Color token with required foreground pairing for accessibility
 */
export interface LDLColorWithForeground {
  value: string;
  foreground: string;
  description?: string;
}

/**
 * Simple color value (for borders, rings that don't need foreground)
 */
export type LDLSimpleColor = string;

/**
 * Color token - either paired or simple
 */
export type LDLColorToken = LDLColorWithForeground | LDLSimpleColor;

/**
 * Check if color token has foreground pairing
 */
export function isColorWithForeground(token: LDLColorToken): token is LDLColorWithForeground {
  return typeof token === 'object' && 'value' in token && 'foreground' in token;
}

// =============================================================================
// Token Categories
// =============================================================================

/**
 * Color tokens - semantic color definitions
 */
export interface LDLColorTokens {
  // Core (recommended)
  primary?: LDLColorToken;
  secondary?: LDLColorToken;
  background?: LDLColorToken;

  // Surfaces
  card?: LDLColorToken;
  popover?: LDLColorToken;
  muted?: LDLColorToken;

  // Semantic
  destructive?: LDLColorToken;
  success?: LDLColorToken;
  warning?: LDLColorToken;
  info?: LDLColorToken;
  accent?: LDLColorToken;

  // UI
  border?: LDLSimpleColor;
  input?: LDLSimpleColor;
  ring?: LDLSimpleColor;

  // Extensible
  [key: string]: LDLColorToken | undefined;
}

/**
 * Space tokens - spacing scale
 */
export interface LDLSpaceTokens {
  [key: string]: string;
}

/**
 * Radius tokens - border radius scale
 */
export interface LDLRadiusTokens {
  none?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  '3xl'?: string;
  full?: string;
  [key: string]: string | undefined;
}

/**
 * Shadow tokens - box shadow definitions
 */
export interface LDLShadowTokens {
  none?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  inner?: string;
  [key: string]: string | undefined;
}

/**
 * Font family tokens
 */
export interface LDLFontFamilyTokens {
  sans?: string;
  serif?: string;
  mono?: string;
  [key: string]: string | undefined;
}

/**
 * Font size tokens
 */
export interface LDLFontSizeTokens {
  xs?: string;
  sm?: string;
  base?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  '3xl'?: string;
  '4xl'?: string;
  '5xl'?: string;
  [key: string]: string | undefined;
}

/**
 * Font weight tokens
 */
export interface LDLFontWeightTokens {
  thin?: string;
  light?: string;
  normal?: string;
  medium?: string;
  semibold?: string;
  bold?: string;
  extrabold?: string;
  black?: string;
  [key: string]: string | undefined;
}

/**
 * Line height tokens
 */
export interface LDLFontLeadingTokens {
  none?: string;
  tight?: string;
  snug?: string;
  normal?: string;
  relaxed?: string;
  loose?: string;
  [key: string]: string | undefined;
}

/**
 * Letter spacing tokens
 */
export interface LDLFontTrackingTokens {
  tighter?: string;
  tight?: string;
  normal?: string;
  wide?: string;
  wider?: string;
  widest?: string;
  [key: string]: string | undefined;
}

/**
 * Complete font tokens structure
 */
export interface LDLFontTokens {
  family?: LDLFontFamilyTokens;
  size?: LDLFontSizeTokens;
  weight?: LDLFontWeightTokens;
  leading?: LDLFontLeadingTokens;
  tracking?: LDLFontTrackingTokens;
}

/**
 * Duration tokens - animation timing
 */
export interface LDLDurationTokens {
  instant?: string;
  fast?: string;
  normal?: string;
  slow?: string;
  slower?: string;
  [key: string]: string | undefined;
}

/**
 * Easing tokens - timing functions
 */
export interface LDLEaseTokens {
  linear?: string;
  in?: string;
  out?: string;
  'in-out'?: string;
  bounce?: string;
  [key: string]: string | undefined;
}

/**
 * Component-specific tokens (optional)
 */
export interface LDLComponentTokens {
  [componentName: string]: {
    [property: string]: string;
  };
}

/**
 * Mode override - partial token set for theme variants
 */
export interface LDLModeOverride {
  color?: Partial<LDLColorTokens>;
  space?: Partial<LDLSpaceTokens>;
  radius?: Partial<LDLRadiusTokens>;
  shadow?: Partial<LDLShadowTokens>;
  font?: Partial<LDLFontTokens>;
  duration?: Partial<LDLDurationTokens>;
  ease?: Partial<LDLEaseTokens>;
}

/**
 * Mode definitions
 */
export interface LDLModeTokens {
  dark?: LDLModeOverride;
  light?: LDLModeOverride;
  'high-contrast'?: LDLModeOverride;
  [modeName: string]: LDLModeOverride | undefined;
}

// =============================================================================
// Complete LDL Document
// =============================================================================

/**
 * Complete LDL Token File Structure
 */
export interface LDLTokenDocument {
  // Metadata ($ prefix)
  $schema?: string;
  $name: string;
  $description?: string;
  $version?: string;

  // Token categories
  color?: LDLColorTokens;
  space?: LDLSpaceTokens;
  radius?: LDLRadiusTokens;
  shadow?: LDLShadowTokens;
  font?: LDLFontTokens;
  duration?: LDLDurationTokens;
  ease?: LDLEaseTokens;

  // Optional
  component?: LDLComponentTokens;
  mode?: LDLModeTokens;
}

// =============================================================================
// Validation Types
// =============================================================================

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: ValidationSeverity;
  path: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  document?: LDLTokenDocument;
}

// =============================================================================
// Parser Types
// =============================================================================

export type InputFormat = 'ldl' | 'w3c-dtcg' | 'figma-variables' | 'tokens-studio' | 'style-dictionary' | 'unknown';

export interface ParseResult {
  success: boolean;
  format: InputFormat;
  document?: LDLTokenDocument;
  errors: string[];
}

// =============================================================================
// Generator Types
// =============================================================================

export type OutputFormat =
  | 'css'
  | 'scss'
  | 'tailwind-config'
  | 'tailwind-css'
  | 'json'
  | 'typescript'
  | 'ios-swift'
  | 'android-xml'
  | 'w3c-dtcg';

export interface GeneratorOptions {
  format: OutputFormat;
  prefix?: string;
  includeComments?: boolean;
  includeModes?: boolean;
  modeSelector?: 'class' | 'data-attribute' | 'media-query';
}

export interface GeneratorResult {
  success: boolean;
  output: string;
  errors: string[];
}

// =============================================================================
// Constants
// =============================================================================

export const LDL_SCHEMA_URL = 'https://ldl.dev/schema/v1';

export const LDL_VERSION = '1.0.0';

export const RESERVED_COLOR_NAMES = [
  'primary',
  'secondary',
  'background',
  'foreground',
  'card',
  'popover',
  'muted',
  'accent',
  'destructive',
  'success',
  'warning',
  'info',
  'border',
  'input',
  'ring'
] as const;

export const SCALE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;

export const NUMERIC_SCALE = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'] as const;

export const FONT_FAMILIES = ['sans', 'serif', 'mono'] as const;

export const TOKEN_CATEGORIES = ['color', 'space', 'radius', 'shadow', 'font', 'duration', 'ease', 'component', 'mode'] as const;

export type TokenCategory = typeof TOKEN_CATEGORIES[number];
