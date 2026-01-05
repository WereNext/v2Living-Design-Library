interface DynamicRadiusTokenProps {
  name: string;
  value: string;
}

export function DynamicRadiusToken({ name, value }: DynamicRadiusTokenProps) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div
        className="w-12 h-12 bg-primary flex-shrink-0"
        style={{ borderRadius: value }}
      />
    </div>
  );
}

interface CompactRadiusExampleProps {
  size: string;
  label: string;
  token: string;
}

export function CompactRadiusExample({ size, label, token }: CompactRadiusExampleProps) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs">{label}</div>
        <code className="text-xs text-muted-foreground">{token}</code>
      </div>
      <div
        className="w-12 h-12 bg-primary flex-shrink-0"
        style={{ borderRadius: `var(${token})` }}
      />
    </div>
  );
}
