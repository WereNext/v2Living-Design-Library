import { createContext, useContext, ReactNode } from 'react';
import { Theme } from '../hooks/useDesignSystems';

interface ActiveThemeContextType {
  activeTheme: Theme | undefined;
}

const ActiveThemeContext = createContext<ActiveThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({ children, activeTheme }: { children: ReactNode; activeTheme: Theme | undefined }) {
  return (
    <ActiveThemeContext.Provider value={{ activeTheme }}>
      {children}
    </ActiveThemeContext.Provider>
  );
}

export function useActiveTheme() {
  const context = useContext(ActiveThemeContext);
  if (context === undefined) {
    // Return default values if context is not available
    return { activeTheme: undefined };
  }
  return context;
}
