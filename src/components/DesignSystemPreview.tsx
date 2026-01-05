import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Palette, Ruler, Type, Circle, Box as BoxIcon, Sparkles, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DesignSystemPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  systemName: string;
  systemDescription: string;
  designIntents: Array<{ id: string; name: string }>;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  tokenCounts: {
    colors: number;
    spacing: number;
    typography: number;
    borderRadius: number;
    shadows: number;
  };
}

export function DesignSystemPreview({
  open,
  onOpenChange,
  onConfirm,
  systemName,
  systemDescription,
  designIntents,
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  tokenCounts,
}: DesignSystemPreviewProps) {
  // Get primary values for preview components
  const primaryColor = colors.primary || colors['color-1'] || Object.values(colors)[0] || '221.2 83.2% 53.3%';
  const backgroundColor = colors.background || '0 0% 100%';
  const foregroundColor = colors.foreground || '222.2 84% 4.9%';
  const secondaryColor = colors.secondary || colors['color-2'] || Object.values(colors)[1] || '210 40% 96.1%';
  const accentColor = colors.accent || colors['color-3'] || Object.values(colors)[2] || '142.1 76.2% 36.3%';
  
  const mediumSpacing = spacing.md || spacing['spacing-1'] || Object.values(spacing)[0] || '1rem';
  const smallSpacing = spacing.sm || spacing['spacing-2'] || Object.values(spacing)[1] || '0.5rem';
  
  const primaryFont = typography['font-sans'] || typography['font-1'] || Object.values(typography)[0] || 'Inter, system-ui, sans-serif';
  
  const mediumRadius = borderRadius['radius-md'] || borderRadius['radius-1'] || Object.values(borderRadius)[0] || '0.5rem';
  
  const mediumShadow = shadows['shadow-md'] || shadows['shadow-1'] || Object.values(shadows)[0] || '0 4px 6px -1px rgb(0 0 0 / 0.1)';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview Design System
          </DialogTitle>
          <DialogDescription>
            Review your design system before saving. See how your tokens look in action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* System Identity */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">{systemName || 'Untitled Design System'}</h3>
              </div>
              {systemDescription && (
                <p className="text-sm text-muted-foreground">{systemDescription}</p>
              )}
              <div className="flex gap-2 flex-wrap mt-3">
                <Badge variant="secondary">
                  {tokenCounts.colors + tokenCounts.spacing + tokenCounts.typography + tokenCounts.borderRadius + tokenCounts.shadows} Total Tokens
                </Badge>
                <Badge variant="outline">{designIntents.length} Design Intents</Badge>
              </div>
            </div>
          </div>

          {/* Design Intents */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Design Intents
            </h4>
            <div className="flex gap-2 flex-wrap">
              {designIntents.map(intent => (
                <Badge key={intent.id} variant="outline">
                  {intent.name || 'Unnamed Intent'}
                </Badge>
              ))}
            </div>
          </div>

          {/* Live Component Previews */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Component Preview
            </h4>
            
            <div 
              className="p-6 rounded-lg border-2 space-y-4"
              style={{
                background: `hsl(${backgroundColor})`,
                color: `hsl(${foregroundColor})`,
                fontFamily: primaryFont,
              }}
            >
              {/* Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Buttons</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="px-4 py-2 rounded transition-all"
                    style={{
                      background: `hsl(${primaryColor})`,
                      color: `hsl(${backgroundColor})`,
                      borderRadius: mediumRadius,
                      padding: mediumSpacing,
                      boxShadow: mediumShadow,
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded transition-all"
                    style={{
                      background: `hsl(${secondaryColor})`,
                      color: `hsl(${foregroundColor})`,
                      borderRadius: mediumRadius,
                      padding: mediumSpacing,
                    }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded transition-all border-2"
                    style={{
                      borderColor: `hsl(${primaryColor})`,
                      color: `hsl(${primaryColor})`,
                      borderRadius: mediumRadius,
                      padding: mediumSpacing,
                    }}
                  >
                    Outline Button
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Cards</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className="p-4 border-2"
                    style={{
                      background: `hsl(${backgroundColor})`,
                      borderColor: `hsl(${secondaryColor})`,
                      borderRadius: mediumRadius,
                      boxShadow: mediumShadow,
                    }}
                  >
                    <h5 className="font-semibold mb-1" style={{ fontFamily: primaryFont }}>Card Title</h5>
                    <p className="text-sm opacity-70">Card content with your design system tokens applied.</p>
                    <div className="mt-3">
                      <span
                        className="inline-block px-2 py-1 text-xs rounded"
                        style={{
                          background: `hsl(${primaryColor})`,
                          color: `hsl(${backgroundColor})`,
                          borderRadius: smallSpacing,
                        }}
                      >
                        Badge
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-4 border-2"
                    style={{
                      background: `hsl(${accentColor} / 0.1)`,
                      borderColor: `hsl(${accentColor})`,
                      borderRadius: mediumRadius,
                    }}
                  >
                    <h5 className="font-semibold mb-1" style={{ fontFamily: primaryFont }}>Accent Card</h5>
                    <p className="text-sm opacity-70">Using your accent color with transparency.</p>
                  </div>
                </div>
              </div>

              {/* Spacing Examples */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Spacing Scale</p>
                <div className="flex gap-2 items-end">
                  {Object.entries(spacing).slice(0, 5).map(([name, value]) => (
                    <div key={name} className="text-center">
                      <div
                        className="mx-auto mb-1"
                        style={{
                          width: value,
                          height: value,
                          background: `hsl(${primaryColor})`,
                          borderRadius: smallSpacing,
                        }}
                      />
                      <p className="text-xs font-mono">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Token Details */}
          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="colors" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="spacing" className="text-xs">
                <Ruler className="w-3 h-3 mr-1" />
                Spacing
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="radius" className="text-xs">
                <Circle className="w-3 h-3 mr-1" />
                Radius
              </TabsTrigger>
              <TabsTrigger value="shadows" className="text-xs">
                <BoxIcon className="w-3 h-3 mr-1" />
                Shadows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(colors).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-2 p-2 border rounded">
                    <div
                      className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                      style={{ background: `hsl(${value})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="spacing" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(spacing).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-3 p-2 border rounded">
                    <div
                      className="flex-shrink-0 bg-primary/20 rounded"
                      style={{ width: value, height: '2rem' }}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-4">
              <div className="space-y-2">
                {Object.entries(typography).map(([name, value]) => (
                  <div key={name} className="p-3 border rounded">
                    <p className="text-xs font-semibold mb-1">{name}</p>
                    <p className="text-xs text-muted-foreground font-mono mb-2">{value}</p>
                    <p style={{ fontFamily: value.includes('font') ? value : undefined }}>
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="radius" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(borderRadius).map(([name, value]) => (
                  <div key={name} className="text-center p-3 border rounded">
                    <div
                      className="w-16 h-16 mx-auto mb-2 bg-primary/20 border-2 border-primary"
                      style={{ borderRadius: value }}
                    />
                    <p className="text-xs font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shadows" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(shadows).map(([name, value]) => (
                  <div key={name} className="p-3 border rounded">
                    <div
                      className="w-full h-16 bg-background rounded mb-2"
                      style={{ boxShadow: value }}
                    />
                    <p className="text-xs font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground font-mono break-all">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Go Back & Edit
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Looks Good - Save System
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
