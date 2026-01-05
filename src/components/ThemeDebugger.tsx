import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAppState } from "../contexts/AppStateContext";

/**
 * Debug component to show active theme tokens
 * Helps visualize when spacing and typography change
 */
export function ThemeDebugger() {
  const { activeTheme, activeSystem } = useAppState();

  if (!activeTheme || !activeSystem) return null;

  return (
    <Card className="mb-6 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          🎨 Active Theme: {activeSystem.name} → {activeTheme.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        {/* Font Family */}
        <div className="flex items-center gap-2">
          <strong>Font:</strong>
          <code className="bg-background px-2 py-1 rounded">
            {activeTheme.typography?.['font-sans'] || 'Not set'}
          </code>
        </div>

        {/* Spacing Scale */}
        <div>
          <strong>Spacing:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(activeTheme.spacing || {}).map(([key, value]) => (
              <code key={key} className="bg-background px-2 py-1 rounded">
                {key}: {value}
              </code>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div className="flex items-center gap-2">
          <strong>Radius:</strong>
          <code className="bg-background px-2 py-1 rounded">
            {activeTheme.borderRadius?.['radius-lg'] || 'Not set'}
          </code>
        </div>

        {/* Visual Examples */}
        <div className="pt-2 border-t">
          <strong className="block mb-2">Visual Test:</strong>
          <div className="space-y-2">
            {/* These divs use theme spacing to show visual differences */}
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 bg-primary" style={{ borderRadius: 'var(--radius-sm)' }} />
              <div className="w-8 h-8 bg-primary" style={{ borderRadius: 'var(--radius-md)' }} />
              <div className="w-8 h-8 bg-primary" style={{ borderRadius: 'var(--radius-lg)' }} />
              <span className="text-muted-foreground">Border Radius</span>
            </div>
            <div style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '16px'
            }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
