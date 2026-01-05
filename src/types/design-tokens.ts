/**
 * Comprehensive Design Token Type Definitions
 * Follows W3C Design Tokens Format with extensions
 */

export interface ColorToken {
  value: string; // HSL format: "240 100% 50%"
  type: 'color';
  description?: string;
}

export interface DimensionToken {
  value: string; // CSS units: "16px", "1rem", "2em"
  type: 'dimension';
  description?: string;
}

export interface FontFamilyToken {
  value: string | string[]; // "Inter" or ["Inter", "sans-serif"]
  type: 'fontFamily';
  description?: string;
}

export interface FontWeightToken {
  value: number | string; // 400, "normal", "bold"
  type: 'fontWeight';
  description?: string;
}

export interface FontSizeToken {
  value: string; // "16px", "1rem"
  type: 'fontSize';
  description?: string;
}

export interface LineHeightToken {
  value: string | number; // "1.5", "24px", 1.5
  type: 'lineHeight';
  description?: string;
}

export interface LetterSpacingToken {
  value: string; // "0.5px", "0.05em"
  type: 'letterSpacing';
  description?: string;
}

export interface ShadowToken {
  value: string; // CSS box-shadow value
  type: 'shadow';
  description?: string;
}

export interface DurationToken {
  value: string; // "200ms", "0.2s"
  type: 'duration';
  description?: string;
}

export interface CubicBezierToken {
  value: string; // "cubic-bezier(0.4, 0, 0.2, 1)"
  type: 'cubicBezier';
  description?: string;
}

export interface BorderToken {
  value: string; // "1px solid hsl(var(--border))"
  type: 'border';
  description?: string;
}

export interface OpacityToken {
  value: number; // 0.5, 0.8
  type: 'opacity';
  description?: string;
}

// Token Collections
export interface ColorTokenCollection {
  // Base colors
  primary?: ColorToken;
  'primary-foreground'?: ColorToken;
  secondary?: ColorToken;
  'secondary-foreground'?: ColorToken;
  accent?: ColorToken;
  'accent-foreground'?: ColorToken;
  
  // Status colors
  destructive?: ColorToken;
  'destructive-foreground'?: ColorToken;
  success?: ColorToken;
  'success-foreground'?: ColorToken;
  warning?: ColorToken;
  'warning-foreground'?: ColorToken;
  info?: ColorToken;
  'info-foreground'?: ColorToken;
  
  // Background & Surface
  background?: ColorToken;
  foreground?: ColorToken;
  card?: ColorToken;
  'card-foreground'?: ColorToken;
  popover?: ColorToken;
  'popover-foreground'?: ColorToken;
  
  // UI Elements
  muted?: ColorToken;
  'muted-foreground'?: ColorToken;
  border?: ColorToken;
  input?: ColorToken;
  ring?: ColorToken;
  
  // Chart colors
  'chart-1'?: ColorToken;
  'chart-2'?: ColorToken;
  'chart-3'?: ColorToken;
  'chart-4'?: ColorToken;
  'chart-5'?: ColorToken;
  
  // Custom colors (extensible)
  [key: string]: ColorToken | undefined;
}

export interface TypographyTokenCollection {
  // Font families
  'font-sans'?: FontFamilyToken;
  'font-serif'?: FontFamilyToken;
  'font-mono'?: FontFamilyToken;
  'font-display'?: FontFamilyToken;
  
  // Font sizes
  'text-xs'?: FontSizeToken;
  'text-sm'?: FontSizeToken;
  'text-base'?: FontSizeToken;
  'text-lg'?: FontSizeToken;
  'text-xl'?: FontSizeToken;
  'text-2xl'?: FontSizeToken;
  'text-3xl'?: FontSizeToken;
  'text-4xl'?: FontSizeToken;
  'text-5xl'?: FontSizeToken;
  
  // Font weights
  'font-thin'?: FontWeightToken;
  'font-light'?: FontWeightToken;
  'font-normal'?: FontWeightToken;
  'font-medium'?: FontWeightToken;
  'font-semibold'?: FontWeightToken;
  'font-bold'?: FontWeightToken;
  'font-extrabold'?: FontWeightToken;
  
  // Line heights
  'leading-none'?: LineHeightToken;
  'leading-tight'?: LineHeightToken;
  'leading-snug'?: LineHeightToken;
  'leading-normal'?: LineHeightToken;
  'leading-relaxed'?: LineHeightToken;
  'leading-loose'?: LineHeightToken;
  
  // Letter spacing
  'tracking-tighter'?: LetterSpacingToken;
  'tracking-tight'?: LetterSpacingToken;
  'tracking-normal'?: LetterSpacingToken;
  'tracking-wide'?: LetterSpacingToken;
  'tracking-wider'?: LetterSpacingToken;
  'tracking-widest'?: LetterSpacingToken;
  
