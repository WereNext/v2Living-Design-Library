import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ColorScheme } from '../types/design-system';

type DarkModePreference = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  /** Current preference setting */
  preference: DarkModePreference;
  /** Resolved actual mode (light or dark) */
  resolvedMode: 'light' | 'dark';
  /** Whether dark mode is currently active */
  isDark: boolean;
  /** Set the preference */
  setPreference: (pref: DarkModePreference) => void;
  /** Toggle between light and dark (ignores system) */
  toggle: () => void;
  /** Apply a theme's color scheme */
  applyThemeColorScheme: (colorScheme?: ColorScheme) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

const STORAGE_KEY = 'ldl-dark-mode-preference';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getStoredPreference(): DarkModePreference {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  }
  return 'system';
}

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<DarkModePreference>(getStoredPreference);
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(getSystemPreference);
  const [themeOverride, setThemeOverride] = useState<ColorScheme | null>(null);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate resolved mode
  const resolvedMode = useCallback((): 'light' | 'dark' => {
    // Theme override takes precedence
    if (themeOverride === 'dark') return 'dark';
    if (themeOverride === 'light') return 'light';
    // Then user preference
    if (preference === 'light') return 'light';
    if (preference === 'dark') return 'dark';
    // System preference
    return systemMode;
  }, [preference, systemMode, themeOverride]);

  const isDark = resolvedMode() === 'dark';

  // Apply dark class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Persist preference
  const setPreference = useCallback((pref: DarkModePreference) => {
    setPreferenceState(pref);
    localStorage.setItem(STORAGE_KEY, pref);
    // Clear theme override when user explicitly sets preference
    setThemeOverride(null);
  }, []);

  const toggle = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setPreference(newMode);
  }, [isDark, setPreference]);

  // Allow theme to override dark mode
  const applyThemeColorScheme = useCallback((colorScheme?: ColorScheme) => {
    if (colorScheme && colorScheme !== 'auto') {
      setThemeOverride(colorScheme);
    } else {
      setThemeOverride(null);
    }
  }, []);

  return (
    <DarkModeContext.Provider
      value={{
        preference,
        resolvedMode: resolvedMode(),
        isDark,
        setPreference,
        toggle,
        applyThemeColorScheme,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}

export { DarkModeContext };
