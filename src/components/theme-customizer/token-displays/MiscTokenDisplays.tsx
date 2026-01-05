interface DynamicAnimationTokenProps {
  name: string;
  value: string;
}

export function DynamicAnimationToken({ name, value }: DynamicAnimationTokenProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div>
        <div className="text-xs text-muted-foreground">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
    </div>
  );
}

interface DynamicBorderTokenProps {
  name: string;
  value: string;
}

export function DynamicBorderToken({ name, value }: DynamicBorderTokenProps) {
  return (
    <div className="p-2 border rounded">
      <div className="text-xs text-muted-foreground mb-2">{name}</div>
      <div
        className="w-full h-12 bg-muted rounded"
        style={{ border: value }}
      />
    </div>
  );
}

interface DynamicOpacityTokenProps {
  name: string;
  value: number;
}

export function DynamicOpacityToken({ name, value }: DynamicOpacityTokenProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-primary/10">
        <div
          className="absolute inset-0 bg-primary"
          style={{ opacity: value }}
        />
      </div>
    </div>
  );
}

interface DynamicEffectTokenProps {
  name: string;
  value: string;
}

export function DynamicEffectToken({ name, value }: DynamicEffectTokenProps) {
  return (
    <div className="p-2 border rounded">
      <div className="text-xs text-muted-foreground mb-2">{name}</div>
      <div className="relative w-full h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded overflow-hidden">
        <div
          className="absolute inset-0 bg-card/80 flex items-center justify-center"
          style={{ backdropFilter: value }}
        >
          <span className="text-xs font-medium">Frosted</span>
        </div>
      </div>
      <code className="text-xs text-muted-foreground block mt-1 truncate">{value}</code>
    </div>
  );
}
