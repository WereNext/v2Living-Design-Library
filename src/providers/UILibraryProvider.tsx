/**
 * Dynamic UI Library Provider
 * Wraps the application with the appropriate UI library provider based on the active design system
 */
import { ReactNode, Suspense, lazy, useMemo } from 'react';
import { UILibrary, UI_LIBRARIES } from '../lib/constants';
import { UILibraryContext } from '../hooks/useUILibrary';
import type { Theme } from '../hooks/useDesignSystems';

// Lazy load library-specific providers to reduce initial bundle size
const MUIProvider = lazy(() => import('./library-providers/MUIProvider'));
const ChakraProvider = lazy(() => import('./library-providers/ChakraProvider'));
const AntDesignProvider = lazy(() => import('./library-providers/AntDesignProvider'));
const BootstrapProvider = lazy(() => import('./library-providers/BootstrapProvider'));

interface UILibraryProviderProps {
  library: UILibrary;
  theme: Theme | null;
  children: ReactNode;
}

/**
 * Loading fallback component - renders children without library-specific theming
 */
function LoadingFallback({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Main provider component that switches between UI library providers
 */
export function UILibraryProvider({ library, theme, children }: UILibraryProviderProps) {
  const contextValue = useMemo(() => ({
    library,
    isLoading: false,
  }), [library]);

  // Wrap children with the appropriate library provider
  const wrappedChildren = useMemo(() => {
    switch (library) {
      case UI_LIBRARIES.MUI:
        return (
          <Suspense fallback={<LoadingFallback>{children}</LoadingFallback>}>
            <MUIProvider theme={theme}>{children}</MUIProvider>
          </Suspense>
        );

      case UI_LIBRARIES.CHAKRA:
        return (
          <Suspense fallback={<LoadingFallback>{children}</LoadingFallback>}>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </Suspense>
        );

      case UI_LIBRARIES.ANTD:
        return (
          <Suspense fallback={<LoadingFallback>{children}</LoadingFallback>}>
            <AntDesignProvider theme={theme}>{children}</AntDesignProvider>
          </Suspense>
        );

      case UI_LIBRARIES.BOOTSTRAP:
        return (
          <Suspense fallback={<LoadingFallback>{children}</LoadingFallback>}>
            <BootstrapProvider theme={theme}>{children}</BootstrapProvider>
          </Suspense>
        );

      case UI_LIBRARIES.CUSTOM:
        // Custom library uses user-imported components with CSS variables
        // Falls through to shadcn behavior (CSS variables applied by theme engine)
        // Imported components are rendered via DynamicComponent from ComponentRegistry
        return children;

      case UI_LIBRARIES.SHADCN:
      default:
        // shadcn uses CSS variables directly, applied by the existing theme engine
        // No additional provider needed
        return children;
    }
  }, [library, theme, children]);

  return (
    <UILibraryContext.Provider value={contextValue}>
      {wrappedChildren}
    </UILibraryContext.Provider>
  );
}

export default UILibraryProvider;
