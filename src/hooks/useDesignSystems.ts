import { useState, useEffect } from 'react';
import { applyTokens } from '../lib/token-utils';
import { DEFAULT_THEMES } from '../lib/default-themes';
import { MATERIAL_THEMES } from '../lib/material-themes';
import { MINIMALIST_THEMES } from '../lib/minimalist-themes';
import { CANDY_NEST_THEMES } from '../lib/candy-nest-themes';
import { DesignSystemVersion, VersionType } from '../types/version';
import { STORAGE_KEYS, SYSTEM_IDS, THEME_IDS, INTENT_IDS } from '../lib/constants';

// Theme = A variable set (colors, spacing, typography, etc.)
export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  sidebar?: Record<string, string>; // Optional sidebar-specific colors
  opacity?: Record<string, string>; // Optional opacity tokens
  effects?: Record<string, string>; // Optional visual effects (backdrop-blur, etc.)
  // Component-specific style configurations
  componentStyles?: {
    button?: {
      showBorder?: boolean; // Show borders on outline/secondary variants (default: true)
      showIcons?: boolean;  // Show icons in buttons (default: true)
    };
    chip?: {
      showBorder?: boolean; // Show borders on chips/badges (default: true)
      showIcons?: boolean;  // Show icons in chips/badges (default: true)
    };
  };
  // Theme customizer presets
  colorTheme?: 'neo' | 'brutalist' | 'glassmorphism' | 'candy' | 'material' | 'minimal';
  fontFamily?: 'inter' | 'spaceGrotesk' | 'jetbrainsMono' | 'poppins' | 'playfairDisplay' | 'manrope' | 'system';
  visualFeel?: 'modern' | 'classic' | 'playful' | 'minimal' | 'bold';
}

// Design System = Container with multiple themes and intents
export interface DesignSystem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  useIcons?: boolean; // Whether to display icons in UI components (default: true)
  // Multiple themes within the system
  themes: Theme[];
  activeThemeId?: string;
  // Design intents associated with this system
  intents?: Array<{
    id: string;
    value: string;
    label: string;
    description?: string;
    icon?: string;
    categories?: Array<{
      id: string;
      name: string;
      icon: string;
    }>;
  }>;
  // Version history
  versions?: DesignSystemVersion[];
  currentVersionId?: string;
}

// Use centralized storage keys
const STORAGE_KEY = STORAGE_KEYS.DESIGN_SYSTEMS;
const ACTIVE_SYSTEM_KEY = STORAGE_KEYS.ACTIVE_SYSTEM_ID;
const ACTIVE_THEMES_KEY = STORAGE_KEYS.ACTIVE_THEME_IDS;
const INITIALIZED_KEY = STORAGE_KEYS.DESIGN_SYSTEMS_INITIALIZED;

// Pre-built design systems (always available, never persisted)
const createDefaultSystem = (): DesignSystem => ({
  id: SYSTEM_IDS.DEFAULT,
  name: 'Default Design System',
  description: 'The base design system with 4 curated themes',
  createdAt: new Date().toISOString(),
  themes: DEFAULT_THEMES,
  activeThemeId: THEME_IDS.APPLE,
  intents: [
    { 
      id: 'web-app', 
      value: 'web-app', 
      label: 'Web App',
      description: 'General purpose web application components',
      icon: 'Code2'
    },
    { 
      id: 'ecommerce', 
      value: 'ecommerce', 
      label: 'E-commerce',
      description: 'Shopping and product-focused components',
      icon: 'ShoppingBag'
    },
    { 
      id: 'mobile', 
      value: 'mobile', 
      label: 'Mobile Experience',
      description: 'Touch-optimized mobile components',
      icon: 'Smartphone'
    },
    { 
      id: 'landing', 
      value: 'landing', 
      label: 'Landing Page',
      description: 'Marketing and conversion-focused components',
      icon: 'Megaphone'
    }
  ]
});

