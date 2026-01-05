/**
 * Supabase Design Systems Service
 *
 * Implements the design systems service using Supabase.
 */

import {
  IDesignSystemsService,
  ServiceResult,
  DesignSystemCreate,
  DesignSystemUpdate,
  ThemeCreate,
  success,
  failure,
  withErrorHandling,
} from '../types';
import { DesignSystem, Theme } from '../../hooks/useDesignSystems';
import { supabase, getSupabaseClient } from '../../lib/supabase';
import type {
  DesignSystemWithRelations,
  ThemeRow,
  DesignIntentRow,
  DesignSystemVersionRow,
} from '../../types/supabase';

// =============================================================================
// Type Mappers
// =============================================================================

function mapThemeRowToTheme(row: ThemeRow): Theme {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    colors: row.colors || {},
    spacing: row.spacing || {},
    typography: row.typography || {},
    borderRadius: row.border_radius || {},
    shadows: row.shadows || {},
    sidebar: row.sidebar ?? undefined,
    opacity: row.opacity ?? undefined,
    effects: row.effects ?? undefined,
    colorTheme: row.color_theme as Theme['colorTheme'],
    fontFamily: row.font_family as Theme['fontFamily'],
    visualFeel: row.visual_feel as Theme['visualFeel'],
    componentStyles: row.component_styles as Theme['componentStyles'],
  };
}

function mapDbToDesignSystem(row: DesignSystemWithRelations): DesignSystem {
  const themes = (row.themes || []).map(mapThemeRowToTheme);
  const activeTheme = themes.find((t) =>
    row.themes?.find((r) => r.id === t.id)?.is_active
  );

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    createdAt: row.created_at,
    useIcons: row.use_icons,
    themes,
    activeThemeId: activeTheme?.id ?? themes[0]?.id,
    intents: (row.design_intents || []).map((intent: DesignIntentRow) => ({
      id: intent.intent_key,
      value: intent.intent_key,
      label: intent.label,
      description: intent.description ?? undefined,
      icon: intent.icon ?? undefined,
      categories: intent.categories,
    })),
    versions: (row.design_system_versions || []).map((v: DesignSystemVersionRow) => ({
      id: v.id,
      version: v.version,
      timestamp: v.created_at,
      notes: v.notes ?? '',
      author: v.author ?? undefined,
      changes: v.changes,
      snapshot: v.snapshot,
    })),
    currentVersionId: row.current_version_id ?? undefined,
  };
}

// =============================================================================
// Service Implementation
// =============================================================================

