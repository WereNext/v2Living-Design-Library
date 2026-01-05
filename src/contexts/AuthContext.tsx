/**
 * Authentication Context
 *
 * Provides authentication state and actions throughout the app.
 * Wraps the useAuth hook to provide context-based access.
 */

import { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { useAuth, AuthContextType } from '../hooks/useAuth';
import { STORAGE_KEYS } from '../lib/constants';

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
  /** Callback when user signs in for the first time (for migration) */
  onFirstSignIn?: (userId: string) => Promise<void>;
}

export function AuthProvider({ children, onFirstSignIn }: AuthProviderProps) {
  const auth = useAuth();
  const hasTriggeredMigration = useRef(false);

  // Handle first sign-in migration
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user || hasTriggeredMigration.current) {
      return;
    }

    // Check if this is a first-time sign-in (migration not done)
    const migrationComplete = localStorage.getItem(STORAGE_KEYS.SUPABASE_MIGRATION_COMPLETE);
    const storedUserId = localStorage.getItem(STORAGE_KEYS.SUPABASE_USER_ID);

    // If different user or never migrated, trigger migration
    if (!migrationComplete || storedUserId !== auth.user.id) {
      hasTriggeredMigration.current = true;

      // Store current user ID
      localStorage.setItem(STORAGE_KEYS.SUPABASE_USER_ID, auth.user.id);

      // Trigger migration callback
      if (onFirstSignIn) {
        onFirstSignIn(auth.user.id).catch(error => {
          console.error('[Auth] Migration failed:', error);
        });
      }
    }
  }, [auth.isAuthenticated, auth.user, onFirstSignIn]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Use authentication context
 * Must be used within an AuthProvider
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// =============================================================================
// Utility Components
// =============================================================================

interface AuthGuardProps {
  children: ReactNode;
  /** Content to show while loading auth state */
  fallback?: ReactNode;
  /** Content to show when not authenticated */
  unauthenticated?: ReactNode;
}

/**
 * Guard component that only renders children when authenticated
 */
export function AuthGuard({ children, fallback, unauthenticated }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <>{fallback ?? null}</>;
  }

  if (!isAuthenticated) {
    return <>{unauthenticated ?? null}</>;
  }

  return <>{children}</>;
}

interface RequireAuthProps {
  children: ReactNode;
  /** Called when user is not authenticated - can be used to show login dialog */
  onUnauthenticated?: () => void;
}

/**
 * Component that requires authentication to render
 * Useful for wrapping authenticated-only UI sections
 */
export function RequireAuth({ children, onUnauthenticated }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && onUnauthenticated) {
      onUnauthenticated();
    }
  }, [isAuthenticated, isLoading, onUnauthenticated]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
