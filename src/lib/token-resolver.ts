/**
 * Token Resolver with Inheritance System
 *
 * Enables multi-brand token inheritance, token references, and computed values.
 * This is the foundation for the Living Design Library's advanced features.
 */

import type { Theme } from '../hooks/useDesignSystems';
import { hslStringToHex, parseHSLString, hslToHex, lighten, darken } from './theme-mappers/color-utils';

// Token value can be a direct value or a reference
export type TokenValue = string | number | TokenReference | TokenComputed;

// Reference to another token: {colors.primary}
export interface TokenReference {
  $ref: string;
}

// Computed value: { $compute: "darken", args: ["{colors.primary}", 0.1] }
export interface TokenComputed {
  $compute: string;
  args: (string | number)[];
}

// A token source (theme) that can extend another
export interface TokenSource {
  id: string;
  name: string;
  extends?: string; // ID of parent source
  tokens: TokenDefinition;
}

// Token definition with all categories
export interface TokenDefinition {
  colors?: Record<string, TokenValue>;
  spacing?: Record<string, TokenValue>;
  typography?: Record<string, TokenValue>;
  borderRadius?: Record<string, TokenValue>;
  shadows?: Record<string, TokenValue>;
  effects?: Record<string, TokenValue>;
  opacity?: Record<string, TokenValue>;
  [key: string]: Record<string, TokenValue> | undefined;
}

// Resolved tokens (all values are concrete strings/numbers)
export interface ResolvedTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  effects: Record<string, string>;
  opacity: Record<string, string>;
  [key: string]: Record<string, string>;
}

/**
 * Check if a value is a token reference
 */
function isReference(value: TokenValue): value is TokenReference {
  return typeof value === 'object' && value !== null && '$ref' in value;
}

/**
 * Check if a value is a computed token
 */
function isComputed(value: TokenValue): value is TokenComputed {
  return typeof value === 'object' && value !== null && '$compute' in value;
}

/**
 * Check if a string contains a reference pattern like {colors.primary}
 */
function containsReference(value: string): boolean {
  return /\{[a-zA-Z0-9._-]+\}/.test(value);
}

/**
 * Available computation functions
 */
const COMPUTE_FUNCTIONS: Record<string, (...args: (string | number)[]) => string> = {
  darken: (color: string | number, amount: string | number) => {
    return darken(String(color), Number(amount));
  },
  lighten: (color: string | number, amount: string | number) => {
    return lighten(String(color), Number(amount));
  },
  opacity: (color: string | number, alpha: string | number) => {
    const hex = hslStringToHex(String(color));
    const alphaHex = Math.round(Number(alpha) * 255).toString(16).padStart(2, '0');
    return `${hex}${alphaHex}`;
  },
  scale: (base: string | number, factor: string | number) => {
    const baseNum = parseFloat(String(base));
    const result = baseNum * Number(factor);
    // Preserve unit if present
    const unit = String(base).replace(/[\d.-]/g, '');
    return `${result}${unit}`;
  },
  add: (a: string | number, b: string | number) => {
    const aNum = parseFloat(String(a));
    const bNum = parseFloat(String(b));
    const unit = String(a).replace(/[\d.-]/g, '') || String(b).replace(/[\d.-]/g, '');
    return `${aNum + bNum}${unit}`;
  },
  subtract: (a: string | number, b: string | number) => {
    const aNum = parseFloat(String(a));
    const bNum = parseFloat(String(b));
    const unit = String(a).replace(/[\d.-]/g, '') || String(b).replace(/[\d.-]/g, '');
    return `${aNum - bNum}${unit}`;
  },
  clamp: (value: string | number, min: string | number, max: string | number) => {
    const val = parseFloat(String(value));
    const minVal = parseFloat(String(min));
    const maxVal = parseFloat(String(max));
    const unit = String(value).replace(/[\d.-]/g, '');
    return `${Math.max(minVal, Math.min(maxVal, val))}${unit}`;
  },
};

/**
 * Token Resolver Class
 *
 * Manages token sources with inheritance and resolves references.
 */
export class TokenResolver {
  private sources: Map<string, TokenSource> = new Map();
  private resolveCache: Map<string, ResolvedTokens> = new Map();

  /**
   * Register a token source
   */
  register(source: TokenSource): void {
    this.sources.set(source.id, source);
    // Invalidate cache for this source and any that extend it
    this.invalidateCache(source.id);
  }

  /**
   * Register multiple sources at once
   */
  registerAll(sources: TokenSource[]): void {
    sources.forEach(source => this.register(source));
  }

