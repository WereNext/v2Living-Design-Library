import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Palette, Type, Sparkles, Droplet, Ruler, Layers, Save, Check, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useState } from "react";
import { SaveDesignSystemDialog } from "./SaveDesignSystemDialog";
import { Badge } from "./ui/badge";
import { useAppState } from "../contexts/AppStateContext";

export type ColorTheme = 'neo' | 'brutalist' | 'glassmorphism' | 'candy' | 'material' | 'minimal';
export type FontFamily = 'inter' | 'spaceGrotesk' | 'jetbrainsMono' | 'poppins' | 'playfairDisplay' | 'manrope' | 'system';
export type VisualFeel = 'modern' | 'classic' | 'playful' | 'minimal' | 'bold';

interface ThemeCustomizerProps {
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  visualFeel: VisualFeel;
  onColorThemeChange: (theme: ColorTheme) => void;
  onFontFamilyChange: (font: FontFamily) => void;
  onVisualFeelChange: (feel: VisualFeel) => void;
  activeTheme: any; // Legacy prop - we'll use context instead
  onSaveAsDesignSystem?: (data: {
    name: string;
    description?: string;
    colorTheme: ColorTheme;
    fontFamily: FontFamily;
    visualFeel: VisualFeel;
  }) => void;
  onRestartWizard?: () => void;
}

const colorThemes = [
  { value: 'neo' as const, label: 'Neo', description: 'Modern gradient mesh' },
  { value: 'brutalist' as const, label: 'Brutalist', description: 'Raw & unpolished' },
  { value: 'glassmorphism' as const, label: 'Glass', description: 'Frosted & translucent' },
  { value: 'candy' as const, label: 'Candy', description: 'Playful pastels' },
  { value: 'material' as const, label: 'Material', description: 'Google Material Design' },
  { value: 'minimal' as const, label: 'Minimal', description: 'Less is more' },
];

const fontFamilies = [
  { value: 'inter' as const, label: 'Inter', description: 'Clean & versatile' },
  { value: 'spaceGrotesk' as const, label: 'Space Grotesk', description: 'Geometric & modern' },
  { value: 'jetbrainsMono' as const, label: 'JetBrains Mono', description: 'Developer-focused' },
  { value: 'poppins' as const, label: 'Poppins', description: 'Friendly & rounded' },
  { value: 'playfairDisplay' as const, label: 'Playfair Display', description: 'Elegant serif' },
  { value: 'manrope' as const, label: 'Manrope', description: 'Contemporary sans' },
  { value: 'system' as const, label: 'System', description: 'Default system font' },
];

const visualFeels = [
  { value: 'modern' as const, label: 'Modern', description: 'Sharp corners, clean lines' },
  { value: 'classic' as const, label: 'Classic', description: 'Timeless design' },
  { value: 'playful' as const, label: 'Playful', description: 'Rounded and fun' },
  { value: 'minimal' as const, label: 'Minimal', description: 'Less is more' },
  { value: 'bold' as const, label: 'Bold', description: 'Strong visual presence' },
];