const createMaterialSystem = (): DesignSystem => ({
  id: 'material-system',
  name: 'Material Design System',
  description: 'Google Material Design 3 with 3 theme variations',
  createdAt: new Date().toISOString(),
  themes: MATERIAL_THEMES,
  activeThemeId: 'material-light',
  intents: [
    { 
      id: 'web-app', 
      value: 'web-app', 
      label: 'Web App',
      description: 'General purpose web application components',
      icon: 'Code2'
    },
    { 
      id: 'mobile', 
      value: 'mobile', 
      label: 'Mobile Experience',
      description: 'Touch-optimized mobile components',
      icon: 'Smartphone'
    }
  ]
});

const createMinimalistSystem = (): DesignSystem => ({
  id: 'minimalist-system',
  name: 'Minimalist Design System',
  description: 'Clean and refined minimal design with 3 themes',
  createdAt: new Date().toISOString(),
  useIcons: false, // Minimalist design removes icons for purity
  themes: MINIMALIST_THEMES,
  activeThemeId: 'swiss-minimal',
  intents: [
    { 
      id: 'web-app', 
      value: 'web-app', 
      label: 'Web App',
      description: 'General purpose web application components',
      icon: 'Code2'
    },
    { 
      id: 'landing', 
      value: 'landing', 
      label: 'Landing Page',
      description: 'Marketing and conversion-focused components',
      icon: 'Megaphone'
    }
  ]
});

const createCandyNestSystem = (): DesignSystem => ({
  id: 'candy-nest-system',
  name: 'Candy Nest Design System',
  description: 'Editorial design system inspired by premier magazine brands',
  createdAt: new Date().toISOString(),
  themes: CANDY_NEST_THEMES,
  activeThemeId: 'gq-theme',
  intents: [
    { 
      id: 'web-editorial', 
      value: 'web-editorial', 
      label: 'Web Editorial',
      description: 'Magazine-style editorial content and publishing',
      icon: 'Newspaper'
    }
  ]
});

