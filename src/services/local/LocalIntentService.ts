/**
 * Local Storage Intent Service
 *
 * Implements the intent service using localStorage.
 * Default (built-in) intents are always available and not stored.
 * Only custom intents are persisted to localStorage.
 */

import {
  IIntentService,
  ServiceResult,
  IntentCreate,
  DesignIntent,
  withErrorHandling,
} from '../types';
import { STORAGE_KEYS } from '../../lib/constants';
import { getAllIntents, getCategoriesForIntent } from '../../lib/component-registry';

// =============================================================================
// Default Intents (dynamically generated from the component registry)
// =============================================================================

/**
 * Get default intents with their categories dynamically from the registry.
 * This ensures a single source of truth for intent-category mappings.
 */
function getDefaultIntents(): DesignIntent[] {
  return getAllIntents().map(intent => ({
    id: intent.id,
    label: intent.label,
    description: intent.description,
    categories: getCategoriesForIntent(intent.id),
    isCustom: false,
  }));
}

// =============================================================================
// Service Implementation
// =============================================================================

export class LocalIntentService implements IIntentService {
  private readonly storageKey = STORAGE_KEYS.DESIGN_INTENTS;

  /**
   * Get custom intents from localStorage
   */
  private getCustomIntentsFromStorage(): DesignIntent[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all stored intents are marked as custom
        return parsed.map((intent: DesignIntent) => ({
          ...intent,
          isCustom: true,
        }));
      }
    } catch (error) {
      console.error('Error loading intents:', error);
    }
    return [];
  }

  /**
   * Save custom intents to localStorage
   */
  private saveCustomIntentsToStorage(intents: DesignIntent[]): void {
    try {
      // Only save custom intents
      const customIntents = intents.filter((i) => i.isCustom);
      localStorage.setItem(this.storageKey, JSON.stringify(customIntents));
    } catch (error) {
      console.error('Error saving intents:', error);
    }
  }

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<DesignIntent[]>> {
    return withErrorHandling(async () => {
      const customIntents = this.getCustomIntentsFromStorage();
      // Merge default intents with custom intents
      return [...getDefaultIntents(), ...customIntents];
    }, true);
  }

  async getById(id: string): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      // Check default intents first
      const defaultIntent = getDefaultIntents().find((i) => i.id === id);
      if (defaultIntent) return defaultIntent;

      // Then check custom intents
      const customIntents = this.getCustomIntentsFromStorage();
      const customIntent = customIntents.find((i) => i.id === id);
      if (customIntent) return customIntent;

      throw new Error(`Intent not found: ${id}`);
    }, true);
  }

  async getCustomIntents(): Promise<ServiceResult<DesignIntent[]>> {
    return withErrorHandling(async () => {
      return this.getCustomIntentsFromStorage();
    }, true);
  }

  async getByDesignSystem(
    _systemId: string
  ): Promise<ServiceResult<DesignIntent[]>> {
    // Local storage doesn't support design system filtering
    // Return all intents (default + custom)
    return this.getAll();
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(data: IntentCreate): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      const customIntents = this.getCustomIntentsFromStorage();

      // Check if ID already exists
      if (
        getDefaultIntents().some((i) => i.id === data.id) ||
        customIntents.some((i) => i.id === data.id)
      ) {
        throw new Error(`Intent with ID already exists: ${data.id}`);
      }

      const now = new Date().toISOString();
      const newIntent: DesignIntent = {
        id: data.id,
        label: data.label,
        description: data.description,
        categories: data.categories,
        tokens: data.tokens,
        isCustom: true,
        createdAt: now,
        updatedAt: now,
      };

      customIntents.push(newIntent);
      this.saveCustomIntentsToStorage(customIntents);

      return newIntent;
    }, true);
  }

  async update(
    id: string,
    data: Partial<IntentCreate>
  ): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      // Cannot update default intents
      if (getDefaultIntents().some((i) => i.id === id)) {
        throw new Error(`Cannot update default intent: ${id}`);
      }

      const customIntents = this.getCustomIntentsFromStorage();
      const index = customIntents.findIndex((i) => i.id === id);

      if (index === -1) {
        throw new Error(`Intent not found: ${id}`);
      }

      const updated: DesignIntent = {
        ...customIntents[index],
        ...data,
        id: customIntents[index].id, // Preserve ID
        isCustom: true, // Always custom
        updatedAt: new Date().toISOString(),
      };

      customIntents[index] = updated;
      this.saveCustomIntentsToStorage(customIntents);

      return updated;
    }, true);
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      // Cannot delete default intents
      if (getDefaultIntents().some((i) => i.id === id)) {
        throw new Error(`Cannot delete default intent: ${id}`);
      }

      const customIntents = this.getCustomIntentsFromStorage();
      const filtered = customIntents.filter((i) => i.id !== id);

      if (filtered.length === customIntents.length) {
        throw new Error(`Intent not found: ${id}`);
      }

      this.saveCustomIntentsToStorage(filtered);
      return true;
    }, true);
  }

  // ==========================================================================
  // Static Helpers
  // ==========================================================================

  /**
   * Get the default intents (useful for resetting or comparison)
   */
  static getDefaultIntents(): DesignIntent[] {
    return [...getDefaultIntents()];
  }
}
