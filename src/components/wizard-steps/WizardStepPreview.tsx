import type { DesignTokens } from '../../types/design-tokens';

interface WizardStepPreviewProps {
  tokens: DesignTokens;
}

export function WizardStepPreview({ tokens }: WizardStepPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border">
        <h3 className="font-semibold mb-4">Live Preview</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg border bg-card"
            style={{
              backgroundColor: tokens.colors?.['card']
                ? `hsl(${tokens.colors['card']})`
                : undefined,
            }}
          >
            <h4 className="font-semibold mb-2">Card Component</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This is how your tokens look on a card component.
            </p>
            <button
              className="px-4 py-2 rounded text-sm font-medium"
              style={{
                backgroundColor: tokens.colors?.['primary']
                  ? `hsl(${tokens.colors['primary']})`
                  : '#000',
                color: tokens.colors?.['primary-foreground']
                  ? `hsl(${tokens.colors['primary-foreground']})`
                  : '#fff',
                borderRadius: tokens.borderRadius?.['radius-md'] || '8px',
              }}
            >
              Primary Button
            </button>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: tokens.colors?.['muted']
                ? `hsl(${tokens.colors['muted']})`
                : '#f5f5f5',
            }}
          >
            <h4 className="font-semibold mb-2">Muted Section</h4>
            <p className="text-sm mb-4">
              Background and foreground colors working together.
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded text-sm"
                style={{
                  backgroundColor: tokens.colors?.['secondary']
                    ? `hsl(${tokens.colors['secondary']})`
                    : '#eee',
                  borderRadius: tokens.borderRadius?.['radius-sm'] || '4px',
                }}
              >
                Secondary
              </button>
              <button
                className="px-3 py-1.5 rounded text-sm border"
                style={{
                  borderRadius: tokens.borderRadius?.['radius-sm'] || '4px',
                }}
              >
                Outline
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tokens.colors &&
          Object.entries(tokens.colors)
            .slice(0, 8)
            .map(([key, value]) => (
              <div
                key={key}
                className="h-24 rounded-lg border flex items-end p-3"
                style={{ backgroundColor: `hsl(${value})` }}
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color: key.includes('foreground')
                      ? `hsl(${value})`
                      : tokens.colors?.['foreground']
                        ? `hsl(${tokens.colors['foreground']})`
                        : '#000',
                  }}
                >
                  {key}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
