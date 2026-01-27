import { Suspense } from 'react';
import { getShowcase } from '../lib/component-registry';

interface ComponentShowcaseProps {
  category: string;
  designIntent?: string;
}

/**
 * Dynamic Component Showcase
 *
 * Uses the component registry to render showcases dynamically.
 * No more hardcoded if/switch statements!
 */
export function ComponentShowcase({ category, designIntent = "web-app" }: ComponentShowcaseProps) {
  // Default to playground if category not found
  const showcase = getShowcase(category) || getShowcase('playground');

  if (!showcase) {
    // Ultimate fallback - should never happen
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Component not found: {category}
      </div>
    );
  }

  const Component = showcase.component;

  // Wrap in Suspense for lazy-loaded components
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">
            Loading {showcase.name}...
          </div>
        </div>
      }
    >
      {showcase.acceptsIntent ? (
        <Component designIntent={designIntent} />
      ) : (
        <Component />
      )}
    </Suspense>
  );
}