  /**
   * Unregister a token source
   */
  unregister(id: string): void {
    this.sources.delete(id);
    this.invalidateCache(id);
  }

  /**
   * Get a registered source
   */
  getSource(id: string): TokenSource | undefined {
    return this.sources.get(id);
  }

  /**
   * Get all registered sources
   */
  getAllSources(): TokenSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Resolve a source and all its inherited tokens
   */
  resolve(sourceId: string): ResolvedTokens {
    // Check cache first
    const cached = this.resolveCache.get(sourceId);
    if (cached) {
      return cached;
    }

    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Token source not found: ${sourceId}`);
    }

    // Get inherited tokens first
    let baseTokens: TokenDefinition = {};
    if (source.extends) {
      const parentResolved = this.resolve(source.extends);
      // Convert resolved back to definition format for merging
      baseTokens = this.resolvedToDefinition(parentResolved);
    }

    // Merge with current source (current overrides parent)
    const mergedTokens = this.deepMerge(baseTokens, source.tokens);

    // Resolve all references and compute values
    const resolved = this.resolveAllTokens(mergedTokens);

    // Cache the result
    this.resolveCache.set(sourceId, resolved);

    return resolved;
  }

  /**
   * Resolve to a Theme object (for compatibility with existing code)
   */
  resolveToTheme(sourceId: string): Theme {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Token source not found: ${sourceId}`);
    }

    const resolved = this.resolve(sourceId);

    return {
      id: source.id,
      name: source.name,
      colors: resolved.colors,
      spacing: resolved.spacing,
      typography: resolved.typography,
      borderRadius: resolved.borderRadius,
      shadows: resolved.shadows,
      effects: resolved.effects,
      opacity: resolved.opacity,
    };
  }

  /**
   * Get the inheritance chain for a source
   */
  getInheritanceChain(sourceId: string): string[] {
    const chain: string[] = [];
    let currentId: string | undefined = sourceId;

    while (currentId) {
      chain.push(currentId);
      const source = this.sources.get(currentId);
      currentId = source?.extends;

      // Prevent infinite loops
      if (chain.length > 100) {
        throw new Error(`Circular inheritance detected for source: ${sourceId}`);
      }
    }

    return chain;
  }

  /**
   * Check if one source inherits from another
   */
  inheritsFrom(sourceId: string, ancestorId: string): boolean {
    const chain = this.getInheritanceChain(sourceId);
    return chain.includes(ancestorId);
  }

  /**
   * Resolve a single token value given a context
   */
  resolveValue(value: TokenValue, context: TokenDefinition): string {
    // Direct string/number value
    if (typeof value === 'string') {
      // Check for inline references like "var(--{colors.primary})"
      if (containsReference(value)) {
        return this.resolveInlineReferences(value, context);
      }
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    // Token reference
    if (isReference(value)) {
      return this.resolveReference(value.$ref, context);
    }

    // Computed value
    if (isComputed(value)) {
      return this.resolveComputed(value, context);
    }

    return String(value);
  }

  /**
   * Create a new source that extends an existing one
   */
  createExtension(
    parentId: string,
    newId: string,
    name: string,
    overrides: Partial<TokenDefinition>
  ): TokenSource {
    const parent = this.sources.get(parentId);
    if (!parent) {
      throw new Error(`Parent source not found: ${parentId}`);
    }

    const newSource: TokenSource = {
      id: newId,
      name,
      extends: parentId,
      tokens: overrides as TokenDefinition,
    };

    this.register(newSource);
    return newSource;
  }

  // Private methods

  private invalidateCache(sourceId: string): void {
    // Clear cache for this source
    this.resolveCache.delete(sourceId);

    // Clear cache for any sources that extend this one
    for (const [id, source] of this.sources) {
      if (source.extends === sourceId) {
        this.invalidateCache(id);
      }
    }
  }

  private deepMerge(base: TokenDefinition, override: TokenDefinition): TokenDefinition {
    const result: TokenDefinition = { ...base };

    for (const [category, tokens] of Object.entries(override)) {
      if (tokens && typeof tokens === 'object') {
        result[category] = {
          ...(result[category] || {}),
          ...tokens,
        };
      }
    }

    return result;
  }

  private resolvedToDefinition(resolved: ResolvedTokens): TokenDefinition {
    const definition: TokenDefinition = {};

    for (const [category, tokens] of Object.entries(resolved)) {
      if (tokens && typeof tokens === 'object') {
        definition[category] = { ...tokens };
      }
    }

    return definition;
  }

  private resolveAllTokens(tokens: TokenDefinition): ResolvedTokens {
    const resolved: ResolvedTokens = {
      colors: {},
      spacing: {},
      typography: {},
      borderRadius: {},
      shadows: {},
      effects: {},
      opacity: {},
    };

    // First pass: collect all direct values
    for (const [category, categoryTokens] of Object.entries(tokens)) {
      if (categoryTokens && typeof categoryTokens === 'object') {
        resolved[category] = {};
        for (const [key, value] of Object.entries(categoryTokens)) {
          if (typeof value === 'string' && !containsReference(value)) {
            resolved[category][key] = value;
          } else if (typeof value === 'number') {
            resolved[category][key] = String(value);
          }
        }
      }
    }

    // Second pass: resolve references and computed values
    // May need multiple passes for chained references
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const [category, categoryTokens] of Object.entries(tokens)) {
        if (categoryTokens && typeof categoryTokens === 'object') {
          for (const [key, value] of Object.entries(categoryTokens)) {
            // Skip if already resolved
            if (resolved[category]?.[key] !== undefined) {
              continue;
            }

            try {
              const resolvedValue = this.resolveValue(value, this.resolvedToDefinition(resolved));
              if (!containsReference(resolvedValue)) {
                if (!resolved[category]) {
                  resolved[category] = {};
                }
                resolved[category][key] = resolvedValue;
                changed = true;
              }
            } catch {
              // Reference not yet resolvable, try next iteration
            }
          }
        }
      }
    }

    return resolved;
  }

  private resolveReference(path: string, context: TokenDefinition): string {
    const parts = path.split('.');
    let current: unknown = context;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        throw new Error(`Token reference not found: ${path}`);
      }
    }

    if (typeof current === 'string') {
      return current;
    }
    if (typeof current === 'number') {
      return String(current);
    }

    throw new Error(`Invalid token reference value: ${path}`);
  }

  private resolveInlineReferences(value: string, context: TokenDefinition): string {
    return value.replace(/\{([a-zA-Z0-9._-]+)\}/g, (_, path) => {
      return this.resolveReference(path, context);
    });
  }

  private resolveComputed(computed: TokenComputed, context: TokenDefinition): string {
    const fn = COMPUTE_FUNCTIONS[computed.$compute];
    if (!fn) {
      throw new Error(`Unknown compute function: ${computed.$compute}`);
    }

    // Resolve any references in arguments
    const resolvedArgs = computed.args.map(arg => {
      if (typeof arg === 'string' && containsReference(arg)) {
        return this.resolveInlineReferences(arg, context);
      }
      if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
        return this.resolveReference(arg.slice(1, -1), context);
      }
      return arg;
    });

    return fn(...resolvedArgs);
  }
}

