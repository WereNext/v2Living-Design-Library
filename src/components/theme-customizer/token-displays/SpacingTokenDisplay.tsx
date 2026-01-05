interface DynamicSpacingTokenProps {
  name: string;
  value: string;
}

export function DynamicSpacingToken({ name, value }: DynamicSpacingTokenProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded text-xs">
      <span className="text-muted-foreground w-12">{value}</span>
      <div
        className="h-4 bg-primary rounded-sm"
        style={{ width: value }}
      />
    </div>
  );
}
