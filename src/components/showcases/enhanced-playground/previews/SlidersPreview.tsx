import { useState } from 'react';
import { toast } from 'sonner';

interface SlidersPreviewProps {
  theme: {
    colors?: Record<string, string>;
  };
}

export function SlidersPreview({ theme }: SlidersPreviewProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(65);

  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const primaryColor = getColor('primary', '#000');
  const mutedColor = getColor('muted', '#e5e5e5');

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Volume Slider</h4>
          <span className="text-sm font-medium">{sliderValue[0]}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue[0]}
          onChange={(e) => {
            setSliderValue([parseInt(e.target.value)]);
            toast.info(`Volume: ${e.target.value}%`);
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${sliderValue[0]}%, ${mutedColor} ${sliderValue[0]}%, ${mutedColor} 100%)`,
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Upload Progress</h4>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: mutedColor }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: primaryColor,
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newProgress = Math.min(progress + 10, 100);
              setProgress(newProgress);
              toast.success(`Progress: ${newProgress}%`);
            }}
            className="px-3 py-1 text-sm rounded-md"
            style={{
              backgroundColor: primaryColor,
              color: getColor('primary-foreground', '#fff'),
            }}
          >
            +10%
          </button>
          <button
            onClick={() => {
              const newProgress = Math.max(progress - 10, 0);
              setProgress(newProgress);
              toast.info(`Progress: ${newProgress}%`);
            }}
            className="px-3 py-1 text-sm rounded-md border"
            style={{
              borderColor: getColor('border', '#e5e5e5'),
            }}
          >
            -10%
          </button>
        </div>
      </div>
    </div>
  );
}
