import { useState } from 'react';
import { toast } from 'sonner';

interface FormsPreviewProps {
  theme: {
    colors?: Record<string, string>;
    borderRadius?: Record<string, string>;
  };
}

export function FormsPreview({ theme }: FormsPreviewProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const getRadius = (key: string, fallback: string) =>
    theme.borderRadius?.[key] || fallback;

  return (
    <div className="space-y-6 max-w-lg">
      <h4 className="text-sm font-medium text-muted-foreground">Interactive Form Elements</h4>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              toast(e.target.checked ? 'Checked!' : 'Unchecked!');
            }}
            className="w-4 h-4 rounded cursor-pointer"
            style={{
              accentColor: getColor('primary', '#000'),
            }}
          />
          <label
            className="text-sm cursor-pointer"
            onClick={() => setIsChecked(!isChecked)}
          >
            Accept terms and conditions
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Enable notifications</label>
          <button
            onClick={() => {
              setIsSwitchOn(!isSwitchOn);
              toast(isSwitchOn ? 'Turned off' : 'Turned on');
            }}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{
              backgroundColor: isSwitchOn
                ? getColor('primary', '#000')
                : getColor('input', '#e5e5e5'),
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{
                transform: isSwitchOn ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
              }}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            onFocus={() => toast.info('Email input focused')}
            className="w-full px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
            style={{
              backgroundColor: getColor('background', '#fff'),
              color: getColor('foreground', '#000'),
              borderColor: getColor('input', '#e5e5e5'),
              borderRadius: getRadius('radius-md', '0.5rem'),
            }}
          />
        </div>

        <button
          onClick={() => toast.success('Form submitted!')}
          className="w-full px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: getColor('primary', '#000'),
            color: getColor('primary-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          Submit Form
        </button>
      </div>
    </div>
  );
}
