/**
 * Bootstrap Theme Provider wrapper
 * Applies Living Design Library tokens to Bootstrap components via CSS variables
 *
 * Note: Bootstrap CSS is imported but we add overrides to prevent it from
 * breaking the app's existing Tailwind styles
 */
import { ReactNode, useEffect, useMemo } from 'react';
import type { Theme } from '../../hooks/useDesignSystems';
import { mapTokensToBootstrap, generateBootstrapCSS } from '../../lib/theme-mappers/bootstrap-mapper';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

interface BootstrapProviderProps {
  theme: Theme | null;
  children: ReactNode;
}

export default function BootstrapProvider({ theme, children }: BootstrapProviderProps) {
  const themeVars = useMemo(() => {
    if (!theme) {
      return null;
    }
    return mapTokensToBootstrap(theme);
  }, [theme]);

  // Inject CSS variables and override conflicting Bootstrap styles
  useEffect(() => {
    const styleId = 'bootstrap-theme-variables';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Generate theme-specific CSS plus overrides to prevent Bootstrap from breaking layouts
    const overrides = `
      /* Prevent Bootstrap from overriding core layout styles */
      body {
        margin: unset;
        font-family: unset;
        font-size: unset;
        font-weight: unset;
        line-height: unset;
        color: unset;
        background-color: unset;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
    `;

    styleElement.textContent = (themeVars ? generateBootstrapCSS(themeVars) : '') + overrides;

    // Set data-bs-theme attribute for Bootstrap's color mode
    if (themeVars) {
      document.documentElement.setAttribute('data-bs-theme', themeVars.colorMode);
    }

    return () => {
      // Cleanup on unmount
      const el = document.getElementById(styleId);
      if (el) {
        el.remove();
      }
      document.documentElement.removeAttribute('data-bs-theme');
    };
  }, [themeVars]);

  return <>{children}</>;
}
