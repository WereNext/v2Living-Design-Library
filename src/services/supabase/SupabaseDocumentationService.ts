/**
 * Supabase Documentation Service
 *
 * Implements the documentation service using Supabase.
 */

import {
  IDocumentationService,
  ServiceResult,
  DocumentationCreate,
  withErrorHandling,
} from '../types';
import { ComponentDocumentation } from '../../types/documentation';
import { getSupabaseClient } from '../../lib/supabase';
import type { ComponentDocumentationRow } from '../../types/supabase';

// =============================================================================
// Type Mappers
// =============================================================================

function mapDbToDocumentation(row: ComponentDocumentationRow): ComponentDocumentation {
  return {
    id: row.id,
    componentId: row.component_id,
    componentName: row.component_name,
    overview: row.overview ?? undefined,
    whenToUse: row.when_to_use ?? undefined,
    bestPractices: row.best_practices || [],
    accessibility: row.accessibility ?? undefined,
    designNotes: row.design_notes ?? undefined,
    codeExamples: row.code_examples || [],
    customSections: row.custom_sections || [],
    author: row.author ?? undefined,
    tags: row.tags || [],
    lastUpdated: row.updated_at,
  };
}

// =============================================================================
// Service Implementation
// =============================================================================

export class SupabaseDocumentationService implements IDocumentationService {
  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<ComponentDocumentation[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('component_documentation')
        .select('*')
        .eq('user_id', user.user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data as ComponentDocumentationRow[]).map(mapDbToDocumentation);
    });
  }

  async getById(id: string): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('component_documentation')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return mapDbToDocumentation(data as ComponentDocumentationRow);
    });
  }

  async getByComponentId(
    componentId: string
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      const { data, error } = await client
        .from('component_documentation')
        .select('*')
        .eq('user_id', user.user?.id)
        .eq('component_id', componentId)
        .single();

      if (error) throw error;

      return mapDbToDocumentation(data as ComponentDocumentationRow);
    });
  }

  async getByDesignSystem(
    systemId: string
  ): Promise<ServiceResult<ComponentDocumentation[]>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from('component_documentation')
        .select('*')
        .eq('design_system_id', systemId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data as ComponentDocumentationRow[]).map(mapDbToDocumentation);
    });
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(
    data: DocumentationCreate
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      const { data: doc, error } = await client
        .from('component_documentation')
        .insert({
          user_id: user.user.id,
          design_system_id: data.designSystemId,
          component_id: data.componentId,
          component_name: data.componentName,
          overview: data.overview,
          when_to_use: data.whenToUse,
          best_practices: data.bestPractices || [],
          accessibility: data.accessibility,
          design_notes: data.designNotes,
          code_examples: data.codeExamples || [],
          custom_sections: data.customSections || [],
          author: data.author,
          tags: data.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      return mapDbToDocumentation(doc as ComponentDocumentationRow);
    });
  }

  async update(
    id: string,
    data: Partial<ComponentDocumentation>
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (data.componentName !== undefined) updateData.component_name = data.componentName;
      if (data.overview !== undefined) updateData.overview = data.overview;
      if (data.whenToUse !== undefined) updateData.when_to_use = data.whenToUse;
      if (data.bestPractices !== undefined) updateData.best_practices = data.bestPractices;
      if (data.accessibility !== undefined) updateData.accessibility = data.accessibility;
      if (data.designNotes !== undefined) updateData.design_notes = data.designNotes;
      if (data.codeExamples !== undefined) updateData.code_examples = data.codeExamples;
      if (data.customSections !== undefined) updateData.custom_sections = data.customSections;
      if (data.author !== undefined) updateData.author = data.author;
      if (data.tags !== undefined) updateData.tags = data.tags;

      const { data: doc, error } = await client
        .from('component_documentation')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapDbToDocumentation(doc as ComponentDocumentationRow);
    });
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();

      const { error } = await client
        .from('component_documentation')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    });
  }

  // ==========================================================================
  // Additional Methods
  // ==========================================================================

  /**
   * Save or update documentation by component ID
   * If documentation exists, updates it; otherwise creates new
   */
  async saveByComponentId(
    data: DocumentationCreate
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      // Check if documentation already exists
      const { data: existing } = await client
        .from('component_documentation')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('component_id', data.componentId)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data: doc, error } = await client
          .from('component_documentation')
          .update({
            component_name: data.componentName,
            overview: data.overview,
            when_to_use: data.whenToUse,
            best_practices: data.bestPractices || [],
            accessibility: data.accessibility,
            design_notes: data.designNotes,
            code_examples: data.codeExamples || [],
            custom_sections: data.customSections || [],
            author: data.author,
            tags: data.tags || [],
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;

        return mapDbToDocumentation(doc as ComponentDocumentationRow);
      } else {
        // Create new
        const { data: doc, error } = await client
          .from('component_documentation')
          .insert({
            user_id: user.user.id,
            design_system_id: data.designSystemId,
            component_id: data.componentId,
            component_name: data.componentName,
            overview: data.overview,
            when_to_use: data.whenToUse,
            best_practices: data.bestPractices || [],
            accessibility: data.accessibility,
            design_notes: data.designNotes,
            code_examples: data.codeExamples || [],
            custom_sections: data.customSections || [],
            author: data.author,
            tags: data.tags || [],
          })
          .select()
          .single();

        if (error) throw error;

        return mapDbToDocumentation(doc as ComponentDocumentationRow);
      }
    });
  }

  /**
   * Delete documentation by component ID
   */
  async deleteByComponentId(componentId: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const client = getSupabaseClient();
      const { data: user } = await client.auth.getUser();

      if (!user.user) throw new Error('Not authenticated');

      const { error } = await client
        .from('component_documentation')
        .delete()
        .eq('user_id', user.user.id)
        .eq('component_id', componentId);

      if (error) throw error;

      return true;
    });
  }
}
