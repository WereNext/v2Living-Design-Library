/**
 * MUI (Material-UI) Theme Provider wrapper
 * Applies Living Design Library tokens to MUI components
 *
 * Note: We intentionally omit CssBaseline to avoid overriding the app's existing styles
 */
import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { Theme } from '../../hooks/useDesignSystems';
import { mapTokensToMUI } from '../../lib/theme-mappers/mui-mapper';

interface MUIProviderProps {
  theme: Theme | null;
  children: ReactNode;
}

export default function MUIProvider({ theme, children }: MUIProviderProps) {
  const muiTheme = useMemo(() => {
    if (!theme) {
      return createTheme();
    }
    return createTheme(mapTokensToMUI(theme));
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      {/* CssBaseline intentionally omitted to preserve app's existing styles */}
      {children}
    </ThemeProvider>
  );
}
