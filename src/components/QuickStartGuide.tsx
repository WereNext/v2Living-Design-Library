import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, Zap, Code2, Palette, FileJson, Sparkles, ArrowRight, AlertTriangle, FileCode, Rocket, BookOpen, Users, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface QuickStartGuideProps {
  onNavigate?: (category: string) => void;
}

export function QuickStartGuide({ onNavigate }: QuickStartGuideProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1>Quick Start Guide</h1>
        <p className="text-muted-foreground text-lg">
          Get your design system running in under 5 minutes • No backend required • Works offline
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Import tokens & components</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Image upload system</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Multi-framework export</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Git-like versioning</span>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="getting-started" className="gap-2">
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Getting Started</span>
          </TabsTrigger>
          <TabsTrigger value="token-import" className="gap-2">
            <FileJson className="w-4 h-4" />
            <span className="hidden sm:inline">Token Import</span>
          </TabsTrigger>
          <TabsTrigger value="naming-convention" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Naming Rules</span>
          </TabsTrigger>
          <TabsTrigger value="use-cases" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Use Cases</span>
          </TabsTrigger>
          <TabsTrigger value="design-intents" className="gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Intents</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Getting Started */}
        <TabsContent value="getting-started" className="space-y-6">
          {/* Three Main Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2">
                  1
                </div>
                <CardTitle className="text-lg">Import Tokens & Components</CardTitle>
                <CardDescription>
                  Bring in your design tokens and Figma components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Go to <strong>Import Config</strong> to import design tokens AND Figma components. One unified hub for your entire design system—tokens, components, and images.
                </p>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Design token import</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Figma component import</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Image asset management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2">
                  2
                </div>
                <CardTitle className="text-lg">Choose Your Components</CardTitle>
                <CardDescription>
                  Select which component categories match your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  In <strong>Design System Builder</strong>, create design systems with custom component categories. Mix pre-built and imported components seamlessly.
                </p>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>30+ pre-built components</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Import custom components</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Git-like versioning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2">
                  3
                </div>
                <CardTitle className="text-lg">Version & Export</CardTitle>
                <CardDescription>
                  Track changes and export to any framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Save versions with semantic versioning, rollback anytime, and export components to React, Vue, Svelte, Angular, iOS, or Android.
                </p>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Semantic versioning</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Version rollback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>6 framework exports</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tips */}
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Unified Import Hub
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Go to <strong>Configuration → Import Config</strong> to import design tokens AND Figma components. Paste JSON for tokens, or use the component import tab for React components—complete with images and assets.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Multi-Framework Export
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Every component has a <strong>Live Code Playground</strong>. Export to React, Vue, Svelte, Angular, iOS, or Android. The code includes your custom design tokens automatically.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-primary" />
                    Version Control Built-In
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Git-like versioning</strong> with semantic versioning (v1.0.0), commit messages, and rollback capabilities. Track every change to your design system with full history.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Integration Ready
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Connect AI coding agents via <strong>MCP Server</strong>. Let Claude or other AI tools import tokens, generate components, and export code using natural language commands.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Token Import */}
        <TabsContent value="token-import" className="space-y-6">
          {/* Token Import Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                How Token Import Works
              </CardTitle>
              <CardDescription>
                Your design system → Live components in seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                    1
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm">
                      <strong>Export from Figma</strong> using a plugin like "Figma Tokens" or manually create JSON with your colors, spacing, and typography.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-muted-foreground">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm">
                      <strong>Paste into Import Config</strong> and click Import. The system validates your tokens and converts them to CSS custom properties.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-muted-foreground">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                    ✓
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm">
                      <strong>All 30+ components update instantly</strong> with your brand colors, typography, and spacing. No code changes needed!
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="mt-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>One import updates everything.</strong> Buttons, forms, cards, navigation—every component reflects your design system automatically.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Naming Convention */}
        <TabsContent value="naming-convention" className="space-y-6">
          {/* CRITICAL: Token Naming Convention */}
          <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50/50 to-red-50/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-orange-900">
                    CRITICAL: Figma Token Naming Convention
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Your tokens MUST be organized correctly for multi-theme systems to work
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Why it matters */}
              <Alert className="border-orange-300 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  <strong>Without proper naming, the system cannot:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Detect and group themes (Light, Dark, Brand variants)</li>
                    <li>Categorize tokens by type (colors, spacing, typography)</li>
                    <li>Create multi-theme design systems</li>
                    <li>Auto-generate proper CSS variables</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Required Format */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-primary" />
                  Required Format
                </h4>
                
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-400 mb-2">// Multi-theme format:</div>
                  <div>{'{'}</div>
                  <div className="ml-4 text-green-300">"ThemeName/Category/TokenName"</div>
                  <div>{'}'}</div>
                  
                  <div className="mt-4 text-slate-400 mb-2">// Examples:</div>
                  <div className="space-y-1">
                    <div><span className="text-blue-400">"Light/colors/primary"</span>: <span className="text-yellow-300">"221 83% 53%"</span>,</div>
                    <div><span className="text-blue-400">"Light/spacing/md"</span>: <span className="text-yellow-300">"1rem"</span>,</div>
                    <div><span className="text-blue-400">"Dark/colors/primary"</span>: <span className="text-yellow-300">"210 100% 60%"</span>,</div>
                    <div><span className="text-blue-400">"Dark/spacing/md"</span>: <span className="text-yellow-300">"1rem"</span></div>
                  </div>
                </div>

                {/* Category Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-semibold">Category</th>
                        <th className="text-left p-3 font-semibold">Purpose</th>
                        <th className="text-left p-3 font-semibold">Example Tokens</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-mono text-xs">colors</td>
                        <td className="p-3 text-muted-foreground">Color values (HSL, RGB, hex)</td>
                        <td className="p-3 font-mono text-xs">primary, background, text</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">spacing</td>
                        <td className="p-3 text-muted-foreground">Spacing scale</td>
                        <td className="p-3 font-mono text-xs">xs, sm, md, lg, xl</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">typography</td>
                        <td className="p-3 text-muted-foreground">Font families</td>
                        <td className="p-3 font-mono text-xs">font-sans, font-mono</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">borderRadius</td>
                        <td className="p-3 text-muted-foreground">Border radius values</td>
                        <td className="p-3 font-mono text-xs">radius-sm, radius-md</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">shadows</td>
                        <td className="p-3 text-muted-foreground">Shadow definitions</td>
                        <td className="p-3 font-mono text-xs">shadow-sm, shadow-lg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comparison: Correct vs Incorrect */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Correct Examples */}
                <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="text-green-900">Correct ✅</h4>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-green-700">"Light/colors/primary"</div>
                    <div className="text-green-700">"Dark/spacing/md"</div>
                    <div className="text-green-700">"BrandA/typography/font-sans"</div>
                    <div className="text-green-700">"Mobile/borderRadius/radius-lg"</div>
                  </div>
                  <p className="text-xs text-green-800 mt-3">
                    ✓ Theme first, category second, token name last
                  </p>
                </div>

                {/* Incorrect Examples */}
                <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="text-red-900">Incorrect ❌</h4>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-red-700 line-through">"primary-light"</div>
                    <div className="text-red-700 line-through">"Light-colors-primary"</div>
                    <div className="text-red-700 line-through">"primary/Light/colors"</div>
                    <div className="text-red-700 line-through">"colors.primary.light"</div>
                  </div>
                  <p className="text-xs text-red-800 mt-3">
                    ✗ Missing category, wrong separator, wrong order
                  </p>
                </div>
              </div>

              {/* Figma Setup Instructions */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  How to Set Up in Figma
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 flex-shrink-0">1</Badge>
                    <p className="text-muted-foreground">
                      <strong>Create Variable Collections</strong> for each theme (e.g., "Light Theme", "Dark Theme")
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 flex-shrink-0">2</Badge>
                    <p className="text-muted-foreground">
                      <strong>Inside each collection</strong>, organize variables by category: colors/, spacing/, typography/
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 flex-shrink-0">3</Badge>
                    <p className="text-muted-foreground">
                      <strong>Name variables semantically</strong>: Use "primary", "background" instead of "blue-500", "gray-100"
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 flex-shrink-0">4</Badge>
                    <p className="text-muted-foreground">
                      <strong>Export using Figma Variables Export</strong> or a plugin like "Figma Tokens"
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h5 className="text-sm font-semibold mb-2 text-green-700">With Correct Naming ✅</h5>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Automatic theme detection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Proper token categorization
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      One system with multiple themes
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Seamless import/export
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold mb-2 text-red-700">With Incorrect Naming ❌</h5>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                      Themes not detected
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                      Variables in wrong categories
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                      System creation fails
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                      Export errors
                    </li>
                  </ul>
                </div>
              </div>

              {/* Final CTA */}
              <Alert>
                <FileJson className="h-4 w-4" />
                <AlertDescription>
                  <strong>Need examples?</strong> Check the Import Config page for complete JSON examples with proper naming conventions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Use Cases */}
        <TabsContent value="use-cases" className="space-y-6">
          {/* Common Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>How Teams Use This Library</CardTitle>
              <CardDescription>
                Real-world workflows for making the library your own
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="mb-1">Agency with Multiple Clients</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a separate design system for each client. Import their brand tokens, save the system, and switch between clients instantly. Each system maintains its own themes and component categories.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="mb-1">Product Team with Light & Dark Modes</h4>
                  <p className="text-sm text-muted-foreground">
                    Export both Light and Dark themes from Figma using the correct naming convention. Import once - the system automatically detects both themes and lets you toggle between them seamlessly.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="mb-1">Startup Building SaaS Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Select only "Dashboard" and "Web App" intents to focus on data visualization and admin components. Hide e-commerce and landing page components you don't need.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="mb-1">Design System Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Import your company's design tokens and share this URL with your team as living documentation. Developers see real components with your exact brand styling and can export code instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Design Intents */}
        <TabsContent value="design-intents" className="space-y-6">
          {/* Understanding Design Intents */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                Understanding Design Intents (Component Categories)
              </CardTitle>
              <CardDescription>
                How to organize your component library by use case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What they are */}
              <div className="space-y-3">
                <h4>What are Design Intents?</h4>
                <p className="text-sm text-muted-foreground">
                  Design Intents are <strong>organizational categories</strong> that group components by purpose. 
                  Think of them as tabs or sections in your component library - Web App, E-commerce, Mobile, Landing Page, etc.
                </p>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Design Intents are not component uploads. You're choosing which pre-built component categories make sense for your project.
                  </AlertDescription>
                </Alert>
              </div>

              {/* How they work */}
              <div className="space-y-3 border-t pt-4">
                <h4>How They Work</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">Default System</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Shows all component categories:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Web App
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        E-commerce
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Mobile Experience
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Landing Page
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Custom System</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Only shows selected categories:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Web App
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Dashboard
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
                        <s>E-commerce</s> (not selected)
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
                        <s>Mobile</s> (not selected)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-built Intents */}
              <div className="space-y-3 border-t pt-4">
                <h4>Available Component Categories</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>Web App</strong> - General purpose web applications
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>E-commerce</strong> - Shopping and product-focused
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>Mobile</strong> - Touch-optimized components
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>Landing Page</strong> - Marketing and conversion
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>Dashboard</strong> - Charts and analytics
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>SaaS Platform</strong> - Multi-tenant features
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>Admin Panel</strong> - Backend administration
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong>+ Custom</strong> - Create your own categories
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Difference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="mb-2 text-blue-900">Key Difference: Intents vs Themes</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Design Intents = Categories</div>
                    <ul className="space-y-1 text-blue-700 text-xs">
                      <li>• Organize components by use case</li>
                      <li>• Control sidebar navigation</li>
                      <li>• Pre-built component sets</li>
                      <li>• Not about visual style</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Themes = Visual Style</div>
                    <ul className="space-y-1 text-blue-700 text-xs">
                      <li>• Define colors and styling</li>
                      <li>• Light/Dark mode variations</li>
                      <li>• Brand-specific appearance</li>
                      <li>• Applied to all components</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}