import { useState, useEffect, useCallback } from "react";
import { ComponentShowcase } from "./components/ComponentShowcase";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Palette, Mouse, Layout, Type, Box, Menu, Settings, ChevronLeft, ChevronRight, Code2, Upload, Target, ShoppingBag, CreditCard, Star, Filter, Smartphone, Hand, RefreshCw, AlignLeft, Zap, Megaphone, DollarSign, MessageSquare, Grid3x3, Mail, Plug, Rocket, Package, Sparkles, Layers, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner@2.0.3";
import { ImportConfig } from "./components/ImportConfig";
import { QuickStartGuide } from "./components/QuickStartGuide";
import { MCPConfig } from "./components/MCPConfig";
import { SavedDesignSystemsPage } from "./components/SavedDesignSystemsPage";
import { DesignSystemBuilderPage } from "./components/DesignSystemBuilderPage";
import { PlaygroundShowcase } from "./components/showcases/PlaygroundShowcase";
import { EnhancedPlayground } from "./components/showcases/EnhancedPlayground";
import { DesignTokensPage } from "./components/DesignTokensPage";
import { ImportedComponentsLibrary } from "./components/ImportedComponentsLibrary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Label } from "./components/ui/label";
import * as Icons from "lucide-react";
import { AppStateProvider } from "./contexts/AppStateContext";
import { useAppState } from "./contexts/AppStateContext";
import { TokenEditorProvider } from "./contexts/TokenEditorContext";
import { ActiveThemeProvider } from "./contexts/ActiveThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { QuickStartWizard } from "./components/QuickStartWizard";
import { DecisionGate } from "./components/DecisionGate";
import { UserMenu } from "./components/auth";
import { injectThemeCSS } from "./lib/dynamic-theme-engine";
import { STORAGE_KEYS, CATEGORY_IDS, INTENT_IDS, UI_LIBRARY_LABELS } from "./lib/constants";
import { UILibraryProvider } from "./providers/UILibraryProvider";
import { dataMigrationService } from "./services/migration";

// Web App Categories (default)
const webAppCategories = [
  { name: "Code Playground", icon: Code2, id: "playground" },
  { name: "Buttons & Actions", icon: Mouse, id: "buttons" },
  { name: "Forms & Inputs", icon: Type, id: "forms" },
  { name: "Layout Components", icon: Layout, id: "layout" },
  { name: "Overlays & Dialogs", icon: Box, id: "overlays" },
  { name: "Navigation", icon: Menu, id: "navigation" },
  { name: "Data Display", icon: Palette, id: "data" },
  { name: "AI Components", icon: Zap, id: "ai" }
];

// E-commerce Categories
const ecommerceCategories = [
  { name: "Code Playground", icon: Code2, id: "playground" },
  { name: "Product Cards", icon: ShoppingBag, id: "product-cards" },
  { name: "Shopping Cart", icon: ShoppingBag, id: "shopping-cart" },
  { name: "Checkout Flow", icon: CreditCard, id: "checkout" },
  { name: "Reviews & Ratings", icon: Star, id: "reviews" },
  { name: "Filters & Search", icon: Filter, id: "filters" },
  { name: "Buttons & Actions", icon: Mouse, id: "buttons" },
  { name: "Forms & Inputs", icon: Type, id: "forms" }
];

// Mobile Experience Categories
const mobileCategories = [
  { name: "Code Playground", icon: Code2, id: "playground" },
  { name: "Bottom Navigation", icon: Menu, id: "bottom-nav" },
  { name: "Swipe Actions", icon: Hand, id: "swipe-actions" },
  { name: "Pull to Refresh", icon: RefreshCw, id: "pull-refresh" },
  { name: "Mobile Menu", icon: AlignLeft, id: "mobile-menu" },
  { name: "Touch Gestures", icon: Zap, id: "touch-gestures" },
  { name: "Mobile Forms", icon: Smartphone, id: "mobile-forms" },
  { name: "Buttons & Actions", icon: Mouse, id: "buttons" }
];

