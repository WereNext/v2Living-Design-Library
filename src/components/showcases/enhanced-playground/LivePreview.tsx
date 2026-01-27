import { Suspense } from 'react';
import type { LegacyComponentType } from './types';
import { ErrorBoundary, InlineErrorFallback } from '../../ErrorBoundary';
import { getShowcase } from '../../../lib/component-registry';
import {
  ButtonsPreview,
  CardsPreview,
  FormsPreview,
  BadgesPreview,
  InputsPreview,
  SlidersPreview,
  LayoutPreview,
} from './previews';

interface Theme {
  colors?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
}

interface LivePreviewProps {
  theme: Theme;
  componentType: string;
}

// Legacy preview components for original 7 types (optimized inline previews)
const LEGACY_PREVIEW_COMPONENTS: Record<LegacyComponentType, React.ComponentType<{ theme: Theme }>> = {
  buttons: ButtonsPreview,
  cards: CardsPreview,
  forms: FormsPreview,
  badges: BadgesPreview,
  inputs: InputsPreview,
  sliders: SlidersPreview,
  layout: LayoutPreview,
};

export function LivePreview({ theme, componentType }: LivePreviewProps) {
  // Check if we have a legacy optimized preview for this type
  const legacyPreview = LEGACY_PREVIEW_COMPONENTS[componentType as LegacyComponentType];

  if (legacyPreview) {
    const PreviewComponent = legacyPreview;
    return (
      <div className="border rounded-lg p-8 space-y-6 bg-background">
        <ErrorBoundary
          section={`${componentType} Preview`}
          fallback={<InlineErrorFallback message={`Failed to render ${componentType} preview`} />}
        >
          <PreviewComponent theme={theme} />
        </ErrorBoundary>
      </div>
    );
  }

  // For all other component types, use the showcase from the registry
  const showcase = getShowcase(componentType);

  if (!showcase) {
    return (
      <div className="border rounded-lg p-8 space-y-6 bg-background">
        <div className="text-center text-muted-foreground py-12">
          <p>Preview not available for: {componentType}</p>
        </div>
      </div>
    );
  }

  const ShowcaseComponent = showcase.component;

  return (
    <div className="border rounded-lg p-4 bg-background overflow-auto max-h-[600px]">
      <ErrorBoundary
        section={`${componentType} Preview`}
        fallback={<InlineErrorFallback message={`Failed to render ${componentType} preview`} />}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-muted-foreground">
                Loading {showcase.name}...
              </div>
            </div>
          }
        >
          <ShowcaseComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
