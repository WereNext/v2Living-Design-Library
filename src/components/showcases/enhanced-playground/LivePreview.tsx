import type { ComponentType } from './types';
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
  componentType: ComponentType;
}

const PREVIEW_COMPONENTS: Record<ComponentType, React.ComponentType<{ theme: Theme }>> = {
  buttons: ButtonsPreview,
  cards: CardsPreview,
  forms: FormsPreview,
  badges: BadgesPreview,
  inputs: InputsPreview,
  sliders: SlidersPreview,
  layout: LayoutPreview,
};

export function LivePreview({ theme, componentType }: LivePreviewProps) {
  const PreviewComponent = PREVIEW_COMPONENTS[componentType];

  return (
    <div className="border rounded-lg p-8 space-y-6 bg-background">
      <PreviewComponent theme={theme} />
    </div>
  );
}