  [key: string]: FontFamilyToken | FontSizeToken | FontWeightToken | LineHeightToken | LetterSpacingToken | undefined;
}

export interface SpacingTokenCollection {
  '0'?: DimensionToken;
  '1'?: DimensionToken;
  '2'?: DimensionToken;
  '3'?: DimensionToken;
  '4'?: DimensionToken;
  '5'?: DimensionToken;
  '6'?: DimensionToken;
  '8'?: DimensionToken;
  '10'?: DimensionToken;
  '12'?: DimensionToken;
  '16'?: DimensionToken;
  '20'?: DimensionToken;
  '24'?: DimensionToken;
  '32'?: DimensionToken;
  '40'?: DimensionToken;
  '48'?: DimensionToken;
  '56'?: DimensionToken;
  '64'?: DimensionToken;
  
  [key: string]: DimensionToken | undefined;
}

export interface RadiusTokenCollection {
  'radius-none'?: DimensionToken;
  'radius-sm'?: DimensionToken;
  'radius-md'?: DimensionToken;
  'radius-lg'?: DimensionToken;
  'radius-xl'?: DimensionToken;
  'radius-2xl'?: DimensionToken;
  'radius-3xl'?: DimensionToken;
  'radius-full'?: DimensionToken;
  
  [key: string]: DimensionToken | undefined;
}

export interface ShadowTokenCollection {
  'shadow-xs'?: ShadowToken;
  'shadow-sm'?: ShadowToken;
  'shadow-md'?: ShadowToken;
  'shadow-lg'?: ShadowToken;
  'shadow-xl'?: ShadowToken;
  'shadow-2xl'?: ShadowToken;
  'shadow-inner'?: ShadowToken;
  'shadow-none'?: ShadowToken;
  
  [key: string]: ShadowToken | undefined;
}

export interface AnimationTokenCollection {
  // Durations
  'duration-instant'?: DurationToken;
  'duration-fast'?: DurationToken;
  'duration-normal'?: DurationToken;
  'duration-slow'?: DurationToken;
  'duration-slower'?: DurationToken;
  
  // Easing
  'ease-linear'?: CubicBezierToken;
  'ease-in'?: CubicBezierToken;
  'ease-out'?: CubicBezierToken;
  'ease-in-out'?: CubicBezierToken;
  
  [key: string]: DurationToken | CubicBezierToken | undefined;
}

export interface BorderTokenCollection {
  'border-thin'?: BorderToken;
  'border-base'?: BorderToken;
  'border-thick'?: BorderToken;
  
  [key: string]: BorderToken | undefined;
}

export interface OpacityTokenCollection {
  'opacity-0'?: OpacityToken;
  'opacity-25'?: OpacityToken;
  'opacity-50'?: OpacityToken;
  'opacity-75'?: OpacityToken;
  'opacity-100'?: OpacityToken;
  
  [key: string]: OpacityToken | undefined;
}

// Complete Token Structure
export interface DesignTokens {
  colors?: ColorTokenCollection;
  typography?: TypographyTokenCollection;
  spacing?: SpacingTokenCollection;
  radius?: RadiusTokenCollection;
  shadows?: ShadowTokenCollection;
  animation?: AnimationTokenCollection;
  borders?: BorderTokenCollection;
  opacity?: OpacityTokenCollection;
}

// Simplified structure for storage (backward compatible)
export interface SimpleDesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  spacing?: Record<string, string>;
  radius?: Record<string, string>;
  shadows?: Record<string, string>;
  animation?: Record<string, string>;
  borders?: Record<string, string>;
  opacity?: Record<string, number>;
}

// Token Parser/Normalizer
export class TokenNormalizer {
  /**
   * Convert simple tokens to full token structure
   */
  static toFullTokens(simple: SimpleDesignTokens): DesignTokens {
    const full: DesignTokens = {};

    if (simple.colors) {
      full.colors = {};
      Object.entries(simple.colors).forEach(([key, value]) => {
        full.colors![key] = { value, type: 'color' };
      });
    }

    if (simple.typography) {
      full.typography = {};
      Object.entries(simple.typography).forEach(([key, value]) => {
        const type = this.inferTypographyType(key);
        full.typography![key] = { value, type } as any;
      });
    }

    if (simple.spacing) {
      full.spacing = {};
      Object.entries(simple.spacing).forEach(([key, value]) => {
        full.spacing![key] = { value, type: 'dimension' };
      });
    }

    if (simple.radius) {
      full.radius = {};
      Object.entries(simple.radius).forEach(([key, value]) => {
        full.radius![key] = { value, type: 'dimension' };
      });
    }

    if (simple.shadows) {
      full.shadows = {};
      Object.entries(simple.shadows).forEach(([key, value]) => {
        full.shadows![key] = { value, type: 'shadow' };
      });
    }

    if (simple.animation) {
      full.animation = {};
      Object.entries(simple.animation).forEach(([key, value]) => {
        const type = key.includes('duration') ? 'duration' : 'cubicBezier';
        full.animation![key] = { value, type } as any;
      });
    }

    if (simple.borders) {
      full.borders = {};
      Object.entries(simple.borders).forEach(([key, value]) => {
        full.borders![key] = { value, type: 'border' };
      });
    }

    if (simple.opacity) {
      full.opacity = {};
      Object.entries(simple.opacity).forEach(([key, value]) => {
        full.opacity![key] = { value, type: 'opacity' };
      });
    }

    return full;
  }

