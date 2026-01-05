interface LayoutPreviewProps {
  theme: {
    colors?: Record<string, string>;
    borderRadius?: Record<string, string>;
  };
}

export function LayoutPreview({ theme }: LayoutPreviewProps) {
  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const getRadius = (key: string, fallback: string) =>
    theme.borderRadius?.[key] || fallback;

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-medium text-muted-foreground">Layout Grid</h4>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="p-6 rounded-lg border flex items-center justify-center"
            style={{
              backgroundColor: getColor('card', '#fff'),
              borderColor: getColor('border', '#e5e5e5'),
              borderRadius: getRadius('radius-md', '0.5rem'),
            }}
          >
            <span className="text-sm font-medium">Item {item}</span>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-medium text-muted-foreground mt-6">Dividers</h4>
      <div className="space-y-4">
        <div
          className="h-px"
          style={{ backgroundColor: getColor('border', '#e5e5e5') }}
        />
        <div
          className="h-0.5"
          style={{ backgroundColor: getColor('primary', '#000') }}
        />
        <div
          className="h-1"
          style={{ backgroundColor: getColor('muted', '#f5f5f5') }}
        />
      </div>
    </div>
  );
}