export class SupabaseDesignSystemsService implements IDesignSystemsService {
  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<DesignSystem[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('design_systems')
        .select(`
          *,
          themes (*),
          design_intents (*),
          design_system_versions (*)
        `)
        .eq('user_id', user.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as DesignSystemWithRelations[]).map(mapDbToDesignSystem);
    });
  }

  async getById(id: string): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('design_systems')
        .select(`
          *,
          themes (*),
          design_intents (*),
          design_system_versions (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return mapDbToDesignSystem(data as DesignSystemWithRelations);
    });
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(data: DesignSystemCreate): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      // Create the design system
      const { data: system, error: systemError } = await client
        .from('design_systems')
        .insert({
          user_id: user.user.id,
          name: data.name,
          description: data.description,
          use_icons: data.useIcons ?? true,
        })
        .select()
        .single();

      if (systemError) throw systemError;

      // Create themes
      if (data.themes?.length) {
        const themesToInsert = data.themes.map((theme, index) => ({
          design_system_id: system.id,
          name: theme.name,
          description: theme.description,
          is_active: index === 0,
          colors: theme.colors || {},
          spacing: theme.spacing || {},
          typography: theme.typography || {},
          border_radius: theme.borderRadius || {},
          shadows: theme.shadows || {},
          sidebar: theme.sidebar,
          opacity: theme.opacity,
          effects: theme.effects,
          color_theme: theme.colorTheme,
          font_family: theme.fontFamily,
          visual_feel: theme.visualFeel,
          component_styles: theme.componentStyles,
          display_order: index,
        }));

        const { error: themesError } = await client
          .from('themes')
          .insert(themesToInsert);

        if (themesError) throw themesError;
      }

      // Create intents
      if (data.intents?.length) {
        const intentsToInsert = data.intents.map((intent) => ({
          design_system_id: system.id,
          user_id: user.user!.id,
          intent_key: intent.id,
          label: intent.label,
          description: intent.description,
          icon: intent.icon,
          categories: intent.categories || [],
          is_custom: true,
        }));

        const { error: intentsError } = await client
          .from('design_intents')
          .insert(intentsToInsert);

        if (intentsError) throw intentsError;
      }

      // Fetch the complete system
      return (await this.getById(system.id)).data!;
    });
  }

  async update(
    id: string,
    data: DesignSystemUpdate
  ): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.useIcons !== undefined) updateData.use_icons = data.useIcons;
      if (data.isPublic !== undefined) updateData.is_public = data.isPublic;
      if (data.shareSlug !== undefined) updateData.share_slug = data.shareSlug;
      if (data.currentVersionId !== undefined)
        updateData.current_version_id = data.currentVersionId;

      const { error } = await client
        .from('design_systems')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      return (await this.getById(id)).data!;
    });
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { error } = await client
        .from('design_systems')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    });
  }

  // ==========================================================================
  // Theme Operations
  // ==========================================================================

  async addTheme(
    systemId: string,
    theme: ThemeCreate
  ): Promise<ServiceResult<Theme>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      // Get current theme count for ordering
      const { data: existingThemes } = await client
        .from('themes')
        .select('id')
        .eq('design_system_id', systemId);

      const { data, error } = await client
        .from('themes')
        .insert({
          design_system_id: systemId,
          name: theme.name,
          description: theme.description,
          colors: theme.colors || {},
          spacing: theme.spacing || {},
          typography: theme.typography || {},
          border_radius: theme.borderRadius || {},
          shadows: theme.shadows || {},
          sidebar: theme.sidebar,
          opacity: theme.opacity,
          effects: theme.effects,
          color_theme: theme.colorTheme,
          font_family: theme.fontFamily,
          visual_feel: theme.visualFeel,
          component_styles: theme.componentStyles,
          display_order: existingThemes?.length || 0,
        })
        .select()
        .single();

      if (error) throw error;

      return mapThemeRowToTheme(data as ThemeRow);
    });
  }

  async updateTheme(
    systemId: string,
    themeId: string,
    updates: Partial<Theme>
  ): Promise<ServiceResult<Theme>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.colors !== undefined) updateData.colors = updates.colors;
      if (updates.spacing !== undefined) updateData.spacing = updates.spacing;
      if (updates.typography !== undefined)
        updateData.typography = updates.typography;
      if (updates.borderRadius !== undefined)
        updateData.border_radius = updates.borderRadius;
      if (updates.shadows !== undefined) updateData.shadows = updates.shadows;
      if (updates.sidebar !== undefined) updateData.sidebar = updates.sidebar;
      if (updates.opacity !== undefined) updateData.opacity = updates.opacity;
      if (updates.effects !== undefined) updateData.effects = updates.effects;
      if (updates.colorTheme !== undefined)
        updateData.color_theme = updates.colorTheme;
      if (updates.fontFamily !== undefined)
        updateData.font_family = updates.fontFamily;
      if (updates.visualFeel !== undefined)
        updateData.visual_feel = updates.visualFeel;
      if (updates.componentStyles !== undefined)
        updateData.component_styles = updates.componentStyles;

      const { data, error } = await client
        .from('themes')
        .update(updateData)
        .eq('id', themeId)
        .eq('design_system_id', systemId)
        .select()
        .single();

      if (error) throw error;

      return mapThemeRowToTheme(data as ThemeRow);
    });
  }

  async deleteTheme(
    systemId: string,
    themeId: string
  ): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { error } = await client
        .from('themes')
        .delete()
        .eq('id', themeId)
        .eq('design_system_id', systemId);

      if (error) throw error;

      return true;
    });
  }

  async setActiveTheme(
    systemId: string,
    themeId: string
  ): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      // Deactivate all themes
      await client
        .from('themes')
        .update({ is_active: false })
        .eq('design_system_id', systemId);

      // Activate the selected theme
      const { error } = await client
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId)
        .eq('design_system_id', systemId);

      if (error) throw error;

      return true;
    });
  }

  // ==========================================================================
  // Sharing Operations
  // ==========================================================================

  async publish(
    id: string,
    slug: string
  ): Promise<ServiceResult<DesignSystem>> {
    return this.update(id, { isPublic: true, shareSlug: slug });
  }

  async unpublish(id: string): Promise<ServiceResult<DesignSystem>> {
    return this.update(id, { isPublic: false, shareSlug: undefined });
  }

  async getBySlug(slug: string): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('design_systems')
        .select(`
          *,
          themes (*),
          design_intents (*),
          design_system_versions (*)
        `)
        .eq('share_slug', slug)
        .eq('is_public', true)
        .single();

      if (error) throw error;

      return mapDbToDesignSystem(data as DesignSystemWithRelations);
    });
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    if (!supabase) return true;

    const { data } = await supabase
      .from('design_systems')
      .select('id')
      .eq('share_slug', slug)
      .maybeSingle();

    return data === null;
  }
}
