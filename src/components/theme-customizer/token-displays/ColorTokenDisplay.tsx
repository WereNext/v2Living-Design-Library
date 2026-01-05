interface DynamicColorTokenProps {
  name: string;
  value: string;
}

export function DynamicColorToken({ name, value }: DynamicColorTokenProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs">{name}</div>
      <div
        className="h-16 rounded border flex items-center justify-center"
        style={{
          backgroundColor: `hsl(${value})`,
          color: `hsl(${value})`,
        }}
      >
        <div className="text-center">
          <div className="text-sm">Aa</div>
        </div>
      </div>
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
      <div className="text-xs">{name}</div>
      <div
        className="h-16 rounded border flex items-center justify-center"
        style={{
          backgroundColor: `hsl(var(${token}))`,
          color: `hsl(var(${foreground}))`,
        }}
      >
        <div className="text-center">
          <div className="text-sm">Aa</div>
        </div>
      </div>
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
      <div className="text-xs truncate">{name}</div>
      <div
        className="h-12 rounded border"
        style={{ backgroundColor: `hsl(var(${token}))` }}
      />
      <code className="text-xs text-muted-foreground block truncate">{token}</code>
    </div>
  );
}