  /**
   * Convert full tokens to simple structure for storage
   */
  static toSimpleTokens(full: DesignTokens): SimpleDesignTokens {
    const simple: SimpleDesignTokens = {};

    if (full.colors) {
      simple.colors = {};
      Object.entries(full.colors).forEach(([key, token]) => {
        if (token) simple.colors![key] = token.value;
      });
    }

    if (full.typography) {
      simple.typography = {};
      Object.entries(full.typography).forEach(([key, token]) => {
        if (token) simple.typography![key] = String(token.value);
      });
    }

    if (full.spacing) {
      simple.spacing = {};
      Object.entries(full.spacing).forEach(([key, token]) => {
        if (token) simple.spacing![key] = token.value;
      });
    }

    if (full.radius) {
      simple.radius = {};
      Object.entries(full.radius).forEach(([key, token]) => {
        if (token) simple.radius![key] = token.value;
      });
    }

    if (full.shadows) {
      simple.shadows = {};
      Object.entries(full.shadows).forEach(([key, token]) => {
        if (token) simple.shadows![key] = token.value;
      });
    }

    if (full.animation) {
      simple.animation = {};
      Object.entries(full.animation).forEach(([key, token]) => {
        if (token) simple.animation![key] = String(token.value);
      });
    }

    if (full.borders) {
      simple.borders = {};
      Object.entries(full.borders).forEach(([key, token]) => {
        if (token) simple.borders![key] = token.value;
      });
    }

    if (full.opacity) {
      simple.opacity = {};
      Object.entries(full.opacity).forEach(([key, token]) => {
        if (token) simple.opacity![key] = token.value;
      });
    }

    return simple;
  }

