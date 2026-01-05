/**
 * Supabase Intent Service
 *
 * Implements the intent service using Supabase.
 * Default (built-in) intents are always available locally.
 * Custom intents are stored in Supabase.
 */

import {
  IIntentService,
  ServiceResult,
  IntentCreate,
  DesignIntent,
  withErrorHandling,
} from '../types';
import { getSupabaseClient } from '../../lib/supabase';
import type { DesignIntentRow } from '../../types/supabase';
import { LocalIntentService } from '../local/LocalIntentService';

// =============================================================================
// Type Mappers
// =============================================================================

function mapDbToIntent(row: DesignIntentRow): DesignIntent {
  return {
    id: row.intent_key,
    label: row.label,
    description: row.description ?? undefined,
    categories: row.categories || [],
    tokens: row.tokens ?? undefined,
    isCustom: row.is_custom,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// Service Implementation
// =============================================================================

export class SupabaseIntentService implements IIntentService {
  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<DesignIntent[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      // Get custom intents from Supabase
      const { data, error } = await client
        .from('design_intents')
        .select('*')
        .eq('user_id', user.user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const customIntents = (data as DesignIntentRow[]).map(mapDbToIntent);

      // Merge with default intents (always available)
      const defaultIntents = LocalIntentService.getDefaultIntents();
      return [...defaultIntents, ...customIntents];
    });
  }

  async getById(id: string): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      // Check default intents first
      const defaultIntents = LocalIntentService.getDefaultIntents();
      const defaultIntent = defaultIntents.find((i) => i.id === id);
      if (defaultIntent) return defaultIntent;

      // Then check custom intents in Supabase
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('design_intents')
        .select('*')
        .eq('user_id', user.user?.id)
        .eq('intent_key', id)
        .single();

      if (error) throw error;

      return mapDbToIntent(data as DesignIntentRow);
    });
  }

  async getCustomIntents(): Promise<ServiceResult<DesignIntent[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('design_intents')
        .select('*')
        .eq('user_id', user.user?.id)
        .eq('is_custom', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data as DesignIntentRow[]).map(mapDbToIntent);
    });
  }

  async getByDesignSystem(
    systemId: string
  ): Promise<ServiceResult<DesignIntent[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('design_intents')
        .select('*')
        .eq('design_system_id', systemId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const customIntents = (data as DesignIntentRow[]).map(mapDbToIntent);

      // Merge with default intents
      const defaultIntents = LocalIntentService.getDefaultIntents();
      return [...defaultIntents, ...customIntents];
    });
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(data: IntentCreate): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      // Check if ID conflicts with default intents
      const defaultIntents = LocalIntentService.getDefaultIntents();
      if (defaultIntents.some((i) => i.id === data.id)) {
        throw new Error(`Intent ID conflicts with default intent: ${data.id}`);
      }

      const { data: intent, error } = await client
        .from('design_intents')
        .insert({
          user_id: user.user.id,
          design_system_id: data.designSystemId,
          intent_key: data.id,
          label: data.label,
          description: data.description,
          icon: data.icon,
          categories: data.categories,
          tokens: data.tokens as Record<string, unknown> | undefined,
          is_custom: true,
        })
        .select()
        .single();

      if (error) throw error;

      return mapDbToIntent(intent as DesignIntentRow);
    });
  }

  async update(
    id: string,
    data: Partial<IntentCreate>
  ): Promise<ServiceResult<DesignIntent>> {
    return withErrorHandling(async () => {
      // Cannot update default intents
      const defaultIntents = LocalIntentService.getDefaultIntents();
      if (defaultIntents.some((i) => i.id === id)) {
        throw new Error(`Cannot update default intent: ${id}`);
      }

      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      const updateData: Record<string, unknown> = {};
      if (data.label !== undefined) updateData.label = data.label;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.categories !== undefined) updateData.categories = data.categories;
      if (data.tokens !== undefined) updateData.tokens = data.tokens;
      if (data.designSystemId !== undefined)
        updateData.design_system_id = data.designSystemId;

      const { data: intent, error } = await client
        .from('design_intents')
        .update(updateData)
        .eq('user_id', user.user.id)
        .eq('intent_key', id)
        .select()
        .single();

      if (error) throw error;

      return mapDbToIntent(intent as DesignIntentRow);
    });
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      // Cannot delete default intents
      const defaultIntents = LocalIntentService.getDefaultIntents();
      if (defaultIntents.some((i) => i.id === id)) {
        throw new Error(`Cannot delete default intent: ${id}`);
      }

      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      const { error } = await client
        .from('design_intents')
        .delete()
        .eq('user_id', user.user.id)
        .eq('intent_key', id);

      if (error) throw error;

      return true;
    });
  }
}
