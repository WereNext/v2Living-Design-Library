/**
 * Data Migration Service
 *
 * Handles migration of data from localStorage to Supabase on first sign-in.
 * Supports migrating design systems, documentation, intents, and LDL documents.
 */

import { supabase, getSupabaseClient } from '../../lib/supabase';
import { STORAGE_KEYS } from '../../lib/constants';
import type { DesignSystem, Theme } from '../../hooks/useDesignSystems';
import type { LDLTokenDocument } from '../../lib/ldl/types';

// =============================================================================
// Types
// =============================================================================

export interface MigrationResult {
  success: boolean;
  migratedSystems: number;
  migratedLDLDocuments: number;
  migratedDocumentation: number;
  errors: string[];
  warnings: string[];
}

export interface MigrationProgress {
  phase: 'starting' | 'systems' | 'ldl' | 'documentation' | 'complete' | 'error';
  current: number;
  total: number;
  message: string;
}

export type MigrationProgressCallback = (progress: MigrationProgress) => void;

// Prebuilt system IDs that should never be migrated
const PREBUILT_SYSTEM_IDS = [
  'default-system',
  'material-system',
  'minimalist-system',
  'candy-nest-system',
];

// =============================================================================
// Migration Service
// =============================================================================

export class DataMigrationService {
  private userId: string | null = null;

  /**
   * Check if migration has already been completed for a user
   */
  async isMigrationComplete(userId: string): Promise<boolean> {
    const migrationKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_MIGRATION_COMPLETE);
    const storedUserId = localStorage.getItem(STORAGE_KEYS.SUPABASE_USER_ID);

