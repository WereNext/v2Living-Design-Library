/**
 * Intent Manager Hook
 *
 * Manages design intents with support for both
 * local storage and Supabase backends.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useServices } from '../services';
import type { DesignIntent, IntentCreate, IntentCategory } from '../services/types';

// Re-export types for backward compatibility
export type { DesignIntent, IntentCategory };

// Alias for backward compatibility
export type ComponentCategory = IntentCategory;

// =============================================================================
// Types
// =============================================================================

interface UseIntentManagerReturn {
  /** All intents (default + custom) */
  intents: DesignIntent[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Add a new custom intent */
  addIntent: (
    intent: Omit<DesignIntent, 'isCustom' | 'createdAt' | 'updatedAt'>
  ) => Promise<DesignIntent | null>;
  /** Update an existing intent */
  updateIntent: (id: string, updates: Partial<DesignIntent>) => Promise<void>;
  /** Delete an intent */
  deleteIntent: (id: string) => Promise<void>;
  /** Get an intent by ID */
  getIntent: (id: string) => DesignIntent | undefined;
  /** Refresh intents from service */
  refresh: () => Promise<void>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useIntentManager(): UseIntentManagerReturn {
  const { intents: service, isAuthenticated } = useServices();
  const [intents, setIntents] = useState<DesignIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load intents on mount and when auth changes
  const loadIntents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await service.getAll();

    if (result.error) {
      setError(result.error);
      setIntents([]);
    } else {
      setIntents(result.data || []);
    }

    setIsLoading(false);
  }, [service]);

  useEffect(() => {
    loadIntents();
  }, [loadIntents, isAuthenticated]);

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  const getIntent = useCallback(
    (id: string): DesignIntent | undefined => {
      return intents.find((intent) => intent.id === id);
    },
    [intents]
  );

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  const addIntent = useCallback(
    async (
      intent: Omit<DesignIntent, 'isCustom' | 'createdAt' | 'updatedAt'>
    ): Promise<DesignIntent | null> => {
      const createData: IntentCreate = {
        id: intent.id,
        label: intent.label,
        description: intent.description,
        categories: intent.categories,
        tokens: intent.tokens,
      };

      const result = await service.create(createData);

      if (result.error) {
        console.error('Failed to create intent:', result.error);
        return null;
      }

      if (result.data) {
        setIntents((prev) => [...prev, result.data!]);
        return result.data;
      }

      return null;
    },
    [service]
  );

  const updateIntent = useCallback(
    async (id: string, updates: Partial<DesignIntent>): Promise<void> => {
      const result = await service.update(id, {
        label: updates.label,
        description: updates.description,
        categories: updates.categories,
        tokens: updates.tokens,
      });

      if (result.error) {
        console.error('Failed to update intent:', result.error);
        return;
      }

      if (result.data) {
        setIntents((prev) =>
          prev.map((intent) => (intent.id === id ? result.data! : intent))
        );
      }
    },
    [service]
  );

  const deleteIntent = useCallback(
    async (id: string): Promise<void> => {
      const result = await service.delete(id);

      if (result.error) {
        console.error('Failed to delete intent:', result.error);
        return;
      }

      setIntents((prev) => prev.filter((intent) => intent.id !== id));
    },
    [service]
  );

  // ==========================================================================
  // Return
  // ==========================================================================

  return useMemo(
    () => ({
      intents,
      isLoading,
      error,
      addIntent,
      updateIntent,
      deleteIntent,
      getIntent,
      refresh: loadIntents,
    }),
    [
      intents,
      isLoading,
      error,
      addIntent,
      updateIntent,
      deleteIntent,
      getIntent,
      loadIntents,
    ]
  );
}