/**
 * Global resolver instance
 */
export const globalResolver = new TokenResolver();

/**
 * Helper to create a token reference
 */
export function ref(path: string): TokenReference {
  return { $ref: path };
}

/**
 * Helper to create a computed token
 */
export function compute(fn: string, ...args: (string | number)[]): TokenComputed {
  return { $compute: fn, args };
}

/**
 * Convert a Theme to a TokenSource
 */
export function themeToTokenSource(theme: Theme, extendsId?: string): TokenSource {
  return {
    id: theme.id,
    name: theme.name,
    extends: extendsId,
    tokens: {
      colors: theme.colors,
      spacing: theme.spacing,
      typography: theme.typography,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
      effects: theme.effects,
      opacity: theme.opacity,
    },
  };
}

// Example usage:
//
// const resolver = new TokenResolver();
//
// // Register base theme
// resolver.register({
//   id: 'base',
//   name: 'Base Theme',
//   tokens: {
//     colors: {
//       primary: '221.2 83.2% 53.3%',
//       'primary-foreground': '210 40% 98%',
//       background: '0 0% 100%',
//     },
//     spacing: {
//       unit: '4px',
//       sm: { $compute: 'scale', args: ['{spacing.unit}', 2] },
//       md: { $compute: 'scale', args: ['{spacing.unit}', 4] },
//     },
//   },
// });
//
// // Create brand extension
// resolver.createExtension('base', 'brand-a', 'Brand A', {
//   colors: {
//     primary: '142 76% 36%', // Override just primary
//   },
// });
//
// // Resolve
// const theme = resolver.resolveToTheme('brand-a');
// // theme.colors.primary = '142 76% 36%' (overridden)
// // theme.colors.background = '0 0% 100%' (inherited)
