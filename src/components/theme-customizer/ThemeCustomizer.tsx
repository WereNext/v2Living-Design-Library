// Refactored ThemeCustomizer - Original: 774 LOC -> Now: ~400 LOC
// Split into:
// - theme-customizer/types.ts - Type definitions and constants
// - theme-customizer/token-displays/*.tsx - Token display components

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Palette, Type, Sparkles, Droplet, Ruler, Layers, Save, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useState } from "react";
import { SaveDesignSystemDialog } from "../SaveDesignSystemDialog";
import { Badge } from "../ui/badge";
import { useAppState } from "../../contexts/AppStateContext";
import {
  COLOR_THEMES,
  FONT_FAMILIES,
  VISUAL_FEELS,
  type ColorTheme,
  type FontFamily,
  type VisualFeel,
} from "./types";
import {
  DynamicColorToken,
  DynamicTypographyToken,
  DynamicSpacingToken,
  DynamicRadiusToken,
  DynamicShadowToken,
  DynamicAnimationToken,
  DynamicBorderToken,
  DynamicOpacityToken,
  DynamicEffectToken,
} from "./token-displays";

interface ThemeCustomizerProps {
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  visualFeel: VisualFeel;
  onColorThemeChange: (theme: ColorTheme) => void;
  onFontFamilyChange: (font: FontFamily) => void;
  onVisualFeelChange: (feel: VisualFeel) => void;
  activeTheme: unknown;
  onSaveAsDesignSystem?: (data: {
    name: string;
    description?: string;
    colorTheme: ColorTheme;
    fontFamily: FontFamily;
    visualFeel: VisualFeel;
  }) => void;
  onRestartWizard?: () => void;
}

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

  const {
    activeSystemId,
    activeSystem,
    activeTheme: contextActiveTheme,
    setActiveTheme,
    colorTheme: contextColorTheme,
    fontFamily: contextFontFamily,
    visualFeel: contextVisualFeel,
    setColorTheme,
    setFontFamily,
    setVisualFeel,
  } = useAppState();

  const currentColorTheme = contextColorTheme;
  const currentFontFamily = contextFontFamily;
  const currentVisualFeel = contextVisualFeel;
  const currentActiveTheme = contextActiveTheme;

  const themes = activeSystem?.themes || [];
  const activeThemeId = activeSystem?.activeThemeId;

  const handleThemeSwitch = (themeId: string) => {
    if (activeSystemId) {
      setActiveTheme(activeSystemId, themeId);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v as 'themes' | 'custom')}
        className="w-full"
      >
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

        <TabsContent value="themes" className="space-y-3 mt-4">
          {activeSystem ? (
            <ThemesTabContent
              activeSystem={activeSystem}
              themes={themes}
              activeThemeId={activeThemeId}
              onThemeSwitch={handleThemeSwitch}
            />
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              No active design system. Import or create one to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4">
          <CustomTabContent
            colorTheme={currentColorTheme}
            fontFamily={currentFontFamily}
            visualFeel={currentVisualFeel}
            onColorThemeChange={setColorTheme}
            onFontFamilyChange={setFontFamily}
            onVisualFeelChange={setVisualFeel}
          />
        </TabsContent>
      </Tabs>

      <Separator />

      <DesignTokensSection activeTheme={currentActiveTheme} />

      <Separator />

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

// Sub-components

interface ThemesTabContentProps {
  activeSystem: { name: string; description?: string };
  themes: Array<{
    id: string;
    name: string;
    description?: string;
    colors: Record<string, string>;
  }>;
  activeThemeId?: string;
  onThemeSwitch: (themeId: string) => void;
}

function ThemesTabContent({
  activeSystem,
  themes,
  activeThemeId,
  onThemeSwitch,
}: ThemesTabContentProps) {
  return (
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
                onClick={() => onThemeSwitch(theme.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm">{theme.name}</span>
                  {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </div>
                {theme.description && (
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                )}
                <div className="flex gap-1 mt-2">
                  {['primary', 'secondary', 'accent'].map(
                    (colorKey) =>
                      theme.colors[colorKey] && (
                        <div
                          key={colorKey}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: `hsl(${theme.colors[colorKey]})` }}
                          title={colorKey}
                        />
                      )
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

interface CustomTabContentProps {
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  visualFeel: VisualFeel;
  onColorThemeChange: (theme: ColorTheme) => void;
  onFontFamilyChange: (font: FontFamily) => void;
  onVisualFeelChange: (feel: VisualFeel) => void;
}

function CustomTabContent({
  colorTheme,
  fontFamily,
  visualFeel,
  onColorThemeChange,
  onFontFamilyChange,
  onVisualFeelChange,
}: CustomTabContentProps) {
  return (
    <>
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Custom overrides:</strong> These settings
          layer on top of your active theme.
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
            <OptionSelector
              label="Theme"
              value={colorTheme}
              options={COLOR_THEMES}
              onChange={onColorThemeChange}
            />
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
            <OptionSelector
              label="Font Family"
              value={fontFamily}
              options={FONT_FAMILIES}
              onChange={onFontFamilyChange}
            />
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
            <OptionSelector
              label="Style"
              value={visualFeel}
              options={VISUAL_FEELS}
              onChange={onVisualFeelChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

interface OptionSelectorProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; description: string }>;
  onChange: (value: T) => void;
}

function OptionSelector<T extends string>({
  label,
  value,
  options,
  onChange,
}: OptionSelectorProps<T>) {
  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-2">
        <Label className="text-xs">{label}</Label>
        <Select value={value} onValueChange={onChange as (v: string) => void}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col items-start">
                  <span className="text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className="h-7 text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface DesignTokensSectionProps {
  activeTheme: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    borderRadius?: Record<string, string>;
    shadows?: Record<string, string>;
    animation?: Record<string, string>;
    borders?: Record<string, string>;
    opacity?: Record<string, number>;
    effects?: Record<string, string>;
  } | null;
}

function DesignTokensSection({ activeTheme }: DesignTokensSectionProps) {
  if (!activeTheme) {
    return (
      <div>
        <h3 className="text-base mb-3">Design Tokens</h3>
        <div className="text-center text-sm text-muted-foreground py-8 border rounded-lg">
          No active theme. Select a theme to view design tokens.
        </div>
      </div>
    );
  }

  const tokenSections = [
    { key: 'token-colors', icon: Droplet, label: 'Colors', data: activeTheme.colors, Component: DynamicColorToken, grid: true },
    { key: 'token-type', icon: Type, label: 'Typography', data: activeTheme.typography, Component: DynamicTypographyToken },
    { key: 'token-spacing', icon: Ruler, label: 'Spacing', data: activeTheme.spacing, Component: DynamicSpacingToken },
    { key: 'token-radius', icon: Layers, label: 'Border Radius', data: activeTheme.borderRadius, Component: DynamicRadiusToken },
    { key: 'token-effects', icon: Sparkles, label: 'Shadows', data: activeTheme.shadows, Component: DynamicShadowToken },
    { key: 'token-animation', icon: Sparkles, label: 'Animation', data: activeTheme.animation, Component: DynamicAnimationToken },
    { key: 'token-borders', icon: Layers, label: 'Borders', data: activeTheme.borders, Component: DynamicBorderToken },
    { key: 'token-opacity', icon: Droplet, label: 'Opacity', data: activeTheme.opacity, Component: DynamicOpacityToken },
    { key: 'token-effects-visual', icon: Sparkles, label: 'Visual Effects', data: activeTheme.effects, Component: DynamicEffectToken },
  ];

  const visibleSections = tokenSections.filter(
    (section) => section.data && Object.keys(section.data).length > 0
  );

  return (
    <div>
      <h3 className="text-base mb-3">Design Tokens</h3>
      <Accordion type="multiple" defaultValue={["token-colors"]} className="w-full">
        {visibleSections.map(({ key, icon: Icon, label, data, Component, grid }) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="text-sm hover:no-underline">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label} ({Object.keys(data!).length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className={`space-y-2 pt-2 ${grid ? 'grid gap-2 grid-cols-2' : ''}`}>
                {Object.entries(data!).map(([name, value]) => (
                  <Component key={name} name={name} value={value as never} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
