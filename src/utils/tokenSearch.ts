import { Theme } from "../hooks/useDesignSystems";

export interface TokenSearchResult {
  path: string;
  category: string;
  key: string;
  value: string;
  matches: string[];
}

export function searchTokens(theme: Theme, query: string): TokenSearchResult[] {
  if (!query.trim()) return [];

  const results: TokenSearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  const searchInObject = (obj: Record<string, unknown>, category: string, prefix: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        searchInObject(value as Record<string, unknown>, category, prefix ? `${prefix}.${key}` : key);
      } else {
        const fullPath = prefix ? `${category}.${prefix}.${key}` : `${category}.${key}`;
        const valueStr = String(value).toLowerCase();
        const keyStr = key.toLowerCase();
        const matches: string[] = [];

        // Check if query matches key
        if (keyStr.includes(lowerQuery)) {
          matches.push("key");
        }

        // Check if query matches value
        if (valueStr.includes(lowerQuery)) {
          matches.push("value");
        }

        // Check if query matches category
        if (category.toLowerCase().includes(lowerQuery)) {
          matches.push("category");
        }

        // Fuzzy match
        if (fuzzyMatch(keyStr, lowerQuery) || fuzzyMatch(valueStr, lowerQuery)) {
          matches.push("fuzzy");
        }

        if (matches.length > 0) {
          results.push({
            path: fullPath,
            category,
            key: prefix ? `${prefix}.${key}` : key,
            value: String(value),
            matches,
          });
        }
      }
    });
  };

  // Search through all token categories
  const categories = [
    "colors",
    "typography", 
    "spacing",
    "borderRadius",
    "shadows",
    "opacity",
    "effects",
    "sidebar"
  ];

  categories.forEach(category => {
    const categoryData = (theme as Record<string, unknown>)[category];
    if (categoryData && typeof categoryData === 'object') {
      searchInObject(categoryData as Record<string, unknown>, category);
    }
  });

  return results;
}

function fuzzyMatch(text: string, pattern: string): boolean {
  let textIndex = 0;
  let patternIndex = 0;

  while (textIndex < text.length && patternIndex < pattern.length) {
    if (text[textIndex] === pattern[patternIndex]) {
      patternIndex++;
    }
    textIndex++;
  }

  return patternIndex === pattern.length;
}

export function filterTokens(
  results: TokenSearchResult[],
  filters: {
    category?: string;
    modified?: boolean;
    editedTokens?: Map<string, string>;
  }
): TokenSearchResult[] {
  let filtered = [...results];

  if (filters.category) {
    filtered = filtered.filter(r => r.category === filters.category);
  }

  if (filters.modified && filters.editedTokens) {
    filtered = filtered.filter(r => filters.editedTokens!.has(r.path));
  }

  return filtered;
}

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
