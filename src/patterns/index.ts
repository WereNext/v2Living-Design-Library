/**
 * Pattern Registry
 *
 * Central registry of all UI patterns in the design system.
 * Consumed by:
 * - UI Preview: Renders patterns for human review
 * - MCP Server: Exposes patterns for AI agents
 * - Export: Generates copy-paste code for developers
 */

import type { PatternRegistry, PatternCategory, PatternVariant, PatternSearchResult } from "./types";
import { emailCapturePatterns } from "./email-capture";

// All system patterns
const systemPatterns: PatternCategory[] = [
  emailCapturePatterns,
  // Add more pattern categories here as they're migrated:
  // heroPatterns,
  // buttonPatterns,
  // formPatterns,
  // etc.
];

// Registry instance
export const patternRegistry: PatternRegistry = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  categories: systemPatterns,
};

// ============================================================================
// Registry Query Functions (used by UI and MCP server)
// ============================================================================

/**
 * Get all pattern categories
 */
export function getAllCategories(): PatternCategory[] {
  return patternRegistry.categories;
}

/**
 * Get a specific category by ID
 */
export function getCategoryById(categoryId: string): PatternCategory | undefined {
  return patternRegistry.categories.find(c => c.id === categoryId);
}

/**
 * Get a specific pattern variant
 */
export function getPatternVariant(categoryId: string, variantId: string): PatternVariant | undefined {
  const category = getCategoryById(categoryId);
  return category?.variants.find(v => v.id === variantId);
}

/**
 * Get all patterns for a specific design intent
 */
export function getPatternsForIntent(intent: string): PatternCategory[] {
  return patternRegistry.categories.filter(c =>
    c.intents.includes(intent as any)
  );
}

/**
 * Search patterns by keywords (for AI agent queries)
 */
export function searchPatterns(query: string): PatternSearchResult[] {
  const queryLower = query.toLowerCase();
  const results: PatternSearchResult[] = [];

  for (const category of patternRegistry.categories) {
    for (const variant of category.variants) {
      let score = 0;

      // Check name match
      if (variant.name.toLowerCase().includes(queryLower)) score += 10;

      // Check description match
      if (variant.description.toLowerCase().includes(queryLower)) score += 5;

      // Check useWhen matches
      for (const useCase of variant.useWhen) {
        if (useCase.toLowerCase().includes(queryLower)) score += 8;
      }

      // Check component matches
      for (const component of variant.components) {
        if (component.toLowerCase().includes(queryLower)) score += 3;
      }

      if (score > 0) {
        results.push({
          categoryId: category.id,
          categoryName: category.name,
          variant,
          relevanceScore: score,
        });
      }
    }
  }

  // Sort by relevance
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get patterns that use specific tokens (for AI to understand token usage)
 */
export function getPatternsUsingToken(tokenClass: string): PatternSearchResult[] {
  const results: PatternSearchResult[] = [];

  for (const category of patternRegistry.categories) {
    for (const variant of category.variants) {
      const allTokens = [
        ...(variant.tokens.spacing || []),
        ...(variant.tokens.colors || []),
        ...(variant.tokens.radius || []),
        ...(variant.tokens.shadows || []),
        ...(variant.tokens.typography || []),
      ];

      if (allTokens.some(t => t.includes(tokenClass))) {
        results.push({
          categoryId: category.id,
          categoryName: category.name,
          variant,
          relevanceScore: 1,
        });
      }
    }
  }

  return results;
}

/**
 * Export pattern registry as JSON (for MCP server)
 */
export function exportRegistryAsJSON(): string {
  return JSON.stringify(patternRegistry, null, 2);
}

// Re-export types
export type { PatternRegistry, PatternCategory, PatternVariant, PatternSearchResult, PatternExport } from "./types";
