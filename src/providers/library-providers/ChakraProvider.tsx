/**
 * Chakra UI Theme Provider wrapper
 * Applies Living Design Library tokens to Chakra components
 *
 * Note: Chakra UI v3 uses a different theming approach with createSystem
 * We disable preflight (CSS reset) to avoid overriding the app's existing styles
 */
import { ReactNode, useEffect, useMemo } from 'react';
import { ChakraProvider as ChakraUIProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import type { Theme } from '../../hooks/useDesignSystems';
import { hslStringToHex } from '../../lib/theme-mappers/color-utils';

interface ChakraProviderProps {
  theme: Theme | null;
  children: ReactNode;
}

export default function ChakraProvider({ theme, children }: ChakraProviderProps) {
  // Create a custom system with preflight disabled to prevent CSS reset from breaking layouts
  const system = useMemo(() => {
    return createSystem(defaultConfig, {
      preflight: false, // Disable CSS reset to preserve app's existing styles
    });
  }, []);

  // Inject theme-specific CSS variables for Chakra components
  useEffect(() => {
    if (!theme) return;

    const styleId = 'chakra-theme-overrides';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Map our tokens to Chakra CSS variables
    const primary = hslStringToHex(theme.colors.primary || '221.2 83.2% 53.3%');
    const background = hslStringToHex(theme.colors.background || '0 0% 100%');
    const foreground = hslStringToHex(theme.colors.foreground || '222.2 84% 4.9%');

    styleEl.textContent = `
      :root {
        --chakra-colors-brand-500: ${primary};
        --chakra-colors-brand-600: ${primary};
        --chakra-colors-bg: ${background};
        --chakra-colors-fg: ${foreground};
      }
    `;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [theme]);

  return (
    <ChakraUIProvider value={system}>
      {children}
    </ChakraUIProvider>
  );
}