export function useDesignSystems() {
  const [systems, setSystems] = useState<DesignSystem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      // Filter out pre-built systems - they will be injected dynamically
      const prebuiltIds = ['default-system', 'material-system', 'minimalist-system', 'candy-nest-system'];
      return parsed.filter((s: DesignSystem) => !prebuiltIds.includes(s.id));
    } catch (error) {
      console.error('Error loading design systems:', error);
      return [];
    }
  });

  const [activeSystemId, setActiveSystemId] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem(ACTIVE_SYSTEM_KEY) || undefined;
    } catch {
      return undefined;
    }
  });

  // Track active theme for each system (especially pre-built ones)
  const [activeThemeIds, setActiveThemeIds] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_THEMES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Create pre-built systems with the stored active theme
  const createDefaultSystemWithTheme = (): DesignSystem => {
    const system = createDefaultSystem();
    // Validate that the stored active theme still exists
    const storedThemeId = activeThemeIds['default-system'];
    const themeExists = storedThemeId && system.themes.some(t => t.id === storedThemeId);
    
    return {
      ...system,
      activeThemeId: themeExists ? storedThemeId : system.activeThemeId
    };
  };

  const createMaterialSystemWithTheme = (): DesignSystem => {
    const system = createMaterialSystem();
    return {
      ...system,
      activeThemeId: activeThemeIds['material-system'] || system.activeThemeId
    };
  };

  const createMinimalistSystemWithTheme = (): DesignSystem => {
    const system = createMinimalistSystem();
    return {
      ...system,
      activeThemeId: activeThemeIds['minimalist-system'] || system.activeThemeId
    };
  };

  const createCandyNestSystemWithTheme = (): DesignSystem => {
    const system = createCandyNestSystem();
    return {
      ...system,
      activeThemeId: activeThemeIds['candy-nest-system'] || system.activeThemeId
    };
  };

  // Always inject pre-built systems dynamically (never persist them)
  const allSystems = [
    createDefaultSystemWithTheme(), 
    createMaterialSystemWithTheme(), 
    createMinimalistSystemWithTheme(), 
    createCandyNestSystemWithTheme(),
    ...systems
  ];

  // Initialize with default system if not already initialized
  useEffect(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      setActiveSystemId('default-system');
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } else if (allSystems.length > 0 && !activeSystemId) {
      // If we have systems but no active one, set the first as active
      setActiveSystemId(allSystems[0].id);
    }
    
    // Clean up invalid theme IDs from storage
    const validThemeIds: Record<string, string> = {};
    Object.entries(activeThemeIds).forEach(([systemId, themeId]) => {
      const system = allSystems.find(s => s.id === systemId);
      if (system && system.themes.some(t => t.id === themeId)) {
        validThemeIds[systemId] = themeId;
      }
    });
    
    // Only update if something changed
    if (Object.keys(validThemeIds).length !== Object.keys(activeThemeIds).length) {
      setActiveThemeIds(validThemeIds);
    }
  }, []);

  // Persist to localStorage (excluding pre-built systems)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
    } catch (error) {
      console.error('Error saving design systems:', error);
    }
  }, [systems]);

  useEffect(() => {
    try {
      if (activeSystemId) {
        localStorage.setItem(ACTIVE_SYSTEM_KEY, activeSystemId);
      } else {
        localStorage.removeItem(ACTIVE_SYSTEM_KEY);
      }
    } catch (error) {
      console.error('Error saving active system:', error);
    }
  }, [activeSystemId]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_THEMES_KEY, JSON.stringify(activeThemeIds));
    } catch (error) {
      console.error('Error saving active themes:', error);
    }
  }, [activeThemeIds]);

  // Auto-apply theme when active system or theme changes
  useEffect(() => {
    if (activeSystemId) {
      const system = allSystems.find(s => s.id === activeSystemId);
      if (system && system.themes && system.themes.length > 0) {
        const themeId = activeThemeIds[activeSystemId] || system.activeThemeId || system.themes[0].id;
        const theme = system.themes.find(t => t.id === themeId);
        
        if (theme) {
          // Apply the theme tokens immediately
          const root = document.documentElement;

          // Apply colors - wrap HSL values in hsl()
          Object.entries(theme.colors || {}).forEach(([key, value]) => {
            if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch')) {
              root.style.setProperty(`--${key}`, value);
            } else {
              root.style.setProperty(`--${key}`, `hsl(${value})`);
            }
          });

          // Apply spacing
          Object.entries(theme.spacing || {}).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
          });

          // Apply typography
          Object.entries(theme.typography || {}).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
            // Don't apply font-sans to document.body - only set CSS variable
            // This prevents the theme font from affecting the design system UI itself
          });

          // Apply border radius
          Object.entries(theme.borderRadius || {}).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
            if (key === 'radius-lg') {
              root.style.setProperty(`--radius`, value);
            }
          });

          // Apply shadows
          Object.entries(theme.shadows || {}).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
          });

          // Apply sidebar colors if provided
          if (theme.sidebar) {
            Object.entries(theme.sidebar).forEach(([key, value]) => {
              const varName = key === 'background' ? '--sidebar' : `--sidebar-${key}`;
              root.style.setProperty(varName, value);
            });
          }

          // Apply opacity tokens if provided
          if (theme.opacity) {
            Object.entries(theme.opacity).forEach(([key, value]) => {
              root.style.setProperty(`--${key}`, value);
            });
          }

          // Apply visual effects if provided
          if (theme.effects) {
            Object.entries(theme.effects).forEach(([key, value]) => {
              root.style.setProperty(`--${key}`, value);
            });
          }
        }
      }
    }
  }, [activeSystemId, activeThemeIds, allSystems]);

  const addSystem = (system: Omit<DesignSystem, 'id' | 'createdAt'>) => {
    const newSystem: DesignSystem = {
      ...system,
      id: `system-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSystems(prev => [...prev, newSystem]);
    return newSystem;
  };

  const updateSystem = (id: string, updates: Partial<DesignSystem>) => {
    // Don't allow updating the default system (except activeThemeId)
    if (id === 'default-system') {
      // Only allow updating activeThemeId for theme switching
      if (updates.activeThemeId) {
        // This is a local state update, not persisted
        return;
      }
      return;
    }
    setSystems(prev => prev.map(system => 
      system.id === id ? { ...system, ...updates } : system
    ));
  };

  const deleteSystem = (id: string) => {
    // Don't allow deleting pre-built systems
    const prebuiltIds = ['default-system', 'material-system', 'minimalist-system', 'candy-nest-system'];
    if (prebuiltIds.includes(id)) {
      return;
    }
    setSystems(prev => prev.filter(system => system.id !== id));
    if (activeSystemId === id) {
      setActiveSystemId(undefined);
    }
  };

  const getSystem = (id: string) => {
    return allSystems.find(system => system.id === id);
  };

  const applySystem = (id: string) => {
    const system = getSystem(id);
    if (!system || !system.themes || system.themes.length === 0) return false;

    const activeTheme = system.themes.find(t => t.id === system.activeThemeId) || system.themes[0];
    if (!activeTheme) return false;

    const root = document.documentElement;

    // Apply colors - wrap HSL values in hsl()
    Object.entries(activeTheme.colors || {}).forEach(([key, value]) => {
      // Check if value is already a complete color (starts with # or rgb/hsl/oklch)
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch')) {
        root.style.setProperty(`--${key}`, value);
      } else {
        // Assume it's an HSL triplet and wrap it
        root.style.setProperty(`--${key}`, `hsl(${value})`);
      }
    });

    // Apply spacing
    Object.entries(activeTheme.spacing || {}).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply typography
    Object.entries(activeTheme.typography || {}).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      // Don't apply font-sans to document.body - only set CSS variable
      // This prevents the theme font from affecting the design system UI itself
    });

    // Apply border radius
    Object.entries(activeTheme.borderRadius || {}).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      
      // Map our theme border radius to Tailwind's --radius variable
      // Use radius-lg as the base radius that Tailwind uses
      if (key === 'radius-lg') {
        root.style.setProperty(`--radius`, value);
      }
    });

    // Apply shadows
    Object.entries(activeTheme.shadows || {}).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply sidebar colors if provided
    if (activeTheme.sidebar) {
      Object.entries(activeTheme.sidebar).forEach(([key, value]) => {
        // Map 'background' to '--sidebar', others to '--sidebar-{key}'
        const varName = key === 'background' ? '--sidebar' : `--sidebar-${key}`;
        root.style.setProperty(varName, value);
      });
    }

    // Apply opacity tokens if provided
    if (activeTheme.opacity) {
      Object.entries(activeTheme.opacity).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Apply visual effects if provided
    if (activeTheme.effects) {
      Object.entries(activeTheme.effects).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    setActiveSystemId(id);
    return true;
  };

  const exportSystem = (id: string) => {
    const system = getSystem(id);
    if (!system) return;

    const exportData = {
      name: system.name,
      description: system.description,
      themes: system.themes,
      intents: system.intents
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${system.name.toLowerCase().replace(/\s+/g, '-')}-design-system.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Theme management within a system
  const addThemeToSystem = (systemId: string, theme: Omit<Theme, 'id'>) => {
    const newTheme: Theme = {
      ...theme,
      id: `theme-${Date.now()}`
    };
    
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        return {
          ...system,
          themes: [...system.themes, newTheme]
        };
      }
      return system;
    }));
    
    return newTheme;
  };

  const updateThemeInSystem = (systemId: string, themeId: string, updates: Partial<Theme>) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        return {
          ...system,
          themes: system.themes.map(theme =>
            theme.id === themeId ? { ...theme, ...updates } : theme
          )
        };
      }
      return system;
    }));
  };

  const deleteThemeFromSystem = (systemId: string, themeId: string) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const updatedThemes = system.themes.filter(theme => theme.id !== themeId);
        return {
          ...system,
          themes: updatedThemes,
          // If active theme was deleted, switch to first available
          activeThemeId: system.activeThemeId === themeId && updatedThemes.length > 0
            ? updatedThemes[0].id
            : system.activeThemeId
        };
      }
      return system;
    }));
  };

  const setActiveTheme = (systemId: string, themeId: string) => {
    const system = getSystem(systemId);
    if (!system) return false;

    const theme = system.themes.find(t => t.id === themeId);
    if (!theme) return false;

    // Apply the theme tokens
    const root = document.documentElement;

    // Apply colors - wrap HSL values in hsl()
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Check if value is already a complete color (starts with # or rgb/hsl/oklch)
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch')) {
        root.style.setProperty(`--${key}`, value);
      } else {
        // Assume it's an HSL triplet and wrap it
        root.style.setProperty(`--${key}`, `hsl(${value})`);
      }
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      // Don't apply font-sans to document.body - only set CSS variable
      // This prevents the theme font from affecting the design system UI itself
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      
      // Map our theme border radius to Tailwind's --radius variable
      // Use radius-lg as the base radius that Tailwind uses
      if (key === 'radius-lg') {
        root.style.setProperty(`--radius`, value);
      }
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply sidebar colors if provided
    if (theme.sidebar) {
      Object.entries(theme.sidebar).forEach(([key, value]) => {
        // Map 'background' to '--sidebar', others to '--sidebar-{key}'
        const varName = key === 'background' ? '--sidebar' : `--sidebar-${key}`;
        root.style.setProperty(varName, value);
      });
    }

    // Apply opacity tokens if provided
    if (theme.opacity) {
      Object.entries(theme.opacity).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Apply visual effects if provided
    if (theme.effects) {
      Object.entries(theme.effects).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Update active theme in system
    updateSystem(systemId, { activeThemeId: themeId });
    
    // Update active theme for the system in local storage
    setActiveThemeIds(prev => ({
      ...prev,
      [systemId]: themeId
    }));
    
    return true;
  };

  const getActiveTheme = (systemId: string): Theme | undefined => {
    const system = getSystem(systemId);
    if (!system) return undefined;
    
    return system.themes.find(t => t.id === system.activeThemeId) || system.themes[0];
  };

  // Version management
  const addVersion = (systemId: string, versionType: VersionType, notes: string, author?: string) => {
    const system = getSystem(systemId);
    if (!system) return null;

    const { createVersionSnapshot, pruneVersions } = require('../lib/version-utilities');
    
    const previousVersion = system.versions && system.versions.length > 0
      ? system.versions[system.versions.length - 1]
      : undefined;

    const newVersion = createVersionSnapshot(system, versionType, notes, previousVersion, author);
    
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        const updatedVersions = [...(s.versions || []), newVersion];
        const prunedVersions = pruneVersions(updatedVersions, 50); // Keep last 50 versions
        
        return {
          ...s,
          versions: prunedVersions,
          currentVersionId: newVersion.id
        };
      }
      return s;
    }));
    
    return newVersion;
  };

  const restoreVersion = (systemId: string, version: DesignSystemVersion) => {
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          name: version.snapshot.name,
          description: version.snapshot.description,
          themes: JSON.parse(JSON.stringify(version.snapshot.themes)), // Deep clone
          activeThemeId: version.snapshot.activeThemeId,
          currentVersionId: version.id
        };
      }
      return s;
    }));

    // Re-apply the system to update the UI
    applySystem(systemId);
  };

  const exportVersionAsJSON = (version: DesignSystemVersion) => {
    const { exportVersion } = require('../lib/version-utilities');
    const json = exportVersion(version);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `version-${version.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteVersion = (systemId: string, versionId: string) => {
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          versions: (s.versions || []).filter(v => v.id !== versionId)
        };
      }
      return s;
    }));
  };

  return {
    systems: allSystems, // Return all systems including the dynamic default
    activeSystemId,
    activeThemeIds, // Expose active theme IDs for each system
    addSystem,
    updateSystem,
    deleteSystem,
    getSystem,
    applySystem,
    exportSystem,
    // Theme management
    addThemeToSystem,
    updateThemeInSystem,
    deleteThemeFromSystem,
    setActiveTheme,
    getActiveTheme,
    // Version management
    addVersion,
    restoreVersion,
    exportVersionAsJSON,
    deleteVersion
  };
}