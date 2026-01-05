import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TokenEditor } from '../TokenEditor';
import type { DesignTokens } from '../../types/design-tokens';

type PreviewMode = 'tokens' | 'visual' | 'edit';

interface WizardStepTokensProps {
  tokens: DesignTokens;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onTokensChange: (tokens: DesignTokens) => void;
}

export function WizardStepTokens({
  tokens,
  previewMode,
  onPreviewModeChange,
  onTokensChange,
}: WizardStepTokensProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Your Design Tokens</h3>
        <Tabs
          value={previewMode}
          onValueChange={(v) => onPreviewModeChange(v as PreviewMode)}
        >
          <TabsList>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="tokens">Code</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {previewMode === 'edit' ? (
        <TokenEditor tokens={tokens} onChange={onTokensChange} />
      ) : previewMode === 'visual' ? (
        <TokenVisualPreview tokens={tokens} />
      ) : (
        <div className="bg-muted rounded-lg p-4">
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function TokenVisualPreview({ tokens }: { tokens: DesignTokens }) {
  return (
    <div className="space-y-4">
      {/* Colors */}
      {tokens.colors && Object.keys(tokens.colors).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Colors ({Object.keys(tokens.colors).length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(tokens.colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div
                  className="h-16 rounded-lg border"
                  style={{ backgroundColor: `hsl(${value})` }}
                />
                <div>
                  <p className="text-xs font-medium truncate">{key}</p>
                  <code className="text-xs text-muted-foreground">{value}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacing */}
      {tokens.spacing && Object.keys(tokens.spacing).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Spacing ({Object.keys(tokens.spacing).length})
          </h4>
          <div className="space-y-2">
            {Object.entries(tokens.spacing).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-2 border rounded">
                <code className="text-xs text-muted-foreground w-24">{key}</code>
                <div
                  className="h-4 bg-primary rounded"
                  style={{ width: value }}
                />
                <span className="text-xs text-muted-foreground ml-auto">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Border Radius */}
      {tokens.borderRadius && Object.keys(tokens.borderRadius).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Border Radius ({Object.keys(tokens.borderRadius).length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(tokens.borderRadius).map(([key, value]) => (
              <div key={key} className="p-3 border rounded text-center">
                <div
                  className="w-12 h-12 bg-primary mx-auto mb-2"
                  style={{ borderRadius: value }}
                />
                <p className="text-xs font-medium">{key}</p>
                <code className="text-xs text-muted-foreground">{value}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shadows */}
      {tokens.shadows && Object.keys(tokens.shadows).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Shadows ({Object.keys(tokens.shadows).length})
          </h4>
          <div className="space-y-3">
            {Object.entries(tokens.shadows).map(([key, value]) => (
              <div key={key} className="p-4 border rounded">
                <div
                  className="w-full h-16 bg-card rounded flex items-center justify-center"
                  style={{ boxShadow: value }}
                >
                  <span className="text-xs font-medium">{key}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
