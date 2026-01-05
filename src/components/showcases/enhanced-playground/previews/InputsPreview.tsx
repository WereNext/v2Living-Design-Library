import { toast } from 'sonner';

interface InputsPreviewProps {
  theme: {
    colors?: Record<string, string>;
    borderRadius?: Record<string, string>;
  };
}

export function InputsPreview({ theme }: InputsPreviewProps) {
  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const getRadius = (key: string, fallback: string) =>
    theme.borderRadius?.[key] || fallback;

  const inputStyle = {
    backgroundColor: getColor('background', '#fff'),
    color: getColor('foreground', '#000'),
    borderColor: getColor('input', '#e5e5e5'),
    borderRadius: getRadius('radius-md', '0.5rem'),
  };

  return (
    <div className="space-y-4 max-w-md">
      <h4 className="text-sm font-medium text-muted-foreground">Text Inputs</h4>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Enter text..."
          onFocus={() => toast.info('Text input focused')}
          className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email address..."
          onFocus={() => toast.info('Email input focused')}
          className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password..."
          onFocus={() => toast.info('Password input focused')}
          className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
          style={inputStyle}
        />
        <textarea
          placeholder="Enter a longer message..."
          rows={4}
          onFocus={() => toast.info('Textarea focused')}
          className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors resize-none"
          style={inputStyle}
        />
      </div>
    </div>
  );
}
