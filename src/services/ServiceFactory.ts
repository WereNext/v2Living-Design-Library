/**
 * Service Factory
 *
 * Factory for creating storage services based on authentication state.
 * Returns local services when not authenticated, Supabase services when authenticated.
 */

import {
  IDesignSystemsService,
  ILDLDocumentsService,
  IDocumentationService,
  IIntentService,
} from './types';
import {
  LocalDesignSystemsService,
  LocalLDLService,
  LocalDocumentationService,
  LocalIntentService,
} from './local';
import {
  SupabaseDesignSystemsService,
  SupabaseLDLService,
  SupabaseDocumentationService,
  SupabaseIntentService,
} from './supabase';
import { isSupabaseConfigured } from '../lib/supabase';

// =============================================================================
// Types
// =============================================================================

export type StorageMode = 'local' | 'supabase';

// =============================================================================
// Factory State
// =============================================================================

class ServiceFactoryState {
  private _isAuthenticated = false;
  private _mode: StorageMode = 'local';

  // Cached service instances
  private _localDesignSystems?: LocalDesignSystemsService;
  private _localLDL?: LocalLDLService;
  private _localDocumentation?: LocalDocumentationService;
  private _localIntent?: LocalIntentService;
  private _supabaseDesignSystems?: SupabaseDesignSystemsService;
  private _supabaseLDL?: SupabaseLDLService;
  private _supabaseDocumentation?: SupabaseDocumentationService;
  private _supabaseIntent?: SupabaseIntentService;

  /**
   * Set whether the user is authenticated
   */
  setAuthenticated(authenticated: boolean): void {
    this._isAuthenticated = authenticated;
    // Auto-set mode based on auth state
    if (authenticated && isSupabaseConfigured()) {
      this._mode = 'supabase';
    } else {
      this._mode = 'local';
    }
  }

  /**
   * Get the current authentication state
   */
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  /**
   * Get the current storage mode
   */
  get mode(): StorageMode {
    return this._mode;
  }

  /**
   * Override the storage mode (use with caution)
   */
  setMode(mode: StorageMode): void {
    if (mode === 'supabase' && !isSupabaseConfigured()) {
      console.warn('[ServiceFactory] Cannot use Supabase mode - not configured');
      return;
    }
    this._mode = mode;
  }

  /**
   * Get the Design Systems service for the current mode
   */
  getDesignSystemsService(): IDesignSystemsService {
    if (this._mode === 'supabase' && this._isAuthenticated) {
      if (!this._supabaseDesignSystems) {
        this._supabaseDesignSystems = new SupabaseDesignSystemsService();
      }
      return this._supabaseDesignSystems;
    }

    if (!this._localDesignSystems) {
      this._localDesignSystems = new LocalDesignSystemsService();
    }
    return this._localDesignSystems;
  }

  /**
   * Get the LDL Documents service for the current mode
   */
  getLDLService(): ILDLDocumentsService {
    if (this._mode === 'supabase' && this._isAuthenticated) {
      if (!this._supabaseLDL) {
        this._supabaseLDL = new SupabaseLDLService();
      }
      return this._supabaseLDL;
    }

    if (!this._localLDL) {
      this._localLDL = new LocalLDLService();
    }
    return this._localLDL;
  }

  /**
   * Get the Documentation service for the current mode
   */
  getDocumentationService(): IDocumentationService {
    if (this._mode === 'supabase' && this._isAuthenticated) {
      if (!this._supabaseDocumentation) {
        this._supabaseDocumentation = new SupabaseDocumentationService();
      }
      return this._supabaseDocumentation;
    }

    if (!this._localDocumentation) {
      this._localDocumentation = new LocalDocumentationService();
    }
    return this._localDocumentation;
  }

  /**
   * Get the Intent service for the current mode
   */
  getIntentService(): IIntentService {
    if (this._mode === 'supabase' && this._isAuthenticated) {
      if (!this._supabaseIntent) {
        this._supabaseIntent = new SupabaseIntentService();
      }
      return this._supabaseIntent;
    }

    if (!this._localIntent) {
      this._localIntent = new LocalIntentService();
    }
    return this._localIntent;
  }

  /**
   * Get the local Design Systems service (always local, for prebuilt systems)
   */
  getLocalDesignSystemsService(): LocalDesignSystemsService {
    if (!this._localDesignSystems) {
      this._localDesignSystems = new LocalDesignSystemsService();
    }
    return this._localDesignSystems;
  }

  /**
   * Get the local LDL service (always local)
   */
  getLocalLDLService(): LocalLDLService {
    if (!this._localLDL) {
      this._localLDL = new LocalLDLService();
    }
    return this._localLDL;
  }

  /**
   * Get the local Documentation service (always local)
   */
  getLocalDocumentationService(): LocalDocumentationService {
    if (!this._localDocumentation) {
      this._localDocumentation = new LocalDocumentationService();
    }
    return this._localDocumentation;
  }

  /**
   * Get the local Intent service (always local)
   */
  getLocalIntentService(): LocalIntentService {
    if (!this._localIntent) {
      this._localIntent = new LocalIntentService();
    }
    return this._localIntent;
  }

  /**
   * Reset all cached services (useful for testing)
   */
  reset(): void {
    this._isAuthenticated = false;
    this._mode = 'local';
    this._localDesignSystems = undefined;
    this._localLDL = undefined;
    this._localDocumentation = undefined;
    this._localIntent = undefined;
    this._supabaseDesignSystems = undefined;
    this._supabaseLDL = undefined;
    this._supabaseDocumentation = undefined;
    this._supabaseIntent = undefined;
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

/**
 * Global service factory instance
 */
export const serviceFactory = new ServiceFactoryState();

// =============================================================================
// React Hook for Service Access
// =============================================================================

import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Hook to get services based on current auth state
 * Automatically switches between local and Supabase services
 */
export function useServices() {
  const { isAuthenticated } = useAuth();

  // Update factory state when auth changes
  useMemo(() => {
    serviceFactory.setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  return useMemo(
    () => ({
      designSystems: serviceFactory.getDesignSystemsService(),
      ldl: serviceFactory.getLDLService(),
      documentation: serviceFactory.getDocumentationService(),
      intents: serviceFactory.getIntentService(),
      mode: serviceFactory.mode,
      isAuthenticated,
    }),
    [isAuthenticated]
  );
}

/**
 * Hook to get local services only (for prebuilt systems that never sync)
 */
export function useLocalServices() {
  return useMemo(
    () => ({
      designSystems: serviceFactory.getLocalDesignSystemsService(),
      ldl: serviceFactory.getLocalLDLService(),
      documentation: serviceFactory.getLocalDocumentationService(),
      intents: serviceFactory.getLocalIntentService(),
    }),
    []
  );
}
