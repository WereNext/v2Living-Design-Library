import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Card, CardContent } from "../ui-adapters/Card";
import { Badge } from "../ui-adapters/Badge";
import { Hand, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function TouchGesturesShowcase() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tapCount, setTapCount] = useState(0);

  const sections = [
    { id: "tap-gestures", title: "Tap Gestures" },
    { id: "pinch-zoom", title: "Pinch & Zoom" },
    { id: "drag-drop", title: "Drag & Drop" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="tap-gestures"
        title="Tap Gestures"
        description="Single tap, double tap, and long press interactions"
      >
        <div className="max-w-md mx-auto space-y-md">
          <Card>
            <CardContent className="p-xl">
              <div className="text-center space-y-lg">
                <div
                  className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-4xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  onClick={() => {
                    setTapCount(tapCount + 1);
                    toast("Tapped!");
                  }}
                >
                  👆
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-xs">Tap Count</p>
                  <Badge variant="secondary" className="text-lg px-md py-xs">
                    {tapCount}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTapCount(0)}
                >
                  Reset Counter
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-md">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => toast("Single tap detected!")}
            >
              <CardContent className="p-lg text-center">
                <div className="text-3xl mb-xs">👆</div>
                <p className="text-sm font-semibold">Single Tap</p>
                <p className="text-xs text-muted-foreground mt-1">Click once</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onDoubleClick={() => toast.success("Double tap detected!")}
            >
              <CardContent className="p-lg text-center">
                <div className="text-3xl mb-xs">👆👆</div>
                <p className="text-sm font-semibold">Double Tap</p>
                <p className="text-xs text-muted-foreground mt-1">Double click</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onContextMenu={(e) => {
                e.preventDefault();
                toast("Long press detected!");
              }}
            >
              <CardContent className="p-lg text-center">
                <div className="text-3xl mb-xs">🖐️</div>
                <p className="text-sm font-semibold">Long Press</p>
                <p className="text-xs text-muted-foreground mt-1">Right click</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => toast("Touch target hit!")}
            >
              <CardContent className="p-lg text-center">
                <div className="text-3xl mb-xs">🎯</div>
                <p className="text-sm font-semibold">Touch Target</p>
                <p className="text-xs text-muted-foreground mt-1">44x44 min</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="pinch-zoom"
        title="Pinch & Zoom"
        description="Pinch to zoom and pan gestures"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-lg">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-xl mb-md relative overflow-hidden">
                <div
                  className="transition-transform duration-200 origin-center"
                  style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-md">🖼️</div>
                    <p className="font-semibold">Zoomable Content</p>
                    <p className="text-sm text-muted-foreground">Scale: {scale.toFixed(1)}x</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-xs mb-md">
                <Button
                  variant="outline"
                  onClick={() => setScale(Math.min(scale + 0.2, 3))}
                >
                  <ZoomIn className="w-4 h-4 mr-xs" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setScale(Math.max(scale - 0.2, 0.5))}
                >
                  <ZoomOut className="w-4 h-4 mr-xs" />
                  Zoom Out
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                  toast("Reset to original size");
                }}
              >
                <Maximize2 className="w-4 h-4 mr-xs" />
                Reset Zoom
              </Button>
            </CardContent>
          </Card>

          <div className="mt-md p-md bg-muted rounded-lg">
            <div className="flex items-center gap-xs text-sm text-muted-foreground">
              <Hand className="w-4 h-4" />
              <p>Use the zoom buttons to simulate pinch gestures</p>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="drag-drop"
        title="Drag & Drop"
        description="Touch-based drag and drop interactions"
      >
        <div className="max-w-md mx-auto space-y-md">
          <Card>
            <CardContent className="p-lg">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-xl min-h-[300px] flex flex-col items-center justify-center">
                <div
                  className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-3xl cursor-move hover:scale-105 active:scale-95 transition-transform shadow-lg"
                  draggable
                  onDragStart={() => toast("Started dragging")}
                  onDragEnd={() => toast.success("Dropped!")}
                >
                  📦
                </div>
                <p className="text-sm text-muted-foreground mt-md">
                  Drag me around
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-md">
            {[
              { emoji: "📱", label: "Phone" },
              { emoji: "💻", label: "Laptop" },
              { emoji: "⌚", label: "Watch" },
            ].map((item) => (
              <Card
                key={item.label}
                className="cursor-move hover:shadow-lg transition-all hover:-translate-y-1"
                draggable
                onDragStart={() => toast(`Dragging ${item.label}`)}
              >
                <CardContent className="p-md text-center">
                  <div className="text-3xl mb-xs">{item.emoji}</div>
                  <p className="text-xs">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-dashed">
            <CardContent
              className="p-xl text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => toast.success("Item dropped in zone!")}
            >
              <Move className="w-8 h-8 mx-auto mb-xs text-muted-foreground" />
              <p className="text-sm font-semibold">Drop Zone</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag items here
              </p>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