// Landing Page Categories
const landingCategories = [
  { name: "Code Playground", icon: Code2, id: "playground" },
  { name: "Hero Sections", icon: Megaphone, id: "hero" },
  { name: "CTA Blocks", icon: Mouse, id: "cta-blocks" },
  { name: "Testimonials", icon: MessageSquare, id: "testimonials" },
  { name: "Pricing Tables", icon: DollarSign, id: "pricing" },
  { name: "Feature Grids", icon: Grid3x3, id: "features" },
  { name: "Email Capture", icon: Mail, id: "email-capture" },
  { name: "Buttons & Actions", icon: Mouse, id: "buttons" }
];

// Editorial Categories (for web-editorial intent)
const editorialCategories = [
  { name: "Code Playground", icon: Code2, id: "playground" },
  { name: "Editorial Heroes", icon: Megaphone, id: "editorial-hero" },
  { name: "Article Cards", icon: Layers, id: "article-cards" },
  { name: "Longform Reading", icon: Type, id: "longform-reading" },
  { name: "Editorial Features", icon: Sparkles, id: "editorial-features" },
  { name: "Buttons & Actions", icon: Mouse, id: "buttons" },
  { name: "Forms & Inputs", icon: Type, id: "forms" }
];

const configCategories = [
  { name: "Import Config", icon: Upload, id: "import-config" },
  { name: "Design System Builder", icon: Wand2, id: "design-system-builder" },
  { name: "Saved Systems", icon: Package, id: "saved-systems" },
  { name: "Imported Components", icon: Layers, id: "imported-components" },
  { name: "MCP Config", icon: Plug, id: "mcp-config" }
];