    return migrationKey !== null && storedUserId === userId;
  }

  /**
   * Check if there's any local data to migrate
   */
  hasLocalData(): boolean {
    const systems = localStorage.getItem(STORAGE_KEYS.DESIGN_SYSTEMS);
    const ldlDocs = localStorage.getItem(STORAGE_KEYS.LDL_DOCUMENTS);
    const docs = localStorage.getItem(STORAGE_KEYS.COMPONENT_DOCUMENTATION);

    // Check for non-prebuilt systems
    if (systems) {
      try {
        const parsed = JSON.parse(systems) as DesignSystem[];
        const customSystems = parsed.filter(
          (s) => !PREBUILT_SYSTEM_IDS.includes(s.id)
        );
        if (customSystems.length > 0) return true;
      } catch {
        // Invalid JSON, skip
      }
    }

    // Check for LDL documents
    if (ldlDocs) {
      try {
        const parsed = JSON.parse(ldlDocs);
        if (Array.isArray(parsed) && parsed.length > 0) return true;
      } catch {
        // Invalid JSON, skip
      }
    }

    // Check for documentation
    if (docs) {
      try {
        const parsed = JSON.parse(docs);
        if (Array.isArray(parsed) && parsed.length > 0) return true;
      } catch {
        // Invalid JSON, skip
      }
    }

    return false;
  }

  /**
   * Run the full migration
   */
  async migrateAll(
    userId: string,
    onProgress?: MigrationProgressCallback
  ): Promise<MigrationResult> {
    this.userId = userId;

    const result: MigrationResult = {
      success: true,
      migratedSystems: 0,
      migratedLDLDocuments: 0,
      migratedDocumentation: 0,
      errors: [],
      warnings: [],
    };

    try {
      onProgress?.({
        phase: 'starting',
        current: 0,
        total: 3,
        message: 'Starting migration...',
      });

      // 1. Migrate Design Systems
      onProgress?.({
        phase: 'systems',
        current: 1,
        total: 3,
        message: 'Migrating design systems...',
      });

      const systemsResult = await this.migrateDesignSystems();
      result.migratedSystems = systemsResult.count;
      result.errors.push(...systemsResult.errors);
      result.warnings.push(...systemsResult.warnings);

      // 2. Migrate LDL Documents
      onProgress?.({
        phase: 'ldl',
        current: 2,
        total: 3,
        message: 'Migrating LDL token documents...',
      });

      const ldlResult = await this.migrateLDLDocuments();
      result.migratedLDLDocuments = ldlResult.count;
      result.errors.push(...ldlResult.errors);
      result.warnings.push(...ldlResult.warnings);

      // 3. Migrate Documentation
      onProgress?.({
        phase: 'documentation',
        current: 3,
        total: 3,
        message: 'Migrating component documentation...',
      });

      const docsResult = await this.migrateDocumentation();
      result.migratedDocumentation = docsResult.count;
      result.errors.push(...docsResult.errors);
      result.warnings.push(...docsResult.warnings);

      // Mark migration as complete
      if (result.errors.length === 0) {
        localStorage.setItem(
          STORAGE_KEYS.SUPABASE_MIGRATION_COMPLETE,
          new Date().toISOString()
        );
        localStorage.setItem(STORAGE_KEYS.SUPABASE_USER_ID, userId);
      } else {
        result.success = false;
      }

      onProgress?.({
        phase: 'complete',
        current: 3,
        total: 3,
        message: `Migration complete. Migrated ${result.migratedSystems} systems, ${result.migratedLDLDocuments} LDL documents, ${result.migratedDocumentation} docs.`,
      });
    } catch (error) {
      result.success = false;
      result.errors.push(
        `Migration failed: ${error instanceof Error ? error.message : String(error)}`
      );

      onProgress?.({
        phase: 'error',
        current: 0,
        total: 3,
        message: 'Migration failed. See errors for details.',
      });
    }

    return result;
  }

  /**
   * Migrate design systems from localStorage to Supabase
   */
  private async migrateDesignSystems(): Promise<{
    count: number;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let count = 0;

    if (!this.userId) {
      errors.push('User ID not set');
      return { count, errors, warnings };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DESIGN_SYSTEMS);
      if (!stored) return { count: 0, errors: [], warnings: [] };

      const systems: DesignSystem[] = JSON.parse(stored);
      const customSystems = systems.filter(
        (s) => !PREBUILT_SYSTEM_IDS.includes(s.id)
      );

      if (customSystems.length === 0) {
        return { count: 0, errors: [], warnings: [] };
      }

      const client = getSupabaseClient();

      for (const system of customSystems) {
        try {
          // Check if already exists (by name)
          const { data: existing } = await client
            .from('design_systems')
            .select('id')
            .eq('user_id', this.userId)
            .eq('name', system.name)
            .maybeSingle();

          if (existing) {
            warnings.push(`System "${system.name}" already exists, skipping`);
            continue;
          }

          // Create the design system
          const { data: newSystem, error: systemError } = await client
            .from('design_systems')
            .insert({
              user_id: this.userId,
              name: system.name,
              description: system.description,
              use_icons: system.useIcons ?? true,
            })
            .select()
            .single();

          if (systemError) throw systemError;

          // Create themes
          if (system.themes?.length) {
            const themesToInsert = system.themes.map((theme, index) => ({
              design_system_id: newSystem.id,
              name: theme.name,
              description: theme.description,
              is_active: theme.id === system.activeThemeId || index === 0,
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

            if (themesError) {
              warnings.push(
                `Failed to migrate themes for "${system.name}": ${themesError.message}`
              );
            }
          }

          // Create intents
          if (system.intents?.length) {
            const intentsToInsert = system.intents.map((intent) => ({
              design_system_id: newSystem.id,
              user_id: this.userId,
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

            if (intentsError) {
              warnings.push(
                `Failed to migrate intents for "${system.name}": ${intentsError.message}`
              );
            }
          }

          // Create versions
          if (system.versions?.length) {
            const versionsToInsert = system.versions.map((version) => ({
              design_system_id: newSystem.id,
              version: version.version,
              version_type: 'patch' as const,
              notes: version.notes,
              author: version.author,
              snapshot: version.snapshot,
              changes: version.changes || [],
            }));

            const { error: versionsError } = await client
              .from('design_system_versions')
              .insert(versionsToInsert);

            if (versionsError) {
              warnings.push(
                `Failed to migrate versions for "${system.name}": ${versionsError.message}`
              );
            }
          }

          count++;
        } catch (error) {
          errors.push(
            `Failed to migrate system "${system.name}": ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    } catch (error) {
      errors.push(
        `Failed to parse local design systems: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    return { count, errors, warnings };
  }

  /**
   * Migrate LDL documents from localStorage to Supabase
   */
  private async migrateLDLDocuments(): Promise<{
    count: number;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let count = 0;

    if (!this.userId) {
      errors.push('User ID not set');
      return { count, errors, warnings };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LDL_DOCUMENTS);
      if (!stored) return { count: 0, errors: [], warnings: [] };

      const docs = JSON.parse(stored);
      if (!Array.isArray(docs) || docs.length === 0) {
        return { count: 0, errors: [], warnings: [] };
      }

      const client = getSupabaseClient();

      for (const doc of docs) {
        try {
          // Check if already exists (by name)
          const { data: existing } = await client
            .from('ldl_documents')
            .select('id')
            .eq('user_id', this.userId)
            .eq('name', doc.$name || doc.name)
            .maybeSingle();

          if (existing) {
            warnings.push(
              `LDL document "${doc.$name || doc.name}" already exists, skipping`
            );
            continue;
          }

          const { error } = await client.from('ldl_documents').insert({
            user_id: this.userId,
            name: doc.$name || doc.name,
            description: doc.$description || doc.description,
            version: doc.$version || doc.version,
            color: doc.color,
            space: doc.space,
            radius: doc.radius,
            shadow: doc.shadow,
            font: doc.font,
            duration: doc.duration,
            ease: doc.ease,
            component: doc.component,
            mode: doc.mode,
            is_public: doc.isPublic || false,
            share_slug: doc.shareSlug,
            published_at: doc.publishedAt,
          });

          if (error) throw error;
          count++;
        } catch (error) {
          errors.push(
            `Failed to migrate LDL document "${doc.$name || doc.name}": ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    } catch (error) {
      errors.push(
        `Failed to parse local LDL documents: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    return { count, errors, warnings };
  }

  /**
   * Migrate component documentation from localStorage to Supabase
   */
  private async migrateDocumentation(): Promise<{
    count: number;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let count = 0;

    if (!this.userId) {
      errors.push('User ID not set');
      return { count, errors, warnings };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPONENT_DOCUMENTATION);
      if (!stored) return { count: 0, errors: [], warnings: [] };

      const docs = JSON.parse(stored);
      if (!Array.isArray(docs) || docs.length === 0) {
        return { count: 0, errors: [], warnings: [] };
      }

      const client = getSupabaseClient();

      for (const doc of docs) {
        try {
          const { error } = await client.from('component_documentation').upsert(
            {
              user_id: this.userId,
              component_id: doc.componentId,
              component_name: doc.componentName,
              overview: doc.overview,
              when_to_use: doc.whenToUse,
              best_practices: doc.bestPractices || [],
              accessibility: doc.accessibility,
              design_notes: doc.designNotes,
              code_examples: doc.codeExamples || [],
              custom_sections: doc.customSections || [],
              author: doc.author,
              tags: doc.tags || [],
            },
            {
              onConflict: 'user_id,design_system_id,component_id',
            }
          );

          if (error) throw error;
          count++;
        } catch (error) {
          errors.push(
            `Failed to migrate documentation for "${doc.componentName}": ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    } catch (error) {
      errors.push(
        `Failed to parse local documentation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    return { count, errors, warnings };
  }

  /**
   * Clear local data after successful migration (optional)
   */
  clearLocalData(preservePreferences = true): void {
    const keysToPreserve = preservePreferences
      ? [
          STORAGE_KEYS.ACTIVE_SYSTEM_ID,
          STORAGE_KEYS.ACTIVE_THEME_IDS,
          STORAGE_KEYS.HAS_SEEN_DECISION_GATE,
          STORAGE_KEYS.HAS_SEEN_QUICK_START_WIZARD,
          STORAGE_KEYS.THEME_PREFERENCE,
          STORAGE_KEYS.SUPABASE_MIGRATION_COMPLETE,
          STORAGE_KEYS.SUPABASE_USER_ID,
          STORAGE_KEYS.FIGMA_API_KEY,
          STORAGE_KEYS.LLM_API_KEY,
          STORAGE_KEYS.LLM_PROVIDER,
          STORAGE_KEYS.LLM_ENDPOINT,
          STORAGE_KEYS.LLM_MODEL,
        ]
      : [
          STORAGE_KEYS.SUPABASE_MIGRATION_COMPLETE,
          STORAGE_KEYS.SUPABASE_USER_ID,
        ];

    // Get all storage keys and remove those not in preserve list
    const allKeys = Object.values(STORAGE_KEYS);
    for (const key of allKeys) {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const dataMigrationService = new DataMigrationService();
