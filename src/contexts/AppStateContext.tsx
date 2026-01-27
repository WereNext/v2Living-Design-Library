import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDesignSystems, type Theme, type DesignSystem } from '../hooks/useDesignSystems';
import { useTheme } from '../hooks/useTheme';
import { useIntentManager } from '../hooks/useIntentManager';
import type { ColorTheme, FontFamily, VisualFeel } from '../components/ThemeCustomizer';

interface AppState {
  // Design System State
  designSystems: DesignSystem[];
  activeSystemId: string | undefined;
  activeSystem: DesignSystem | null;
  activeTheme: Theme | null;
  shouldShowIcons: boolean; // Whether to display icons based on design system settings
  
  // Theme Customizer State
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  visualFeel: VisualFeel;
  
  // Intent State
  designIntent: string;
  availableIntents: Array<{ id: string; value: string; label: string; description?: string }>;
  customIntents: Array<{ id: string; value?: string; label: string; description?: string; isCustom?: boolean }>;
  
  // Actions - Design Systems
  applySystem: (id: string) => boolean;
  setActiveTheme: (systemId: string, themeId: string) => void;
  getSystem: (id: string) => DesignSystem | undefined;
  addDesignSystem: (system: Omit<DesignSystem, 'id' | 'createdAt'>) => Promise<DesignSystem | null>;
  updateSystem: (id: string, updates: Partial<DesignSystem>) => void;
  deleteDesignSystem: (id: string) => void;
  
  // Actions - Theme Customizer
  setColorTheme: (theme: ColorTheme) => void;
  setFontFamily: (font: FontFamily) => void;
  setVisualFeel: (feel: VisualFeel) => void;
  
  // Actions - Intents
  setDesignIntent: (intent: string) => void;
  addIntent: (intent: { id: string; name: string; description: string }) => void;
  updateIntent: (id: string, updates: { categories?: Array<{ id: string; name: string; icon: string }> }) => Promise<void>;
  deleteIntent: (id: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // Design systems
  const { 
    systems: designSystems, 
    activeSystemId, 
    addSystem: addDesignSystem, 
    deleteSystem: deleteDesignSystem,
    applySystem,
    getSystem,
    updateSystem,
    setActiveTheme,
    getActiveTheme,
    activeThemeIds
  } = useDesignSystems();
  
  // Initialize design intent based on active system's first intent
  const [designIntent, setDesignIntent] = useState(() => {
    if (activeSystemId) {
      const system = getSystem(activeSystemId);
      return system?.intents?.[0]?.value || "web-app";
    }
    return "web-app";
  });
  
  // Theme customizer hooks
  const {
    colorTheme,
    fontFamily,
    visualFeel,
    setColorTheme,
    setFontFamily,
    setVisualFeel,
  } = useTheme();
  
  // Intent manager
  const { intents: customIntents, addIntent, updateIntent, deleteIntent } = useIntentManager();

  // Compute active system
  const activeSystem = activeSystemId ? getSystem(activeSystemId) : null;
  
  // Compute active theme - this will update whenever activeSystemId or activeThemeIds change
  const [activeTheme, setActiveThemeState] = useState<Theme | null>(null);
  
  useEffect(() => {
    if (!activeSystemId) {
      setActiveThemeState(null);
      return;
    }
    
    const system = getSystem(activeSystemId);
    if (!system || !system.themes || system.themes.length === 0) {
      setActiveThemeState(null);
      return;
    }
    
    const themeId = activeThemeIds[activeSystemId] || system.activeThemeId || system.themes[0]?.id;
    const theme = system.themes.find(t => t.id === themeId) || system.themes[0] || null;
    
    console.log('🔄 AppState: Active theme changed:', {
      systemId: activeSystemId,
      systemName: system.name,
      themeId,
      themeName: theme?.name,
      hasColors: theme?.colors ? Object.keys(theme.colors).length : 0
    });
    
    setActiveThemeState(theme);
  }, [activeSystemId, activeThemeIds, getSystem]);

  // Apply active design system on mount
  useEffect(() => {
    if (activeSystemId) {
      applySystem(activeSystemId);
    }
  }, [activeSystemId, applySystem]);
  
  // Update design intent when active system changes
  useEffect(() => {
    if (activeSystem?.intents && activeSystem.intents.length > 0) {
      // Set to first intent of the new system
      const firstIntent = activeSystem.intents[0].value;
      setDesignIntent(firstIntent);
      console.log('🎯 Auto-selected design intent:', firstIntent, 'for system:', activeSystem.name);
    }
  }, [activeSystem?.id, activeSystem?.intents]); // Only when system ID changes

  // Apply theme customizer overrides to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme override classes
    root.classList.remove(
      'theme-neo', 'theme-brutalist', 'theme-glassmorphism', 'theme-candy', 'theme-material', 'theme-minimal',
      'font-inter', 'font-spaceGrotesk', 'font-jetbrainsMono', 'font-poppins', 'font-playfairDisplay', 'font-manrope', 'font-system', 'font-helvetica', 'font-avenir', 'font-georgia',
      'feel-modern', 'feel-classic', 'feel-playful', 'feel-minimal', 'feel-bold'
    );
    
    // Apply current theme override classes
    // IMPORTANT: We DON'T apply font classes to root anymore - this prevents theme fonts from affecting the UI
    // Font classes should only be used on specific component showcase containers
    const themeClass = `theme-${colorTheme}`;
    const feelClass = `feel-${visualFeel}`;
    
    root.classList.add(themeClass);
    // REMOVED: root.classList.add(`font-${fontFamily}`); // Don't apply font to root!
    root.classList.add(feelClass);
    
    console.log('🎨 Theme overrides applied:', {
      colorTheme: `${colorTheme} → ${themeClass}`,
      fontFamily: `${fontFamily} (set as CSS var only, not applied to root)`,
      visualFeel: `${visualFeel} → ${feelClass}`,
      appliedClasses: [themeClass, feelClass],
      allRootClasses: Array.from(root.classList)
    });
  }, [colorTheme, fontFamily, visualFeel]);

  // Get available intents
  const availableIntents = activeSystem?.intents && activeSystem.intents.length > 0
    ? activeSystem.intents
    : [
        { id: 'web-app', value: 'web-app', label: 'Web Application', description: 'Standard web application layouts' },
        { id: 'mobile-app', value: 'mobile-app', label: 'Mobile App', description: 'Mobile-optimized interfaces' },
        { id: 'dashboard', value: 'dashboard', label: 'Dashboard', description: 'Data visualization dashboards' },
        { id: 'landing-page', value: 'landing-page', label: 'Landing Page', description: 'Marketing landing pages' },
        { id: 'e-commerce', value: 'e-commerce', label: 'E-Commerce', description: 'Online shopping interfaces' },
        { id: 'blog', value: 'blog', label: 'Blog', description: 'Content-focused blog layouts' },
      ];

  const value: AppState = {
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
    shouldShowIcons: activeSystem?.useIcons !== false, // Default to true unless explicitly false
    
    // Design System Actions
    applySystem,
    setActiveTheme,
    getSystem,
    addDesignSystem,
    updateSystem,
    deleteDesignSystem,
    
    // Theme Customizer Actions
    setColorTheme,
    setFontFamily,
    setVisualFeel,
    
    // Intent Actions
    setDesignIntent,
    addIntent,
    updateIntent,
    deleteIntent,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}