export function ThemeCustomizer({
  colorTheme,
  fontFamily,
  visualFeel,
  onColorThemeChange,
  onFontFamilyChange,
  onVisualFeelChange,
  activeTheme,
  onSaveAsDesignSystem,
  onRestartWizard,
}: ThemeCustomizerProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'themes' | 'custom'>('themes');
  
  // Get state from context (this overrides props)
  const { 
    activeSystemId, 
    activeSystem,
    activeTheme: contextActiveTheme,
    getSystem, 
    setActiveTheme,
    colorTheme: contextColorTheme,
    fontFamily: contextFontFamily,
    visualFeel: contextVisualFeel,
    setColorTheme,
    setFontFamily,
    setVisualFeel,
  } = useAppState();
  
  // Use context values instead of props
  const currentColorTheme = contextColorTheme;
  const currentFontFamily = contextFontFamily;
  const currentVisualFeel = contextVisualFeel;
  const currentActiveTheme = contextActiveTheme;
  
  const themes = activeSystem?.themes || [];
  const activeThemeId = activeSystem?.activeThemeId;

  console.log('🎨 ThemeCustomizer Render:', {
    activeThemeName: currentActiveTheme?.name,
    activeThemeId: currentActiveTheme?.id,
    systemName: activeSystem?.name,
    systemId: activeSystem?.id,
    colorsCount: currentActiveTheme?.colors ? Object.keys(currentActiveTheme.colors).length : 0,
    typographyCount: currentActiveTheme?.typography ? Object.keys(currentActiveTheme.typography).length : 0,
    spacingCount: currentActiveTheme?.spacing ? Object.keys(currentActiveTheme.spacing).length : 0,
    firstColorKey: currentActiveTheme?.colors ? Object.keys(currentActiveTheme.colors)[0] : 'none',
    firstColorValue: currentActiveTheme?.colors ? Object.values(currentActiveTheme.colors)[0] : 'none'
  });

  const handleThemeSwitch = (themeId: string) => {
    if (activeSystemId) {
      setActiveTheme(activeSystemId, themeId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Theme Selection Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'themes' | 'custom')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="themes">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Palette className="w-3.5 h-3.5 mr-1.5" />
            Custom
          </TabsTrigger>
        </TabsList>

        {/* THEMES TAB - Shows all themes from active design system */}
        <TabsContent value="themes" className="space-y-3 mt-4">
          {activeSystem && (
            <>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{activeSystem.name}</p>
                  <Badge variant="secondary" className="text-xs h-5">
                    {themes.length} {themes.length === 1 ? 'Theme' : 'Themes'}
                  </Badge>
                </div>
                {activeSystem.description && (
                  <p className="text-xs text-muted-foreground">{activeSystem.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Available Themes</Label>
                <div className="grid gap-2">
                  {themes.map((theme) => {
                    const isActive = activeThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeSwitch(theme.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:border-primary/50 ${
                          isActive 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-card hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-sm">{theme.name}</span>
                          {isActive && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        {theme.description && (
                          <p className="text-xs text-muted-foreground">{theme.description}</p>
                        )}
                        
                        {/* Color preview swatches */}
                        <div className="flex gap-1 mt-2">
                          {theme.colors['primary'] && (
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: `hsl(${theme.colors['primary']})` }}
                              title="Primary"
                            />
                          )}
                          {theme.colors['secondary'] && (
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: `hsl(${theme.colors['secondary']})` }}
                              title="Secondary"
                            />
                          )}
                          {theme.colors['accent'] && (
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: `hsl(${theme.colors['accent']})` }}
                              title="Accent"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!activeSystem && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No active design system. Import or create one to get started.
            </div>
          )}
        </TabsContent>

        {/* CUSTOM TAB */}
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Custom overrides:</strong> These settings layer on top of your active theme, allowing you to fine-tune colors, typography, and visual feel.
            </p>
          </div>
          
          <Accordion type="multiple" defaultValue={["colors", "typography", "visual"]} className="w-full">
            <AccordionItem value="colors">
              <AccordionTrigger className="text-sm hover:no-underline">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>Color Theme</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="color-theme" className="text-xs">Theme</Label>
                    <Select value={currentColorTheme} onValueChange={setColorTheme}>
                      <SelectTrigger id="color-theme" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorThemes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex flex-col items-start">
                              <span className="text-sm">{theme.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {theme.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {colorThemes.map((theme) => (
                      <Button
                        key={theme.value}
                        variant={currentColorTheme === theme.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setColorTheme(theme.value)}
                        className="h-7 text-xs"
                      >
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="typography">
              <AccordionTrigger className="text-sm hover:no-underline">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>Typography</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                    <Select value={currentFontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex flex-col items-start">
                              <span className="text-sm">{font.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {font.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fontFamilies.map((font) => (
                      <Button
                        key={font.value}
                        variant={currentFontFamily === font.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontFamily(font.value)}
                        className="h-7 text-xs"
                      >
                        {font.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="visual">
              <AccordionTrigger className="text-sm hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Visual Feel</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="visual-feel" className="text-xs">Style</Label>
                    <Select value={currentVisualFeel} onValueChange={setVisualFeel}>
                      <SelectTrigger id="visual-feel" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {visualFeels.map((feel) => (
                          <SelectItem key={feel.value} value={feel.value}>
                            <div className="flex flex-col items-start">
                              <span className="text-sm">{feel.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {feel.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {visualFeels.map((feel) => (
                      <Button
                        key={feel.value}
                        variant={currentVisualFeel === feel.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVisualFeel(feel.value)}
                        className="h-7 text-xs"
                      >
                        {feel.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Design Tokens Accordion */}
      <div>
        <h3 className="text-base mb-3">Design Tokens</h3>
        
        {currentActiveTheme ? (
          <Accordion type="multiple" defaultValue={["token-colors"]} className="w-full">
            {/* COLORS - Dynamic from currentActiveTheme.colors */}
            {currentActiveTheme.colors && Object.keys(currentActiveTheme.colors).length > 0 && (
              <AccordionItem value="token-colors">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    <span>Colors ({Object.keys(currentActiveTheme.colors).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div className="grid gap-2 grid-cols-2">
                      {Object.entries(currentActiveTheme.colors).map(([key, value]) => (
                        <DynamicColorToken key={key} name={key} value={value} />
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* TYPOGRAPHY - Dynamic from currentActiveTheme.typography */}
            {currentActiveTheme.typography && Object.keys(currentActiveTheme.typography).length > 0 && (
              <AccordionItem value="token-type">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span>Typography ({Object.keys(currentActiveTheme.typography).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries(currentActiveTheme.typography).map(([key, value]) => (
                      <DynamicTypographyToken key={key} name={key} value={value} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* SPACING - Dynamic from currentActiveTheme.spacing */}
            {currentActiveTheme.spacing && Object.keys(currentActiveTheme.spacing).length > 0 && (
              <AccordionItem value="token-spacing">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span>Spacing ({Object.keys(currentActiveTheme.spacing).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries(currentActiveTheme.spacing).map(([key, value]) => (
                      <DynamicSpacingToken key={key} name={key} value={value} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* BORDER RADIUS - Dynamic from currentActiveTheme.borderRadius */}
            {currentActiveTheme.borderRadius && Object.keys(currentActiveTheme.borderRadius).length > 0 && (
              <AccordionItem value="token-radius">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Border Radius ({Object.keys(currentActiveTheme.borderRadius).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries(currentActiveTheme.borderRadius).map(([key, value]) => (
                      <DynamicRadiusToken key={key} name={key} value={value} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* SHADOWS - Dynamic from currentActiveTheme.shadows */}
            {currentActiveTheme.shadows && Object.keys(currentActiveTheme.shadows).length > 0 && (
              <AccordionItem value="token-effects">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Shadows ({Object.keys(currentActiveTheme.shadows).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries(currentActiveTheme.shadows).map(([key, value]) => (
                      <DynamicShadowToken key={key} name={key} value={value} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* ANIMATION - Dynamic from currentActiveTheme.animation (if exists) */}
            {(currentActiveTheme as any).animation && Object.keys((currentActiveTheme as any).animation).length > 0 && (
              <AccordionItem value="token-animation">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Animation ({Object.keys((currentActiveTheme as any).animation).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries((currentActiveTheme as any).animation).map(([key, value]) => (
                      <DynamicAnimationToken key={key} name={key} value={String(value)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* BORDERS - Dynamic from currentActiveTheme.borders (if exists) */}
            {(currentActiveTheme as any).borders && Object.keys((currentActiveTheme as any).borders).length > 0 && (
              <AccordionItem value="token-borders">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Borders ({Object.keys((currentActiveTheme as any).borders).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries((currentActiveTheme as any).borders).map(([key, value]) => (
                      <DynamicBorderToken key={key} name={key} value={String(value)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* OPACITY - Dynamic from currentActiveTheme.opacity (if exists) */}
            {(currentActiveTheme as any).opacity && Object.keys((currentActiveTheme as any).opacity).length > 0 && (
              <AccordionItem value="token-opacity">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    <span>Opacity ({Object.keys((currentActiveTheme as any).opacity).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries((currentActiveTheme as any).opacity).map(([key, value]) => (
                      <DynamicOpacityToken key={key} name={key} value={Number(value)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* EFFECTS - Dynamic from currentActiveTheme.effects (frosted glass, blur, etc.) */}
            {(currentActiveTheme as any).effects && Object.keys((currentActiveTheme as any).effects).length > 0 && (
              <AccordionItem value="token-effects-visual">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Visual Effects ({Object.keys((currentActiveTheme as any).effects).length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {Object.entries((currentActiveTheme as any).effects).map(([key, value]) => (
                      <DynamicEffectToken key={key} name={key} value={String(value)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8 border rounded-lg">
            No active theme. Select a theme to view design tokens.
          </div>
        )}
      </div>

      <Separator />

      {/* Save Design System */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSaveDialogOpen(true)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Design System
        </Button>
      </div>

      <SaveDesignSystemDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />
    </div>
  );
}

// Helper Components
function ColorToken({ name, token, foreground }: { name: string; token: string; foreground: string }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs">{name}</div>
      <div 
        className="h-16 rounded border flex items-center justify-center"
        style={{ 
          backgroundColor: `hsl(var(${token}))`,
          color: `hsl(var(${foreground}))`
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

function SimpleColorToken({ name, token }: { name: string; token: string }) {
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

function CompactTypeExample({ size, label }: { size: string; label: string }) {
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

function CompactRadiusExample({ size, label, token }: { size: string; label: string; token: string }) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs">{label}</div>
        <code className="text-xs text-muted-foreground">{token}</code>
      </div>
      <div 
        className="w-12 h-12 bg-primary flex-shrink-0"
        style={{ borderRadius: `var(${token})` }}
      />
    </div>
  );
}

function DynamicColorToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs">{name}</div>
      <div 
        className="h-16 rounded border flex items-center justify-center"
        style={{ 
          backgroundColor: `hsl(${value})`,
          color: `hsl(${value})`
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

function DynamicTypographyToken({ name, value }: { name: string; value: string }) {
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

function DynamicSpacingToken({ name, value }: { name: string; value: string }) {
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

function DynamicRadiusToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div 
        className="w-12 h-12 bg-primary flex-shrink-0"
        style={{ borderRadius: value }}
      />
    </div>
  );
}

function DynamicShadowToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="p-2 border rounded">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">shadow-{name}</span>
      </div>
      <div 
        className="w-full h-12 bg-card rounded flex items-center justify-center"
        style={{ boxShadow: value }}
      >
        <span className="text-xs text-muted-foreground">Preview</span>
      </div>
    </div>
  );
}

function DynamicAnimationToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div>
        <div className="text-xs text-muted-foreground">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
    </div>
  );
}

function DynamicBorderToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="p-2 border rounded">
      <div className="text-xs text-muted-foreground mb-2">{name}</div>
      <div 
        className="w-full h-12 bg-muted rounded"
        style={{ border: value }}
      />
    </div>
  );
}

function DynamicOpacityToken({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{name}</div>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-primary/10">
        <div 
          className="absolute inset-0 bg-primary"
          style={{ opacity: value }}
        />
      </div>
    </div>
  );
}

function DynamicEffectToken({ name, value }: { name: string; value: string }) {
  return (
    <div className="p-2 border rounded">
      <div className="text-xs text-muted-foreground mb-2">{name}</div>
      <div className="relative w-full h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded overflow-hidden">
        <div 
          className="absolute inset-0 bg-card/80 flex items-center justify-center"
          style={{ backdropFilter: value }}
        >
          <span className="text-xs font-medium">Frosted</span>
        </div>
      </div>
      <code className="text-xs text-muted-foreground block mt-1 truncate">{value}</code>
    </div>
  );
}