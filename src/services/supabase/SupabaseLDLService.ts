/**
 * Supabase LDL Documents Service
 *
 * Implements the LDL documents service using Supabase.
 */

import {
  ILDLDocumentsService,
  ServiceResult,
  LDLDocumentCreate,
  LDLDocumentWithMeta,
  withErrorHandling,
} from '../types';
import { supabase, getSupabaseClient } from '../../lib/supabase';
import type { LDLDocumentRow } from '../../types/supabase';

// =============================================================================
// Type Mappers
// =============================================================================

function mapDbToLDLDocument(row: LDLDocumentRow): LDLDocumentWithMeta {
  return {
    // LDL Token Document fields
    $schema: 'https://ldl.dev/schema/v1',
    $name: row.name,
    $description: row.description ?? undefined,
    $version: row.version ?? undefined,
    color: row.color ?? undefined,
    space: row.space ?? undefined,
    radius: row.radius ?? undefined,
    shadow: row.shadow ?? undefined,
    font: row.font ?? undefined,
    duration: row.duration ?? undefined,
    ease: row.ease ?? undefined,
    component: row.component ?? undefined,
    mode: row.mode ?? undefined,
    // Metadata
    id: row.id,
    userId: row.user_id ?? undefined,
    designSystemId: row.design_system_id ?? undefined,
    isPublic: row.is_public,
    shareSlug: row.share_slug ?? undefined,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// Service Implementation
// =============================================================================

export class SupabaseLDLService implements ILDLDocumentsService {
  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('ldl_documents')
        .select('*')
        .eq('user_id', user.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as LDLDocumentRow[]).map(mapDbToLDLDocument);
    });
  }

  async getById(id: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(data as LDLDocumentRow);
    });
  }

  async getByDesignSystem(
    systemId: string
  ): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .select('*')
        .eq('design_system_id', systemId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as LDLDocumentRow[]).map(mapDbToLDLDocument);
    });
  }

  async getPublic(): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .select('*')
        .eq('is_public', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      return (data as LDLDocumentRow[]).map(mapDbToLDLDocument);
    });
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(
    data: LDLDocumentCreate
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      const { data: doc, error } = await client
        .from('ldl_documents')
        .insert({
          user_id: user.user.id,
          design_system_id: data.designSystemId,
          name: data.name,
          description: data.description,
          version: data.version,
          color: data.color,
          space: data.space,
          radius: data.radius,
          shadow: data.shadow,
          font: data.font,
          duration: data.duration,
          ease: data.ease,
          component: data.component,
          mode: data.mode,
        })
        .select()
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(doc as LDLDocumentRow);
    });
  }

  async update(
    id: string,
    data: Partial<LDLDocumentCreate>
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.designSystemId !== undefined)
        updateData.design_system_id = data.designSystemId;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.space !== undefined) updateData.space = data.space;
      if (data.radius !== undefined) updateData.radius = data.radius;
      if (data.shadow !== undefined) updateData.shadow = data.shadow;
      if (data.font !== undefined) updateData.font = data.font;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.ease !== undefined) updateData.ease = data.ease;
      if (data.component !== undefined) updateData.component = data.component;
      if (data.mode !== undefined) updateData.mode = data.mode;

      const { data: doc, error } = await client
        .from('ldl_documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(doc as LDLDocumentRow);
    });
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { error } = await client.from('ldl_documents').delete().eq('id', id);

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
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .update({
          is_public: true,
          share_slug: slug,
          published_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(data as LDLDocumentRow);
    });
  }

  async unpublish(id: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .update({
          is_public: false,
          share_slug: null,
          published_at: null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(data as LDLDocumentRow);
    });
  }

  async getBySlug(slug: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('ldl_documents')
        .select('*')
        .eq('share_slug', slug)
        .eq('is_public', true)
        .single();

      if (error) throw error;

      return mapDbToLDLDocument(data as LDLDocumentRow);
    });
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    if (!supabase) return true;

    const { data } = await supabase
      .from('ldl_documents')
      .select('id')
      .eq('share_slug', slug)
      .maybeSingle();

    return data === null;
  }
}
