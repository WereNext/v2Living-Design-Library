import { toast } from 'sonner';

interface CardsPreviewProps {
  theme: {
    colors?: Record<string, string>;
    borderRadius?: Record<string, string>;
    shadows?: Record<string, string>;
  };
}

export function CardsPreview({ theme }: CardsPreviewProps) {
  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const getRadius = (key: string, fallback: string) =>
    theme.borderRadius?.[key] || fallback;

  const getShadow = (key: string, fallback: string) =>
    theme.shadows?.[key] || fallback;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Interactive Cards</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="p-6 rounded-lg border transition-shadow hover:shadow-md"
          style={{
            backgroundColor: getColor('card', '#fff'),
            color: getColor('card-foreground', '#000'),
            borderColor: getColor('border', '#e5e5e5'),
            borderRadius: getRadius('radius-lg', '0.75rem'),
            boxShadow: getShadow('shadow-sm', 'none'),
          }}
        >
          <h3 className="font-semibold mb-2">Card Title</h3>
          <p
            className="text-sm mb-4"
            style={{ color: getColor('muted-foreground', '#666') }}
          >
            This card uses your design system tokens for consistent styling.
          </p>
          <button
            onClick={() => toast.success('Learn More clicked!')}
            className="px-3 py-1.5 text-sm rounded-md font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: getColor('primary', '#000'),
              color: getColor('primary-foreground', '#fff'),
              borderRadius: getRadius('radius-sm', '0.375rem'),
            }}
          >
            Learn More
          </button>
        </div>

        <div
          className="p-6 rounded-lg border transition-shadow hover:shadow-md"
          style={{
            backgroundColor: getColor('muted', '#f5f5f5'),
            color: getColor('muted-foreground', '#666'),
            borderColor: getColor('border', '#e5e5e5'),
            borderRadius: getRadius('radius-lg', '0.75rem'),
          }}
        >
          <h3 className="font-semibold mb-2">Muted Card</h3>
          <p className="text-sm mb-4">
            Alternate card style with muted background for visual hierarchy.
          </p>
          <button
            onClick={() => toast.info('Learn More clicked!')}
            className="px-3 py-1.5 text-sm rounded-md font-medium border-2 transition-all hover:opacity-90"
            style={{
              backgroundColor: 'transparent',
              color: getColor('foreground', '#000'),
              borderColor: getColor('border', '#e5e5e5'),
              borderRadius: getRadius('radius-sm', '0.375rem'),
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
