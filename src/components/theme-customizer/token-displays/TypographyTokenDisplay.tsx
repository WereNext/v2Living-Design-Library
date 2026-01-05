interface DynamicTypographyTokenProps {
  name: string;
  value: string;
}

export function DynamicTypographyToken({ name, value }: DynamicTypographyTokenProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div>
        <div className="text-xs text-muted-foreground">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div className={`text-${value}`}>Aa</div>
    </div>
  );
}

interface CompactTypeExampleProps {
  size: string;
  label: string;
}

export function CompactTypeExample({ size, label }: CompactTypeExampleProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <code className="text-xs text-muted-foreground">text-{size}</code>
      </div>
      <div className={`text-${size}`}>Aa</div>
    </div>
  );
}
