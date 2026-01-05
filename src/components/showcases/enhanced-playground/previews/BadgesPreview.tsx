interface BadgesPreviewProps {
  theme: {
    colors?: Record<string, string>;
  };
}

export function BadgesPreview({ theme }: BadgesPreviewProps) {
  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Badge Variants</h4>
      <div className="flex flex-wrap gap-2">
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: getColor('primary', '#000'),
            color: getColor('primary-foreground', '#fff'),
          }}
        >
          Primary
        </span>
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: getColor('secondary', '#666'),
            color: getColor('secondary-foreground', '#fff'),
          }}
        >
          Secondary
        </span>
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full border"
          style={{
            backgroundColor: 'transparent',
            color: getColor('foreground', '#000'),
            borderColor: getColor('border', '#e5e5e5'),
          }}
        >
          Outline
        </span>
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: getColor('destructive', '#ef4444'),
            color: getColor('destructive-foreground', '#fff'),
          }}
        >
          Destructive
        </span>
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: getColor('accent', '#f1f5f9'),
            color: getColor('accent-foreground', '#000'),
          }}
        >
          Accent
        </span>
        <span
          className="px-2.5 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: getColor('muted', '#f5f5f5'),
            color: getColor('muted-foreground', '#666'),
          }}
        >
          Muted
        </span>
      </div>

      <h4 className="text-sm font-medium text-muted-foreground mt-6">Status Badges</h4>
      <div className="flex flex-wrap gap-2">
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
          Success
        </span>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500 text-white">
          Warning
        </span>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
          Error
        </span>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500 text-white">
          Info
        </span>
      </div>
    </div>
  );
}