const intents = [
  { value: "web-app", label: "Web App" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Mobile Experience" },
  { value: "landing", label: "Landing Page" },
  { value: "dashboard", label: "Dashboard & Analytics" },
  { value: "saas", label: "SaaS Platform" },
  { value: "social", label: "Social Media" },
  { value: "blog", label: "Blog & Content" },
  { value: "portfolio", label: "Portfolio & Showcase" },
  { value: "admin", label: "Admin Panel" },
  { value: "docs", label: "Documentation" },
  { value: "auth", label: "Authentication" },
  { value: "messaging", label: "Messaging & Chat" },
  { value: "calendar", label: "Calendar & Scheduling" },
  { value: "media", label: "Media Gallery" },
  { value: "forms", label: "Forms & Surveys" },
];

// Handle first sign-in migration
async function handleFirstSignIn(userId: string) {
  console.log('[App] First sign-in detected, checking for data to migrate...');

  if (dataMigrationService.hasLocalData()) {
    const result = await dataMigrationService.migrateAll(userId, (progress) => {
      console.log(`[Migration] ${progress.phase}: ${progress.message}`);
    });

    if (result.success) {
      toast.success(
        `Migrated ${result.migratedSystems} systems, ${result.migratedLDLDocuments} token docs`,
        { description: 'Your local data has been synced to the cloud' }
      );
    } else if (result.errors.length > 0) {
      toast.error('Some data could not be migrated', {
        description: result.errors[0],
      });
    }
  } else {
    console.log('[App] No local data to migrate');
  }
}

export default function App() {
  return (
    <ErrorBoundary section="Application">
      <AuthProvider onFirstSignIn={handleFirstSignIn}>
        <AppStateProvider>
          <TokenEditorProvider>
            <AppContent />
          </TokenEditorProvider>
        </AppStateProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState("quick-start");
  const [isThemeSidebarOpen, setIsThemeSidebarOpen] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showDecisionGate, setShowDecisionGate] = useState(false);
  const [showComponentImport, setShowComponentImport] = useState(false);
  
  // Get all state from centralized context
  const {
    // State
    designSystems,
    activeSystemId,
    activeSystem,
    activeTheme,
    colorTheme,
    fontFamily,
    visualFeel,
    designIntent,
    availableIntents,
    customIntents,
    
    // Actions
    applySystem,
    setActiveTheme,
    getSystem,
    addDesignSystem,
    deleteDesignSystem,
    setColorTheme,
    setFontFamily,
    setVisualFeel,
    setDesignIntent,
    addIntent,
    deleteIntent,
  } = useAppState();

  // Check if user has seen the decision gate before
  useEffect(() => {
    const hasSeenDecisionGate = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_DECISION_GATE);
    if (!hasSeenDecisionGate) {
      setShowDecisionGate(true);
    }
  }, []);

  // Mark decision gate as seen and close it
  const handleCloseDecisionGate = () => {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_DECISION_GATE, 'true');
    setShowDecisionGate(false);
  };

  // Handle View Demo choice
  const handleViewDemo = () => {
    handleCloseDecisionGate();
    toast.success("Welcome! Explore the demo components");
  };

  // Handle Import System choice
  const handleImportSystem = () => {
    handleCloseDecisionGate();
    setShowWizard(true);
  };

  // Handle Import Component choice
  const handleImportComponent = () => {
    handleCloseDecisionGate();
    setShowComponentImport(true);
    setSelectedCategory("imported-components");
  };

  // Mark wizard as seen and close it
  const handleCloseWizard = () => {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_QUICK_START_WIZARD, 'true');
    setShowWizard(false);
  };

  console.log('🎯 AppContent Render:', {
    activeSystemName: activeSystem?.name,
    activeThemeName: activeTheme?.name,
    themeId: activeTheme?.id,
    colorCount: activeTheme?.colors ? Object.keys(activeTheme.colors).length : 0
  });

  // Apply active design system on mount
  useEffect(() => {
    if (activeSystemId) {
      applySystem(activeSystemId);
    } else if (designSystems.length > 0) {
      // If no active system, apply the first one
      applySystem(designSystems[0].id);
    }
  }, []); // Run only on mount

  // Sync theme customizer state with active theme
  useEffect(() => {
    if (activeTheme) {
      console.log('Syncing theme customizer with:', activeTheme.name, {
        colorTheme: activeTheme.colorTheme,
        fontFamily: activeTheme.fontFamily,
        visualFeel: activeTheme.visualFeel
      });
      // Update theme customizer state to match the active theme
      if (activeTheme.colorTheme) setColorTheme(activeTheme.colorTheme);
      if (activeTheme.fontFamily) setFontFamily(activeTheme.fontFamily);
      if (activeTheme.visualFeel) setVisualFeel(activeTheme.visualFeel);
    }
  }, [activeTheme, setColorTheme, setFontFamily, setVisualFeel]);

  // 🎨 INJECT THEME CSS - This makes the ENTIRE app a living preview
  useEffect(() => {
    if (activeTheme) {
      injectThemeCSS(activeTheme);
      console.log('💫 Applied design system tokens to entire app:', activeTheme.name);
    }
  }, [activeTheme]);

  // Handle design system change
  const handleDesignSystemChange = (systemId: string) => {
    const success = applySystem(systemId);
    if (success) {
      const system = getSystem(systemId);
      
      // Reset to first available intent for this system
      const firstIntent = system?.intents?.[0]?.value || 'web-app';
      setDesignIntent(firstIntent);
      setSelectedCategory("playground");
      
      toast.success(`Applied "${system?.name}" design system`);
    }
  };

  // Get the appropriate component categories based on design intent
  const getComponentCategories = () => {
    // Check for custom intent first
    const customIntent = customIntents.find(i => i.id === designIntent);
    if (customIntent) {
      // Map string icon names to actual icon components
      return customIntent.categories.map(cat => ({
        ...cat,
        icon: (Icons as any)[cat.icon] || Box
      }));
    }

    // Fall back to defaults
    switch (designIntent) {
      case "ecommerce":
        return ecommerceCategories;
      case "mobile":
        return mobileCategories;
      case "landing":
        return landingCategories;
      case "web-editorial":
        return editorialCategories;
      default:
        return webAppCategories;
    }
  };

  const componentCategories = getComponentCategories();

  // Handle intent change and reset to playground
  const handleIntentChange = (newIntent: string) => {
    setDesignIntent(newIntent);
    setSelectedCategory("playground");
  };

  // Handle custom intent creation
  const handleIntentCreated = (intent: { id: string; name: string; description: string; tokens?: { colors?: Record<string, string> } }) => {
    addIntent(intent);
    // Apply the tokens if they exist
    if (intent.tokens) {
      applyTokens(intent.tokens);
    }
    // Switch to the new intent
    setDesignIntent(intent.id);
    setSelectedCategory("playground");
  };

  const applyTokens = (tokens: { colors?: Record<string, string> }) => {
    const root = document.documentElement;

    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
    // Add more token types as needed
  };

  // Get the UI library from the active system (default to shadcn)
  const activeUILibrary = activeSystem?.uiLibrary || 'shadcn';

  return (
    <ActiveThemeProvider activeTheme={activeTheme}>
      <UILibraryProvider library={activeUILibrary} theme={activeTheme}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarContent>
              <div className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl">Living Design Library</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Build, customize, and export production-ready components</p>
              </div>

              {/* DESIGN FOUNDATION SECTION */}
              <div className="px-3 pb-2">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Design Foundation</h3>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-3">
                  {/* Design System Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="design-system" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5" />
                      Design System
                    </Label>
                    <Select
                      value={activeSystemId || designSystems[0]?.id}
                      onValueChange={handleDesignSystemChange}
                    >
                      <SelectTrigger id="design-system" className="h-9 bg-background">
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                      <SelectContent>
                        {designSystems.map(system => (
                          <SelectItem key={system.id} value={system.id}>
                            <span className="flex items-center justify-between w-full gap-2">
                              <span>{system.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {UI_LIBRARY_LABELS[system.uiLibrary] || 'shadcn/ui'}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* UI Library Badge */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Code2 className="w-3 h-3" />
                      <span>UI Library: <span className="text-foreground font-medium">{UI_LIBRARY_LABELS[activeUILibrary]}</span></span>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  {activeSystem && activeSystem.themes && activeSystem.themes.length > 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="theme-selector" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5" />
                        Theme
                      </Label>
                      <Select 
                        value={activeSystem.activeThemeId || activeSystem.themes[0]?.id} 
                        onValueChange={(themeId) => {
                          if (activeSystemId) {
                            setActiveTheme(activeSystemId, themeId);
                            const theme = activeSystem.themes.find(t => t.id === themeId);
                            toast.success(`Applied "${theme?.name}" theme`);
                          }
                        }}
                      >
                        <SelectTrigger id="theme-selector" className="h-9 bg-background">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeSystem.themes.map(theme => (
                            <SelectItem key={theme.id} value={theme.id}>
                              {theme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* View Tokens Button */}
                  <button
                    onClick={() => setSelectedCategory("design-tokens")}
                    className="w-full px-3 py-2 rounded-md bg-background hover:bg-accent text-sm transition-colors flex items-center justify-between group border border-border/50"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" />
                      <span>View Design Tokens</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              {/* COMPONENT LIBRARY SECTION */}
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <Box className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Component Library</h3>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 border border-border/50 space-y-3">
                  {/* Design Intent Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="design-intent" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" />
                      Design Intent
                    </Label>
                    <Select value={designIntent} onValueChange={handleIntentChange}>
                      <SelectTrigger id="design-intent" className="h-9 bg-background">
                        <SelectValue placeholder="Select intent" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Intents from active system */}
                        {availableIntents.map(intent => (
                          <SelectItem key={intent.value} value={intent.value}>
                            {intent.label}
                          </SelectItem>
                        ))}
                        {/* Custom Intents (if not already in system) */}
                        {customIntents.filter(i => i.isCustom && !availableIntents.find(ai => ai.value === i.id)).length > 0 && (
                          <div className="border-t mt-1 pt-1">
                            {customIntents.filter(i => i.isCustom && !availableIntents.find(ai => ai.value === i.id)).map(intent => (
                              <SelectItem key={intent.id} value={intent.id}>
                                {intent.label} <span className="text-xs text-muted-foreground ml-1">(Custom)</span>
                              </SelectItem>
                            ))}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Quick Build CTA */}
              <div className="px-4 pt-2 pb-4">
                <button
                  onClick={() => setShowWizard(true)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Create New System</span>
                </button>
              </div>

              <SidebarGroup>
                <SidebarGroupLabel>Documentation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setSelectedCategory("quick-start")}
                        isActive={selectedCategory === "quick-start"}
                      >
                        <Rocket className="w-4 h-4" />
                        <span>Quick Start Guide</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Components</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {componentCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <SidebarMenuItem key={category.id}>
                          <SidebarMenuButton
                            onClick={() => setSelectedCategory(category.id)}
                            isActive={selectedCategory === category.id}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{category.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {configCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <SidebarMenuItem key={category.id}>
                          <SidebarMenuButton
                            onClick={() => setSelectedCategory(category.id)}
                            isActive={selectedCategory === category.id}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{category.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          <main className="flex-1">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              <div className="flex h-14 items-center gap-4 px-4 md:px-6">
                <SidebarTrigger />
                <h2 className="capitalize text-sm md:text-base flex-1">
                  {selectedCategory === "quick-start" && "Quick Start Guide"}
                  {selectedCategory === "design-tokens" && "Design Tokens"}
                  {selectedCategory === "import-config" && "Import Config"}
                  {selectedCategory === "design-system-builder" && "Design System Builder"}
                  {selectedCategory === "saved-systems" && "Saved Design Systems"}
                  {selectedCategory === "imported-components" && "Imported Components"}
                  {selectedCategory === "mcp-config" && "MCP Config"}
                  {selectedCategory !== "quick-start" && selectedCategory !== "design-tokens" && selectedCategory !== "import-config" && selectedCategory !== "design-system-builder" && selectedCategory !== "saved-systems" && selectedCategory !== "imported-components" && selectedCategory !== "mcp-config" && (
                    componentCategories.find(c => c.id === selectedCategory)?.name
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <UserMenu />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsThemeSidebarOpen(!isThemeSidebarOpen)}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden md:inline">Theme</span>
                    {isThemeSidebarOpen ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`p-4 md:p-6 ${activeTheme?.fontFamily ? `font-${activeTheme.fontFamily}` : ''}`}>
              <ErrorBoundary section="Main Content">
                {selectedCategory === "quick-start" ? (
                  <QuickStartGuide onNavigate={setSelectedCategory} />
                ) : selectedCategory === "import-config" ? (
                  <ImportConfig onIntentCreated={handleIntentCreated} availableIntents={availableIntents} />
                ) : selectedCategory === "design-system-builder" ? (
                  <DesignSystemBuilderPage />
                ) : selectedCategory === "saved-systems" ? (
                  <SavedDesignSystemsPage />
                ) : selectedCategory === "imported-components" ? (
                  <ImportedComponentsLibrary />
                ) : selectedCategory === "mcp-config" ? (
                  <MCPConfig />
                ) : selectedCategory === "playground" ? (
                  <EnhancedPlayground />
                ) : selectedCategory === "design-tokens" ? (
                  <DesignTokensPage activeTheme={activeTheme} />
                ) : (
                  <ComponentShowcase category={selectedCategory} designIntent={designIntent} />
                )}
              </ErrorBoundary>
            </div>
          </main>

          {/* Theme Customizer Right Sidebar */}
          <aside
            className={`border-l bg-background transition-all duration-300 ${
              isThemeSidebarOpen ? "w-80 md:w-96" : "w-0"
            } overflow-hidden flex-shrink-0 h-screen sticky top-0`}
          >
            {isThemeSidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Theme Customizer
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Customize your design system
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsThemeSidebarOpen(false)}
                    className="md:hidden"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <ErrorBoundary section="Theme Customizer">
                      <ThemeCustomizer
                        key={`${activeSystemId}-${activeTheme?.id || 'default'}`}
                        colorTheme={colorTheme}
                        fontFamily={fontFamily}
                        visualFeel={visualFeel}
                        onColorThemeChange={setColorTheme}
                        onFontFamilyChange={setFontFamily}
                        onVisualFeelChange={setVisualFeel}
                        activeTheme={activeTheme}
                        onRestartWizard={() => setShowWizard(true)}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Quick Start Wizard */}
        {showWizard && (
          <ErrorBoundary section="Quick Start Wizard" onError={() => setShowWizard(false)}>
            <QuickStartWizard onClose={handleCloseWizard} />
          </ErrorBoundary>
        )}
        {/* Decision Gate */}
        {showDecisionGate && (
          <ErrorBoundary section="Decision Gate" onError={() => setShowDecisionGate(false)}>
            <DecisionGate onClose={handleCloseDecisionGate} onViewDemo={handleViewDemo} onImportSystem={handleImportSystem} onImportComponent={handleImportComponent} />
          </ErrorBoundary>
        )}
      </SidebarProvider>
      </UILibraryProvider>
    </ActiveThemeProvider>
  );
}