import { useState, useEffect, useCallback, useMemo } from "react";
import { ComponentShowcase } from "./components/ComponentShowcase";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import { Settings, ChevronLeft, ChevronRight, Upload, Target, Plug, Rocket, Package, Sparkles, Layers, Wand2, Library, Box, Palette, Code2, Settings2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { ImportConfig } from "./components/ImportConfig";
import { QuickStartGuide } from "./components/QuickStartGuide";
import { MCPConfig } from "./components/MCPConfig";
import { SavedDesignSystemsPage } from "./components/SavedDesignSystemsPage";
import { DesignSystemBuilderPage } from "./components/DesignSystemBuilderPage";
import { EnhancedPlayground } from "./components/showcases/EnhancedPlayground";
import { DesignTokensPage } from "./components/DesignTokensPage";
import { ImportedComponentsLibrary } from "./components/ImportedComponentsLibrary";
import { FrontendLibrariesConfig } from "./components/FrontendLibrariesConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Label } from "./components/ui/label";
import { AppStateProvider } from "./contexts/AppStateContext";
import { useAppState } from "./contexts/AppStateContext";
import { TokenEditorProvider } from "./contexts/TokenEditorContext";
import { ActiveThemeProvider } from "./contexts/ActiveThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { QuickStartWizard } from "./components/QuickStartWizard";
import { DecisionGate } from "./components/DecisionGate";
import { EmptyStateOnboarding } from "./components/EmptyStateOnboarding";
import { useEmptyStateInit } from "./hooks/useEmptyStateInit";
import { features } from "./config";
import { DevPreview, parseDevHash } from "./components/DevPreview";
import { UserMenu } from "./components/auth";
import { injectThemeCSS } from "./lib/dynamic-theme-engine";
import { DarkModeProvider, useDarkMode } from "./contexts/DarkModeContext";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { STORAGE_KEYS, UI_LIBRARY_LABELS } from "./lib/constants";
import { branding } from "./config";
import { UILibraryProvider } from "./providers/UILibraryProvider";
import { dataMigrationService } from "./services/migration";
import { getCategoriesForIntent, getAllIntents } from "./lib/component-registry";
import { IntentComponentEditor } from "./components/IntentComponentEditor";

// Configuration categories (static - not intent-based)
const configCategories = [
  { name: "Import Config", icon: Upload, id: "import-config" },
  { name: "Design System Builder", icon: Wand2, id: "design-system-builder" },
  { name: "Saved Systems", icon: Package, id: "saved-systems" },
  { name: "Imported Components", icon: Layers, id: "imported-components" },
  { name: "Front-End Libraries", icon: Library, id: "frontend-libraries" },
  { name: "MCP Config", icon: Plug, id: "mcp-config" }
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
  // Check for dev mode via URL hash (#dev, #dev/onboarding, etc.)
  const [devMode, setDevMode] = useState(() => parseDevHash());

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => setDevMode(parseDevHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dev mode - render components in isolation (still needs providers for hooks)
  if (devMode) {
    return (
      <ErrorBoundary section="Dev Preview">
        <AuthProvider>
          <AppStateProvider>
            <DevPreview
              initialComponent={devMode === 'selector' ? null : devMode}
              onClose={() => {
                window.location.hash = '';
                setDevMode(null);
              }}
            />
          </AppStateProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary section="Application">
      <DarkModeProvider>
        <AuthProvider onFirstSignIn={handleFirstSignIn}>
          <AppStateProvider>
            <TokenEditorProvider>
              <AppContent />
            </TokenEditorProvider>
          </AppStateProvider>
        </AuthProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState("quick-start");
  // Default to closed on smaller screens (< 1280px)
  const [isThemeSidebarOpen, setIsThemeSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
  );
  // Left sidebar state
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showDecisionGate, setShowDecisionGate] = useState(false);
  const [showEmptyStateOnboarding, setShowEmptyStateOnboarding] = useState(false);
  const [showComponentImport, setShowComponentImport] = useState(false);

  // Empty state initialization
  const { isFirstVisit, initializeStarterSystems } = useEmptyStateInit();
  
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
    updateIntent,
    deleteIntent,
  } = useAppState();

  // Intent Component Editor dialog state
  const [showIntentEditor, setShowIntentEditor] = useState(false);

  // Auto-collapse theme sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsThemeSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for hash-based navigation from other components
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== 'dev' && !hash.startsWith('dev/')) {
        setSelectedCategory(hash);
        // Clear the hash after navigation
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Check on mount
    handleHashNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  // Check if user has seen the decision gate before
  useEffect(() => {
    const hasSeenDecisionGate = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_DECISION_GATE);
    if (!hasSeenDecisionGate) {
      // Use new empty state onboarding if feature is enabled
      if (features.showEmptyStateOnboarding && isFirstVisit) {
        setShowEmptyStateOnboarding(true);
      } else {
        setShowDecisionGate(true);
      }
    }
  }, [isFirstVisit]);

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

  // === Empty State Onboarding Handlers ===
  const handleCloseEmptyStateOnboarding = () => {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_DECISION_GATE, 'true');
    setShowEmptyStateOnboarding(false);
  };

  const handleEmptyStateImportFigma = () => {
    handleCloseEmptyStateOnboarding();
    setSelectedCategory("import-config");
    toast.success("Let's import your Figma tokens!");
  };

  const handleEmptyStateImportJson = () => {
    handleCloseEmptyStateOnboarding();
    setShowWizard(true);
  };

  const handleEmptyStateUseStarter = (systemId: string) => {
    handleCloseEmptyStateOnboarding();
    initializeStarterSystems(systemId);
    // Use setTimeout to allow state to update before applying system
    setTimeout(() => {
      applySystem(systemId);
    }, 0);
    toast.success("Starter library loaded! You can customize it anytime.");
  };

  const handleEmptyStateSkipToDemo = () => {
    handleCloseEmptyStateOnboarding();
    initializeStarterSystems();
    toast.success("Welcome! Explore the demo components.");
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

  // Get dark mode controls
  const { applyThemeColorScheme } = useDarkMode();

  // 🎨 INJECT THEME CSS - This makes the ENTIRE app a living preview
  useEffect(() => {
    if (activeTheme) {
      const colorScheme = injectThemeCSS(activeTheme);
      // Sync dark mode with theme's color scheme
      applyThemeColorScheme(colorScheme);
      console.log('💫 Applied design system tokens to entire app:', activeTheme.name, { colorScheme });
    }
  }, [activeTheme, applyThemeColorScheme]);

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

  // Get the appropriate component categories based on design intent (dynamic from registry)
  const componentCategories = useMemo(() => {
    // Check for custom intent first (user-created intents with explicit categories)
    const customIntent = customIntents.find(i => i.id === designIntent);
    if (customIntent?.categories?.length) {
      // Map string icon names to actual icon components
      return customIntent.categories.map(cat => ({
        ...cat,
        icon: (Icons as any)[cat.icon] || Box
      }));
    }

    // Use the dynamic component registry
    const categories = getCategoriesForIntent(designIntent);

    // Map string icon names to actual icon components
    return categories.map(cat => ({
      ...cat,
      icon: (Icons as any)[cat.icon] || Box
    }));
  }, [designIntent, customIntents]);

  // Handle intent change and reset to playground
  const handleIntentChange = (newIntent: string) => {
    setDesignIntent(newIntent);
    setSelectedCategory("playground");
  };

  // Handle saving intent component categories
  const handleIntentComponentsSave = async (intentId: string, categories: Array<{ id: string; name: string; icon: string }>) => {
    await updateIntent(intentId, { categories });
  };

  // Get current intent label for display
  const currentIntentLabel = useMemo(() => {
    const fromAvailable = availableIntents.find(i => i.value === designIntent);
    if (fromAvailable) return fromAvailable.label;
    const fromCustom = customIntents.find(i => i.id === designIntent);
    if (fromCustom) return fromCustom.label;
    return designIntent;
  }, [designIntent, availableIntents, customIntents]);

  // Get current intent's custom categories if any
  const currentIntentCategories = useMemo(() => {
    const customIntent = customIntents.find(i => i.id === designIntent);
    return customIntent?.categories;
  }, [designIntent, customIntents]);

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
      <SidebarProvider open={isLeftSidebarOpen} onOpenChange={setIsLeftSidebarOpen}>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Left Sidebar */}
          <aside className={`transition-all duration-300 flex-shrink-0 h-full border-r bg-background ${isLeftSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="h-full overflow-y-auto">
          <Sidebar collapsible="none" className="h-full">
            <SidebarContent>
              <div className="p-4" style={{ paddingTop: '40px' }}>
                <h1 className="text-lg lg:text-xl xl:text-2xl font-semibold">{branding.appName}</h1>
              </div>

              {/* DESIGN FOUNDATION SECTION */}
              <div className="px-2 lg:px-3 pb-2">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <Layers className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
                  <h3 className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-foreground">Design Foundation</h3>
                </div>
                <div className="p-2 lg:p-3 rounded-lg bg-muted/40 border border-border/50 space-y-2 lg:space-y-3">
                  {/* Design System Selector */}
                  <div className="space-y-1.5 lg:space-y-2">
                    <Label htmlFor="design-system" className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 lg:gap-2">
                      <Palette className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
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
              <div className="px-2 lg:px-3 pt-2 lg:pt-3 pb-2">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <Box className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
                  <h3 className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-foreground">Component Library</h3>
                </div>
                <div className="p-2 lg:p-3 rounded-lg bg-accent/20 border border-border/50 space-y-2 lg:space-y-3">
                  {/* Design Intent Selector */}
                  <div className="space-y-1.5 lg:space-y-2">
                    <Label htmlFor="design-intent" className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 lg:gap-2">
                      <Target className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                      Design Intent
                    </Label>
                    <div className="flex gap-2">
                      <Select value={designIntent} onValueChange={handleIntentChange}>
                        <SelectTrigger id="design-intent" className="h-9 bg-background flex-1">
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
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => setShowIntentEditor(true)}
                        title="Edit components for this intent"
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Build CTA */}
              <div className="px-2 lg:px-4 pt-2 pb-3 lg:pb-4">
                <button
                  onClick={() => setShowWizard(true)}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group text-sm lg:text-base"
                >
                  <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform" />
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
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 z-10">
              <div
                className="flex h-14 items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6"
                style={{ paddingLeft: isLeftSidebarOpen ? undefined : '80px' }}
              >
                <SidebarTrigger />
                <h2 className="capitalize text-xs sm:text-sm md:text-base flex-1 truncate">
                  {selectedCategory === "quick-start" && "Quick Start Guide"}
                  {selectedCategory === "design-tokens" && "Design Tokens"}
                  {selectedCategory === "import-config" && "Import Config"}
                  {selectedCategory === "design-system-builder" && "Design System Builder"}
                  {selectedCategory === "saved-systems" && "Saved Design Systems"}
                  {selectedCategory === "imported-components" && "Imported Components"}
                  {selectedCategory === "mcp-config" && "MCP Config"}
                  {selectedCategory === "frontend-libraries" && "Front-End Libraries"}
                  {selectedCategory !== "quick-start" && selectedCategory !== "design-tokens" && selectedCategory !== "import-config" && selectedCategory !== "design-system-builder" && selectedCategory !== "saved-systems" && selectedCategory !== "imported-components" && selectedCategory !== "mcp-config" && selectedCategory !== "frontend-libraries" && (
                    componentCategories.find(c => c.id === selectedCategory)?.name
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <DarkModeToggle />
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

            <div className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 ${activeTheme?.fontFamily ? `font-${activeTheme.fontFamily}` : ''}`}>
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
                ) : selectedCategory === "frontend-libraries" ? (
                  <FrontendLibrariesConfig />
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
            className={`border-l bg-background transition-all duration-300 flex-shrink-0 h-full ${
              isThemeSidebarOpen ? "w-72 lg:w-80 xl:w-96" : "w-0"
            } overflow-hidden`}
          >
            <div className="h-full flex flex-col w-72 lg:w-80 xl:w-96">
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
                    title="Close theme customizer"
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
        {/* Empty State Onboarding (import-first flow) */}
        {showEmptyStateOnboarding && (
          <ErrorBoundary section="Empty State Onboarding" onError={() => setShowEmptyStateOnboarding(false)}>
            <EmptyStateOnboarding
              onImportFigma={handleEmptyStateImportFigma}
              onImportJson={handleEmptyStateImportJson}
              onUseStarterLibrary={handleEmptyStateUseStarter}
              onSkipToDemo={handleEmptyStateSkipToDemo}
              onClose={handleCloseEmptyStateOnboarding}
            />
          </ErrorBoundary>
        )}

        {/* Intent Component Editor Dialog */}
        <IntentComponentEditor
          open={showIntentEditor}
          onOpenChange={setShowIntentEditor}
          intentId={designIntent}
          intentLabel={currentIntentLabel}
          currentCategories={currentIntentCategories}
          onSave={handleIntentComponentsSave}
        />
      </SidebarProvider>
      </UILibraryProvider>
    </ActiveThemeProvider>
  );
}