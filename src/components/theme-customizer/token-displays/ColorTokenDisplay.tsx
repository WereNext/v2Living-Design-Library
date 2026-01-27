interface DynamicColorTokenProps {
  name: string;
  value: string;
}

export function DynamicColorToken({ name, value }: DynamicColorTokenProps) {
  // Handle multiple color formats: hsl(), hex, or raw HSL values
  let cssColor = value;
  if (value.startsWith('#') || value.startsWith('rgb')) {
    cssColor = value; // Use hex/rgb directly
  } else if (!value.startsWith('hsl(') && !value.startsWith('oklch')) {
    cssColor = `hsl(${value})`; // Wrap raw HSL values
  }

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium">{name}</div>
      <div
        className="aspect-[4/3] min-h-[60px] rounded-lg border shadow-sm"
        style={{ backgroundColor: cssColor }}
      />
      <code className="text-xs text-muted-foreground block truncate">{value}</code>
    </div>
  );
}

interface ColorTokenProps {
  name: string;
  token: string;
  foreground: string;
}

export function ColorToken({ name, token, foreground }: ColorTokenProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium">{name}</div>
      <div
        className="aspect-[4/3] min-h-[60px] rounded-lg border shadow-sm"
        style={{ backgroundColor: `hsl(var(${token}))` }}
      />
      <code className="text-xs text-muted-foreground block truncate">{token}</code>
    </div>
  );
}

interface SimpleColorTokenProps {
  name: string;
  token: string;
}

export function SimpleColorToken({ name, token }: SimpleColorTokenProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium truncate">{name}</div>
      <div
        className="aspect-[4/3] min-h-[60px] rounded-lg border shadow-sm"
        style={{ backgroundColor: `hsl(var(${token}))` }}
      />
      <code className="text-xs text-muted-foreground block truncate">{token}</code>
    </div>
  );
}
