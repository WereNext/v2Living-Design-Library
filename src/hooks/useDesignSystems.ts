import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_THEMES } from '../lib/default-themes';
import { MATERIAL_THEMES } from '../lib/material-themes';
import { MINIMALIST_THEMES } from '../lib/minimalist-themes';
import { CANDY_NEST_THEMES } from '../lib/candy-nest-themes';
import { DesignSystemVersion, VersionType } from '../types/version';
import { STORAGE_KEYS, SYSTEM_IDS, THEME_IDS } from '../lib/constants';
import { useServices } from '../services/ServiceFactory';

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
  // Cloud sync fields
  isPublic?: boolean;
  shareSlug?: string;
}

// Use centralized storage keys
const ACTIVE_SYSTEM_KEY = STORAGE_KEYS.ACTIVE_SYSTEM_ID;
const ACTIVE_THEMES_KEY = STORAGE_KEYS.ACTIVE_THEME_IDS;
const INITIALIZED_KEY = STORAGE_KEYS.DESIGN_SYSTEMS_INITIALIZED;

// Pre-built system IDs
const PREBUILT_IDS = [SYSTEM_IDS.DEFAULT, 'material-system', 'minimalist-system', 'candy-nest-system'];

// Pre-built design systems (always available, never persisted to cloud)
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

