/**
 * Authentication Hook
 *
 * Provides authentication state and actions for the application.
 * Supports OAuth (Google, GitHub) and handles session management.
 */

import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// =============================================================================
// Types
// =============================================================================

export interface AuthState {
  /** Current authenticated user, or null if not signed in */
  user: User | null;
  /** Current session, or null if not signed in */
  session: Session | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Whether Supabase is configured and available */
  isSupabaseAvailable: boolean;
}

export interface AuthActions {
  /** Sign in with OAuth provider (Google or GitHub) */
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Get the current user's profile */
  getProfile: () => Promise<UserProfile | null>;
  /** Update the current user's profile */
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export type AuthContextType = AuthState & AuthActions;

// =============================================================================
// Hook Implementation
// =============================================================================

export function useAuth(): AuthContextType {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    isSupabaseAvailable: isSupabaseConfigured(),
  });

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session?.user,
        isLoading: false,
        isSupabaseAvailable: true,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isAuthenticated: !!session?.user,
        }));

        // Log auth events for debugging
        if (event === 'SIGNED_IN') {
          console.info('[Auth] User signed in:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.info('[Auth] User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.info('[Auth] Token refreshed');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with OAuth
  const signInWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          // Request additional scopes if needed
          ...(provider === 'google' && {
            access_type: 'offline',
            prompt: 'consent',
          }),
        },
      },
    });

    return { error };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Auth] Sign out error:', error);
    }
  }, []);

  // Get user profile
  const getProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!supabase || !state.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, avatar_url')
      .eq('id', state.user.id)
      .single();

    if (error) {
      console.error('[Auth] Error fetching profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
    };
  }, [state.user]);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!supabase || !state.user) {
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
      })
      .eq('id', state.user.id);

    return { error: error ? new Error(error.message) : null };
  }, [state.user]);

  return {
    ...state,
    signInWithOAuth,
    signOut,
    getProfile,
    updateProfile,
  };
}

// =============================================================================
// Helper Hooks
// =============================================================================

/**
 * Hook to check if user is authenticated
 * Returns true only when auth is loaded and user is signed in
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated, isLoading } = useAuth();
  return !isLoading && isAuthenticated;
}

/**
 * Hook to get current user
 * Returns null if not authenticated or still loading
 */
export function useUser(): User | null {
  const { user, isLoading } = useAuth();
  return isLoading ? null : user;
}
