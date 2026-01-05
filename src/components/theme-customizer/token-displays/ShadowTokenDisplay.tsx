interface DynamicShadowTokenProps {
  name: string;
  value: string;
}

export function DynamicShadowToken({ name, value }: DynamicShadowTokenProps) {
  return (
    <div className="p-2 border rounded">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">shadow-{name}</span>
      </div>
      <div
        className="w-full h-12 bg-card rounded flex items-center justify-center"
        style={{ boxShadow: value }}
      >
        <span className="text-xs text-muted-foreground">Preview</span>
      </div>
    </div>
  );
}