// Helper to apply theme tokens to DOM
function applyThemeToDOM(theme: Theme) {
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

export function useDesignSystems() {
  const { designSystems: service, isAuthenticated, mode } = useServices();

  // User-created systems (loaded from service)
  const [userSystems, setUserSystems] = useState<DesignSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active system/theme tracking (always localStorage for fast access)
  const [activeSystemId, setActiveSystemId] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem(ACTIVE_SYSTEM_KEY) || undefined;
    } catch {
      return undefined;
    }
  });

  const [activeThemeIds, setActiveThemeIds] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_THEMES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Create pre-built systems with stored active theme
  const prebuiltSystems = useMemo(() => {
    const defaultSys = createDefaultSystem();
    const materialSys = createMaterialSystem();
    const minimalistSys = createMinimalistSystem();
    const candyNestSys = createCandyNestSystem();

    // Apply stored active themes
    if (activeThemeIds[defaultSys.id] && defaultSys.themes.some(t => t.id === activeThemeIds[defaultSys.id])) {
      defaultSys.activeThemeId = activeThemeIds[defaultSys.id];
    }
    if (activeThemeIds[materialSys.id]) {
      materialSys.activeThemeId = activeThemeIds[materialSys.id];
    }
    if (activeThemeIds[minimalistSys.id]) {
      minimalistSys.activeThemeId = activeThemeIds[minimalistSys.id];
    }
    if (activeThemeIds[candyNestSys.id]) {
      candyNestSys.activeThemeId = activeThemeIds[candyNestSys.id];
    }

    return [defaultSys, materialSys, minimalistSys, candyNestSys];
  }, [activeThemeIds]);

  // Combined systems (prebuilt + user-created)
  const allSystems = useMemo(() => {
    return [...prebuiltSystems, ...userSystems];
  }, [prebuiltSystems, userSystems]);

  // Load user systems from service
  const loadSystems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      if (result.error) {
        setError(result.error.message);
      } else {
        // Filter out any prebuilt systems that might have been saved
        const filtered = (result.data || []).filter(s => !PREBUILT_IDS.includes(s.id));
        setUserSystems(filtered);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load design systems');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  // Load on mount and when service changes (auth state change)
  useEffect(() => {
    loadSystems();
  }, [loadSystems, isAuthenticated]);

  // Initialize with default system if not already initialized
  useEffect(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      setActiveSystemId(SYSTEM_IDS.DEFAULT);
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } else if (allSystems.length > 0 && !activeSystemId) {
      setActiveSystemId(allSystems[0].id);
    }
  }, [allSystems, activeSystemId]);

  // Persist active system/theme to localStorage
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
          applyThemeToDOM(theme);
        }
      }
    }
  }, [activeSystemId, activeThemeIds, allSystems]);

  const addSystem = useCallback(async (system: Omit<DesignSystem, 'id' | 'createdAt'>) => {
    const newSystem: DesignSystem = {
      ...system,
      id: `system-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    setUserSystems(prev => [...prev, newSystem]);

    // Persist to service
    const result = await service.create({
      name: newSystem.name,
      description: newSystem.description,
      useIcons: newSystem.useIcons,
      themes: newSystem.themes,
      intents: newSystem.intents,
    });

    if (result.error) {
      // Rollback on error
      setUserSystems(prev => prev.filter(s => s.id !== newSystem.id));
      console.error('Failed to save system:', result.error);
      return null;
    }

    // Update with server-assigned ID if different
    if (result.data && result.data.id !== newSystem.id) {
      setUserSystems(prev => prev.map(s =>
        s.id === newSystem.id ? { ...s, id: result.data!.id } : s
      ));
      return result.data;
    }

    return newSystem;
  }, [service]);

  const updateSystem = useCallback(async (id: string, updates: Partial<DesignSystem>) => {
    // Don't allow updating prebuilt systems (except activeThemeId locally)
    if (PREBUILT_IDS.includes(id)) {
      if (updates.activeThemeId) {
        setActiveThemeIds(prev => ({ ...prev, [id]: updates.activeThemeId! }));
      }
      return;
    }

    // Optimistic update
    setUserSystems(prev => prev.map(system =>
      system.id === id ? { ...system, ...updates } : system
    ));

    // Persist to service
    const result = await service.update(id, updates);
    if (result.error) {
      console.error('Failed to update system:', result.error);
      // Could rollback here, but for now just log
    }
  }, [service]);

  const deleteSystem = useCallback(async (id: string) => {
    // Don't allow deleting prebuilt systems
    if (PREBUILT_IDS.includes(id)) {
      return;
    }

    const systemToDelete = userSystems.find(s => s.id === id);

    // Optimistic update
    setUserSystems(prev => prev.filter(system => system.id !== id));
    if (activeSystemId === id) {
      setActiveSystemId(undefined);
    }

    // Persist to service
    const result = await service.delete(id);
    if (result.error) {
      // Rollback on error
      if (systemToDelete) {
        setUserSystems(prev => [...prev, systemToDelete]);
      }
      console.error('Failed to delete system:', result.error);
    }
  }, [service, userSystems, activeSystemId]);

  const getSystem = useCallback((id: string) => {
    return allSystems.find(system => system.id === id);
  }, [allSystems]);

  const applySystem = useCallback((id: string) => {
    const system = allSystems.find(s => s.id === id);
    if (!system || !system.themes || system.themes.length === 0) return false;

    const activeTheme = system.themes.find(t => t.id === system.activeThemeId) || system.themes[0];
    if (!activeTheme) return false;

    applyThemeToDOM(activeTheme);
    setActiveSystemId(id);
    return true;
  }, [allSystems]);

  const exportSystem = useCallback((id: string) => {
    const system = allSystems.find(s => s.id === id);
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
  }, [allSystems]);

  // Theme management within a system
  const addThemeToSystem = useCallback(async (systemId: string, theme: Omit<Theme, 'id'>) => {
    const newTheme: Theme = {
      ...theme,
      id: `theme-${Date.now()}`
    };

    if (PREBUILT_IDS.includes(systemId)) {
      return newTheme; // Don't persist for prebuilt systems
    }

    // Optimistic update
    setUserSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        return {
          ...system,
          themes: [...system.themes, newTheme]
        };
      }
      return system;
    }));

    // Persist to service
    const result = await service.addTheme(systemId, theme);
    if (result.error) {
      console.error('Failed to add theme:', result.error);
    }

    return result.data || newTheme;
  }, [service]);

  const updateThemeInSystem = useCallback(async (systemId: string, themeId: string, updates: Partial<Theme>) => {
    if (PREBUILT_IDS.includes(systemId)) {
      return; // Don't update prebuilt system themes
    }

    // Optimistic update
    setUserSystems(prev => prev.map(system => {
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

    // Persist to service
    const result = await service.updateTheme(systemId, themeId, updates);
    if (result.error) {
      console.error('Failed to update theme:', result.error);
    }
  }, [service]);

  const deleteThemeFromSystem = useCallback(async (systemId: string, themeId: string) => {
    if (PREBUILT_IDS.includes(systemId)) {
      return; // Don't delete prebuilt system themes
    }

    // Optimistic update
    setUserSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const updatedThemes = system.themes.filter(theme => theme.id !== themeId);
        return {
          ...system,
          themes: updatedThemes,
          activeThemeId: system.activeThemeId === themeId && updatedThemes.length > 0
            ? updatedThemes[0].id
            : system.activeThemeId
        };
      }
      return system;
    }));

    // Persist to service
    const result = await service.deleteTheme(systemId, themeId);
    if (result.error) {
      console.error('Failed to delete theme:', result.error);
    }
  }, [service]);

  const setActiveTheme = useCallback(async (systemId: string, themeId: string) => {
    const system = allSystems.find(s => s.id === systemId);
    if (!system) return false;

    const theme = system.themes.find(t => t.id === themeId);
    if (!theme) return false;

    // Apply the theme tokens
    applyThemeToDOM(theme);

    // Update active theme tracking
    setActiveThemeIds(prev => ({ ...prev, [systemId]: themeId }));

    // For user systems, also update the system itself
    if (!PREBUILT_IDS.includes(systemId)) {
      await updateSystem(systemId, { activeThemeId: themeId });
    }

    return true;
  }, [allSystems, updateSystem]);

  const getActiveTheme = useCallback((systemId: string): Theme | undefined => {
    const system = allSystems.find(s => s.id === systemId);
    if (!system) return undefined;

    const themeId = activeThemeIds[systemId] || system.activeThemeId;
    return system.themes.find(t => t.id === themeId) || system.themes[0];
  }, [allSystems, activeThemeIds]);

  // Version management
  const addVersion = useCallback((systemId: string, versionType: VersionType, notes: string, author?: string) => {
    const system = allSystems.find(s => s.id === systemId);
    if (!system) return null;

    const { createVersionSnapshot, pruneVersions } = require('../lib/version-utilities');

    const previousVersion = system.versions && system.versions.length > 0
      ? system.versions[system.versions.length - 1]
      : undefined;

    const newVersion = createVersionSnapshot(system, versionType, notes, previousVersion, author);

    setUserSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        const updatedVersions = [...(s.versions || []), newVersion];
        const prunedVersions = pruneVersions(updatedVersions, 50);

        return {
          ...s,
          versions: prunedVersions,
          currentVersionId: newVersion.id
        };
      }
      return s;
    }));

    return newVersion;
  }, [allSystems]);

  const restoreVersion = useCallback((systemId: string, version: DesignSystemVersion) => {
    setUserSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          name: version.snapshot.name,
          description: version.snapshot.description,
          themes: JSON.parse(JSON.stringify(version.snapshot.themes)),
          activeThemeId: version.snapshot.activeThemeId,
          currentVersionId: version.id
        };
      }
      return s;
    }));

    applySystem(systemId);
  }, [applySystem]);

  const exportVersionAsJSON = useCallback((version: DesignSystemVersion) => {
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
  }, []);

  const deleteVersion = useCallback((systemId: string, versionId: string) => {
    setUserSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          versions: (s.versions || []).filter(v => v.id !== versionId)
        };
      }
      return s;
    }));
  }, []);

  // Reload data (useful after migration or auth change)
  const refresh = useCallback(() => {
    loadSystems();
  }, [loadSystems]);

  return {
    systems: allSystems,
    activeSystemId,
    activeThemeIds,
    isLoading,
    error,
    mode, // 'local' or 'supabase'
    isAuthenticated,
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
    deleteVersion,
    // Refresh
    refresh
  };
}
