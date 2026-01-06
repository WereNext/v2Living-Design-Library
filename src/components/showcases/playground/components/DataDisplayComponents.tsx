import { useState } from "react";
import { Label } from "../../../ui/label";
import { Slider } from "../../../ui/slider";
import { Progress } from "../../../ui/progress";
import { Separator } from "../../../ui/separator";
import type { PlaygroundComponent } from "../types";

// Wrapper component for stateful slider preview
function SliderProgressPreview() {
  const [sliderValue, setSliderValue] = useState([50]);
  const progress = 60;

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label>Volume: {sliderValue[0]}%</Label>
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Upload Progress</Label>
        <Progress value={progress} />
        <p className="text-xs text-muted-foreground">{progress}% complete</p>
      </div>

      <div className="space-y-2">
        <Label>Processing</Label>
        <Progress value={33} />
        <p className="text-xs text-muted-foreground">33% complete</p>
      </div>
    </div>
  );
}

export const sliderProgress: PlaygroundComponent = {
  id: "slider-progress",
  name: "Slider & Progress",
  category: "Data Display",
  code: `import { Slider } from "./components/ui/slider";
import { Progress } from "./components/ui/progress";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { useState } from "react";

export function SliderProgress() {
  const [value, setValue] = useState([50]);

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label>Volume: {value[0]}%</Label>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Upload Progress</Label>
        <Progress value={60} />
        <p className="text-xs text-muted-foreground">
          60% complete
        </p>
      </div>

      <div className="space-y-2">
        <Label>Processing</Label>
        <Progress value={33} />
        <p className="text-xs text-muted-foreground">
          33% complete
        </p>
      </div>
    </div>
  );
}`,
  preview: <SliderProgressPreview />
};

export const dataDisplayComponents = [sliderProgress];