  /**
   * Infer typography token type from key name
   */
  private static inferTypographyType(key: string): 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing' {
    if (key.includes('font-') && !key.includes('size') && !key.includes('weight')) return 'fontFamily';
    if (key.includes('text-') || key.includes('size')) return 'fontSize';
    if (key.includes('weight') || key.includes('font-thin') || key.includes('font-bold')) return 'fontWeight';
    if (key.includes('leading')) return 'lineHeight';
    if (key.includes('tracking')) return 'letterSpacing';
    return 'fontSize'; // default
  }

  /**
   * Parse Figma tokens export (various formats)
   */
  static parseFigmaTokens(input: any): DesignTokens {
    // Handle Tokens Studio format
    if (input.$themes || input.global) {
      return this.parseTokensStudioFormat(input);
    }

    // Handle simple Figma variables format
    if (input.colors || input.spacing || input.typography) {
      return this.parseSimpleFormat(input);
    }

    // Handle nested format
    return this.parseNestedFormat(input);
  }

  private static parseTokensStudioFormat(input: any): DesignTokens {
    const tokens: DesignTokens = {};
    
    // Extract from global or first theme
    const source = input.global || input[Object.keys(input)[0]];
    
    if (source) {
      Object.entries(source).forEach(([category, values]: [string, any]) => {
        if (category === 'color' || category === 'colors') {
          tokens.colors = this.extractColorTokens(values);
        } else if (category === 'spacing' || category === 'space') {
          tokens.spacing = this.extractDimensionTokens(values);
        } else if (category === 'borderRadius' || category === 'radii') {
          tokens.radius = this.extractDimensionTokens(values);
        } else if (category === 'boxShadow' || category === 'shadows') {
          tokens.shadows = this.extractShadowTokens(values);
        }
      });
    }

    return tokens;
  }

  private static parseSimpleFormat(input: any): DesignTokens {
    const tokens: DesignTokens = {};

    if (input.colors || input.color) {
      tokens.colors = this.extractColorTokens(input.colors || input.color);
    }

    if (input.spacing || input.space) {
      tokens.spacing = this.extractDimensionTokens(input.spacing || input.space);
    }

    if (input.borderRadius || input.radii) {
      tokens.radius = this.extractDimensionTokens(input.borderRadius || input.radii);
    }

    if (input.shadows || input.boxShadow) {
      tokens.shadows = this.extractShadowTokens(input.shadows || input.boxShadow);
    }

    if (input.typography) {
      tokens.typography = this.extractTypographyTokens(input.typography);
    }

    if (input.animation) {
      tokens.animation = this.extractAnimationTokens(input.animation);
    }

    return tokens;
  }

  private static parseNestedFormat(input: any): DesignTokens {
    const tokens: DesignTokens = {};

    // Recursively flatten nested structure
    const flatten = (obj: any, prefix = ''): Record<string, any> => {
      const result: Record<string, any> = {};
      
      Object.entries(obj).forEach(([key, value]: [string, any]) => {
        const newKey = prefix ? `${prefix}-${key}` : key;
        
        if (value && typeof value === 'object' && value.value !== undefined) {
          result[newKey] = value.value;
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, flatten(value, newKey));
        } else if (typeof value === 'string' || typeof value === 'number') {
          result[newKey] = value;
        }
      });

      return result;
    };

    const flattened = flatten(input);
    
    // Categorize tokens
    Object.entries(flattened).forEach(([key, value]) => {
      if (this.isColorKey(key)) {
        if (!tokens.colors) tokens.colors = {};
        tokens.colors[key] = { value: String(value), type: 'color' };
      } else if (this.isSpacingKey(key)) {
        if (!tokens.spacing) tokens.spacing = {};
        tokens.spacing[key] = { value: String(value), type: 'dimension' };
      } else if (this.isRadiusKey(key)) {
        if (!tokens.radius) tokens.radius = {};
        tokens.radius[key] = { value: String(value), type: 'dimension' };
      } else if (this.isShadowKey(key)) {
        if (!tokens.shadows) tokens.shadows = {};
        tokens.shadows[key] = { value: String(value), type: 'shadow' };
      }
    });

    return tokens;
  }

  private static extractColorTokens(obj: any): ColorTokenCollection {
    const colors: ColorTokenCollection = {};
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string') {
        colors[key] = { value, type: 'color' };
      } else if (value && typeof value === 'object' && value.value) {
        colors[key] = { value: value.value, type: 'color', description: value.description };
      }
    });

    return colors;
  }

  private static extractDimensionTokens(obj: any): SpacingTokenCollection | RadiusTokenCollection {
    const dimensions: any = {};
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string') {
        dimensions[key] = { value, type: 'dimension' };
      } else if (value && typeof value === 'object' && value.value) {
        dimensions[key] = { value: value.value, type: 'dimension', description: value.description };
      }
    });

    return dimensions;
  }

  private static extractShadowTokens(obj: any): ShadowTokenCollection {
    const shadows: ShadowTokenCollection = {};
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string') {
        shadows[key] = { value, type: 'shadow' };
      } else if (value && typeof value === 'object' && value.value) {
        shadows[key] = { value: value.value, type: 'shadow', description: value.description };
      }
    });

    return shadows;
  }

  private static extractTypographyTokens(obj: any): TypographyTokenCollection {
    const typography: TypographyTokenCollection = {};
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const type = this.inferTypographyType(key);
      if (typeof value === 'string' || typeof value === 'number') {
        typography[key] = { value, type } as any;
      } else if (value && typeof value === 'object' && value.value) {
        typography[key] = { value: value.value, type, description: value.description } as any;
      }
    });

    return typography;
  }

  private static extractAnimationTokens(obj: any): AnimationTokenCollection {
    const animation: AnimationTokenCollection = {};
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const type = key.includes('duration') ? 'duration' : 'cubicBezier';
      if (typeof value === 'string') {
        animation[key] = { value, type } as any;
      } else if (value && typeof value === 'object' && value.value) {
        animation[key] = { value: value.value, type, description: value.description } as any;
      }
    });

    return animation;
  }

  private static isColorKey(key: string): boolean {
    const colorKeys = ['color', 'background', 'foreground', 'border', 'primary', 'secondary', 'accent', 'muted', 'destructive', 'success', 'warning', 'info', 'card', 'popover'];
    return colorKeys.some(k => key.toLowerCase().includes(k));
  }

  private static isSpacingKey(key: string): boolean {
    return key.toLowerCase().includes('space') || key.toLowerCase().includes('spacing') || /^\d+$/.test(key);
  }

  private static isRadiusKey(key: string): boolean {
    return key.toLowerCase().includes('radius') || key.toLowerCase().includes('radii');
  }

  private static isShadowKey(key: string): boolean {
    return key.toLowerCase().includes('shadow');
  }
}
