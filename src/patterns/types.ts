/**
 * Pattern Registry Types
 *
 * Patterns are the source of truth for UI components in the design system.
 * They're consumed by:
 * - Humans: Preview UI renders patterns visually
 * - AI Agents: MCP server exposes patterns for code generation
 * - Developers: Export patterns as copy-paste code
 */

export type PatternSource =
  | "system"           // Built-in, ships with app
  | `team:${string}`   // Team-added, shared with team
  | `user:${string}`;  // User-added, personal

export type DesignIntent =
  | "web-app"
  | "ecommerce"
  | "mobile"
  | "landing"
  | "web-editorial"
  | "dashboard"
  | "saas"
  | "auth";

export interface PatternTokenUsage {
  spacing: string[];      // e.g., ["gap-sm", "space-y-md", "p-lg"]
  colors: string[];       // e.g., ["primary", "background", "muted-foreground"]
  radius?: string[];      // e.g., ["radius-md"]
  shadows?: string[];     // e.g., ["shadow-sm"]
  typography?: string[];  // e.g., ["font-sans", "text-sm"]
}

export interface PatternVariant {
  id: string;
  name: string;
  description: string;

  /** The actual JSX code - source of truth for preview + export + AI */
  code: string;

  /** Token classes/variables this pattern uses */
  tokens: PatternTokenUsage;

  /** UI components used (for AI to understand building blocks) */
  components: string[];

  /** When AI should suggest this pattern */
  useWhen: string[];

  /** Optional: preview image for faster loading */
  thumbnail?: string;

  /** Who added this variant */
  addedBy: PatternSource;

  /** Can teams/users customize this? */
  customizable: boolean;

  /** If this extends another pattern */
  extends?: string;

  /** Creation timestamp */
  createdAt?: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  description: string;

  /** Which design intents this category applies to */
  intents: DesignIntent[];

  /** Icon name for UI */
  icon: string;

  /** Pattern variants in this category */
  variants: PatternVariant[];

  /** Who added this category */
  addedBy: PatternSource;
}

export interface PatternRegistry {
  version: string;
  lastUpdated: string;
  categories: PatternCategory[];
}

// Helper types for MCP server responses
export interface PatternSearchResult {
  categoryId: string;
  categoryName: string;
  variant: PatternVariant;
  relevanceScore: number;
}

export interface PatternExport {
  pattern: PatternVariant;
  tokens: Record<string, string>;  // Resolved token values from active theme
  code: string;                     // Code with tokens applied
}
