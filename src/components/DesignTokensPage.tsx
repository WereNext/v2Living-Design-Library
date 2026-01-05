import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Theme } from "../hooks/useDesignSystems";
import { Palette, Type, Ruler, Circle, Sparkles, Eye, Layers as LayersIcon, FileCode, Shield, Search as SearchIcon, Edit3, Settings } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { ShowcaseWithNav } from "./ShowcaseWithNav";
import { ShowcaseSection } from "./ShowcaseSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TokenExporter } from "./token-features/TokenExporter";
import { AccessibilityValidator } from "./token-features/AccessibilityValidator";
import { TokenSearch } from "./token-features/TokenSearch";
import { LiveTokenEditor } from "./token-features/LiveTokenEditor";
import { APIKeySettings, hasAPIKey } from "./APIKeySettings";

interface DesignTokensPageProps {
  activeTheme?: Theme;
}

export function DesignTokensPage({ activeTheme }: DesignTokensPageProps) {
  if (!activeTheme) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertDescription>
            No active theme found. Please select a design system and theme from the sidebar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Build sections based on available tokens
  const sections = [
    { id: "overview", title: "Overview" },
    ...(activeTheme.colors ? [{ id: "colors", title: "Colors" }] : []),
    ...(activeTheme.typography ? [{ id: "typography", title: "Typography" }] : []),
    ...(activeTheme.spacing ? [{ id: "spacing", title: "Spacing" }] : []),
    ...(activeTheme.borderRadius ? [{ id: "border-radius", title: "Border Radius" }] : []),
    ...(activeTheme.shadows ? [{ id: "shadows", title: "Shadows" }] : []),
    ...(activeTheme.opacity ? [{ id: "opacity", title: "Opacity" }] : []),
    ...(activeTheme.effects ? [{ id: "effects", title: "Effects" }] : []),
    ...(activeTheme.sidebar ? [{ id: "sidebar", title: "Sidebar Colors" }] : []),
  ];

  const showAIFeatures = hasAPIKey();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Design Tokens</h1>
        <p className="text-muted-foreground">
          Explore, edit, validate, and export the foundational design variables of <strong>{activeTheme.name}</strong>
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="browse" className="gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="gap-2">
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Editor</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <SearchIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">A11y</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab - Original Token Display */}
        <TabsContent value="browse" className="mt-6">
          <ShowcaseWithNav sections={sections}>
            <div className="space-y-12">
              {/* Overview Section */}
              <ShowcaseSection id="overview" title="Design Tokens Overview">
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-4">
                      The foundational design variables that define the visual language of <strong>{activeTheme.name}</strong>.
                      These tokens are separate from React components and can be exported to any framework.
                    </p>
                  </div>

                  {/* Architecture Explanation */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Design System Architecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Design Tokens (This Layer)</p>
                          <p className="text-sm text-muted-foreground">
                            Colors, spacing, typography, shadows, and other design variables. These are framework-agnostic.
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Component Library</p>
                          <p className="text-sm text-muted-foreground">
                            React components that consume these tokens. Can be exported to React, Vue, Angular, or vanilla JS.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ShowcaseSection>

              {/* Colors Section */}
              {activeTheme.colors && (
                <ShowcaseSection id="colors" title="Colors">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Colors
                      </CardTitle>
                      <CardDescription>
                        Color palette defining the visual identity. Values are in HSL format.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(activeTheme.colors).map(([key, value]) => {
                          const hslValue = value.startsWith('hsl(') ? value : `hsl(${value})`;
                          
                          return (
                            <div key={key} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                              <div
                                className="w-12 h-12 rounded-md border shadow-sm flex-shrink-0"
                                style={{ background: hslValue }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">--{key}</p>
                                <p className="text-xs text-muted-foreground font-mono truncate">
                                  {value}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Typography Section */}
              {activeTheme.typography && (
                <ShowcaseSection id="typography" title="Typography">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Typography
                      </CardTitle>
                      <CardDescription>
                        Font families and typographic scale.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(activeTheme.typography).map(([key, value]) => (
                          <div key={key} className="p-4 rounded-lg border bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                --{key}
                              </Badge>
                              <p className="text-sm text-muted-foreground font-mono">{value}</p>
                            </div>
                            <p style={{ fontFamily: value }} className="text-lg">
                              The quick brown fox jumps over the lazy dog
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Spacing Section */}
              {activeTheme.spacing && (
                <ShowcaseSection id="spacing" title="Spacing Scale">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Ruler className="w-5 h-5" />
                        Spacing Scale
                      </CardTitle>
                      <CardDescription>
                        Consistent spacing units for layout and components.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(activeTheme.spacing).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                            <Badge variant="outline" className="w-16 justify-center font-mono text-xs">
                              {key}
                            </Badge>
                            <div
                              className="h-10 bg-primary rounded"
                              style={{ width: value }}
                            />
                            <span className="text-sm text-muted-foreground font-mono ml-auto">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Border Radius Section */}
              {activeTheme.borderRadius && (
                <ShowcaseSection id="border-radius" title="Border Radius">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="w-5 h-5" />
                        Border Radius
                      </CardTitle>
                      <CardDescription>
                        Corner radius values for consistency across components.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(activeTheme.borderRadius).map(([key, value]) => (
                          <div key={key} className="text-center space-y-2 p-4 rounded-lg border bg-card">
                            <div className="flex justify-center">
                              <div
                                className="w-20 h-20 bg-primary"
                                style={{ borderRadius: value }}
                              />
                            </div>
                            <Badge variant="outline" className="font-mono text-xs">
                              {key}
                            </Badge>
                            <p className="text-xs text-muted-foreground font-mono">{value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Shadows Section */}
              {activeTheme.shadows && (
                <ShowcaseSection id="shadows" title="Shadows">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Shadows
                      </CardTitle>
                      <CardDescription>
                        Elevation and depth through shadow values.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(activeTheme.shadows).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="p-6 rounded-lg bg-background" style={{ boxShadow: value }}>
                              <div className="text-center">
                                <p className="text-sm font-medium mb-1">{key}</p>
                                <Badge variant="secondary" className="text-xs">Preview</Badge>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono break-all px-2">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Opacity Section */}
              {activeTheme.opacity && (
                <ShowcaseSection id="opacity" title="Opacity Values">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Opacity Values
                      </CardTitle>
                      <CardDescription>
                        Transparency levels for overlays and glass effects.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(activeTheme.opacity).map(([key, value]) => (
                          <div key={key} className="text-center space-y-2 p-4 rounded-lg border bg-card">
                            <div className="relative h-20 bg-gradient-to-br from-primary to-secondary rounded overflow-hidden">
                              <div
                                className="absolute inset-0 bg-background"
                                style={{ opacity: value }}
                              />
                            </div>
                            <Badge variant="outline" className="font-mono text-xs">
                              {key}
                            </Badge>
                            <p className="text-xs text-muted-foreground font-mono">{value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Effects Section */}
              {activeTheme.effects && (
                <ShowcaseSection id="effects" title="Visual Effects">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Visual Effects
                      </CardTitle>
                      <CardDescription>
                        Filters and effects like blur and glass morphism.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        {Object.entries(activeTheme.effects).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary/60 to-secondary/60">
                              <div
                                className="absolute inset-0 bg-background/50 backdrop-blur-0 flex items-center justify-center"
                                style={{ backdropFilter: value }}
                              >
                                <Badge className="text-xs">Effect Preview</Badge>
                              </div>
                            </div>
                            <div className="px-2">
                              <Badge variant="outline" className="font-mono text-xs mb-2">
                                {key}
                              </Badge>
                              <p className="text-xs text-muted-foreground font-mono break-all">
                                {value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}

              {/* Sidebar Tokens Section */}
              {activeTheme.sidebar && (
                <ShowcaseSection id="sidebar" title="Sidebar Colors">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Sidebar Colors
                      </CardTitle>
                      <CardDescription>
                        Dedicated color tokens for sidebar components.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(activeTheme.sidebar).map(([key, value]) => {
                          return (
                            <div key={key} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                              <div
                                className="w-12 h-12 rounded-md border shadow-sm flex-shrink-0"
                                style={{ background: value }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">sidebar-{key}</p>
                                <p className="text-xs text-muted-foreground font-mono truncate">
                                  {value}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </ShowcaseSection>
              )}
            </div>
          </ShowcaseWithNav>
        </TabsContent>

        {/* Live Editor Tab */}
        <TabsContent value="editor" className="mt-6">
          <LiveTokenEditor theme={activeTheme} />
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-6">
          <TokenSearch theme={activeTheme} />
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="mt-6">
          <TokenExporter theme={activeTheme} />
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="mt-6">
          <AccessibilityValidator theme={activeTheme} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <APIKeySettings />
            
            {!showAIFeatures && (
              <Alert>
                <Sparkles className="w-4 h-4" />
                <AlertDescription>
                  Configure your OpenAI API key above to unlock AI-powered token generation features.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
