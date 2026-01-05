/**
 * Supabase Database Types
 *
 * These types define the database schema for the Living Design Library.
 * They should be regenerated using the Supabase CLI when the schema changes:
 *   npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
 *
 * For now, these are manually defined to match the planned schema.
 */

// =============================================================================
// Database Schema Types (mirrors SQL schema)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      design_systems: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          use_icons: boolean;
          is_public: boolean;
          share_slug: string | null;
          current_version_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          use_icons?: boolean;
          is_public?: boolean;
          share_slug?: string | null;
          current_version_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          use_icons?: boolean;
          is_public?: boolean;
          share_slug?: string | null;
          current_version_id?: string | null;
          updated_at?: string;
        };
      };
      themes: {
        Row: {
          id: string;
          design_system_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          colors: Record<string, string>;
          spacing: Record<string, string>;
          typography: Record<string, string>;
          border_radius: Record<string, string>;
          shadows: Record<string, string>;
          sidebar: Record<string, string> | null;
          opacity: Record<string, string> | null;
          effects: Record<string, string> | null;
          color_theme: string | null;
          font_family: string | null;
          visual_feel: string | null;
          component_styles: ComponentStyles | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          design_system_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          colors?: Record<string, string>;
          spacing?: Record<string, string>;
          typography?: Record<string, string>;
          border_radius?: Record<string, string>;
          shadows?: Record<string, string>;
          sidebar?: Record<string, string> | null;
          opacity?: Record<string, string> | null;
          effects?: Record<string, string> | null;
          color_theme?: string | null;
          font_family?: string | null;
          visual_feel?: string | null;
          component_styles?: ComponentStyles | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          design_system_id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          colors?: Record<string, string>;
          spacing?: Record<string, string>;
          typography?: Record<string, string>;
          border_radius?: Record<string, string>;
          shadows?: Record<string, string>;
          sidebar?: Record<string, string> | null;
          opacity?: Record<string, string> | null;
          effects?: Record<string, string> | null;
          color_theme?: string | null;
          font_family?: string | null;
          visual_feel?: string | null;
          component_styles?: ComponentStyles | null;
          display_order?: number;
          updated_at?: string;
        };
      };
      design_intents: {
        Row: {
          id: string;
          design_system_id: string | null;
          user_id: string | null;
          intent_key: string;
          label: string;
          description: string | null;
          icon: string | null;
          categories: IntentCategory[];
          tokens: Record<string, unknown> | null;
          is_custom: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          design_system_id?: string | null;
          user_id?: string | null;
          intent_key: string;
          label: string;
          description?: string | null;
          icon?: string | null;
          categories?: IntentCategory[];
          tokens?: Record<string, unknown> | null;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          design_system_id?: string | null;
          user_id?: string | null;
          intent_key?: string;
          label?: string;
          description?: string | null;
          icon?: string | null;
          categories?: IntentCategory[];
          tokens?: Record<string, unknown> | null;
          is_custom?: boolean;
          updated_at?: string;
        };
      };
      design_system_versions: {
        Row: {
          id: string;
          design_system_id: string;
          version: string;
          version_type: 'major' | 'minor' | 'patch';
          notes: string | null;
          author: string | null;
          snapshot: VersionSnapshot;
          changes: VersionChange[];
          created_at: string;
        };
        Insert: {
          id?: string;
          design_system_id: string;
          version: string;
          version_type: 'major' | 'minor' | 'patch';
          notes?: string | null;
          author?: string | null;
          snapshot: VersionSnapshot;
          changes?: VersionChange[];
          created_at?: string;
        };
        Update: {
          id?: string;
          design_system_id?: string;
          version?: string;
          version_type?: 'major' | 'minor' | 'patch';
          notes?: string | null;
          author?: string | null;
          snapshot?: VersionSnapshot;
          changes?: VersionChange[];
        };
      };
      component_documentation: {
        Row: {
          id: string;
          user_id: string | null;
          design_system_id: string | null;
          component_id: string;
          component_name: string;
          overview: string | null;
          when_to_use: string | null;
          best_practices: string[];
          accessibility: string | null;
          design_notes: string | null;
          code_examples: CodeExample[];
          custom_sections: CustomSection[];
          author: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          design_system_id?: string | null;
          component_id: string;
          component_name: string;
          overview?: string | null;
          when_to_use?: string | null;
          best_practices?: string[];
          accessibility?: string | null;
          design_notes?: string | null;
          code_examples?: CodeExample[];
          custom_sections?: CustomSection[];
          author?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          design_system_id?: string | null;
          component_id?: string;
          component_name?: string;
          overview?: string | null;
          when_to_use?: string | null;
          best_practices?: string[];
          accessibility?: string | null;
          design_notes?: string | null;
          code_examples?: CodeExample[];
          custom_sections?: CustomSection[];
          author?: string | null;
          tags?: string[];
          updated_at?: string;
        };
      };
      ldl_documents: {
        Row: {
          id: string;
          user_id: string | null;
          design_system_id: string | null;
          name: string;
          description: string | null;
          version: string | null;
          color: Record<string, unknown> | null;
          space: Record<string, string> | null;
          radius: Record<string, string> | null;
          shadow: Record<string, string> | null;
          font: Record<string, unknown> | null;
          duration: Record<string, string> | null;
          ease: Record<string, string> | null;
          component: Record<string, unknown> | null;
          mode: Record<string, unknown> | null;
          is_public: boolean;
          share_slug: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          design_system_id?: string | null;
          name: string;
          description?: string | null;
          version?: string | null;
          color?: Record<string, unknown> | null;
          space?: Record<string, string> | null;
          radius?: Record<string, string> | null;
          shadow?: Record<string, string> | null;
          font?: Record<string, unknown> | null;
          duration?: Record<string, string> | null;
          ease?: Record<string, string> | null;
          component?: Record<string, unknown> | null;
          mode?: Record<string, unknown> | null;
          is_public?: boolean;
          share_slug?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          design_system_id?: string | null;
          name?: string;
          description?: string | null;
          version?: string | null;
          color?: Record<string, unknown> | null;
          space?: Record<string, string> | null;
          radius?: Record<string, string> | null;
          shadow?: Record<string, string> | null;
          font?: Record<string, unknown> | null;
          duration?: Record<string, string> | null;
          ease?: Record<string, string> | null;
          component?: Record<string, unknown> | null;
          mode?: Record<string, unknown> | null;
          is_public?: boolean;
          share_slug?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          active_design_system_id: string | null;
          active_theme_ids: Record<string, string>;
          theme_preference: 'light' | 'dark' | 'system';
          has_seen_decision_gate: boolean;
          has_seen_quick_start_wizard: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          active_design_system_id?: string | null;
          active_theme_ids?: Record<string, string>;
          theme_preference?: 'light' | 'dark' | 'system';
          has_seen_decision_gate?: boolean;
          has_seen_quick_start_wizard?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          active_design_system_id?: string | null;
          active_theme_ids?: Record<string, string>;
          theme_preference?: 'light' | 'dark' | 'system';
          has_seen_decision_gate?: boolean;
          has_seen_quick_start_wizard?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// =============================================================================
// Helper Types
// =============================================================================

export interface ComponentStyles {
  button?: {
    showBorder?: boolean;
    showIcons?: boolean;
  };
  chip?: {
    showBorder?: boolean;
    showIcons?: boolean;
  };
}

export interface IntentCategory {
  id: string;
  name: string;
  icon: string;
}

export interface VersionSnapshot {
  name: string;
  description?: string;
  themes: unknown[];
  activeThemeId?: string;
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  category: string;
  key: string;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface CodeExample {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: 'tsx' | 'jsx' | 'html' | 'css' | 'javascript';
  framework?: 'react' | 'vue' | 'svelte' | 'angular' | 'vanilla';
}

export interface CustomSection {
  title: string;
  content: string;
}

// =============================================================================
// Table Row Type Aliases
// =============================================================================

export type Tables = Database['public']['Tables'];

export type ProfileRow = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type DesignSystemRow = Tables['design_systems']['Row'];
export type DesignSystemInsert = Tables['design_systems']['Insert'];
export type DesignSystemUpdate = Tables['design_systems']['Update'];

export type ThemeRow = Tables['themes']['Row'];
export type ThemeInsert = Tables['themes']['Insert'];
export type ThemeUpdate = Tables['themes']['Update'];

export type DesignIntentRow = Tables['design_intents']['Row'];
export type DesignIntentInsert = Tables['design_intents']['Insert'];
export type DesignIntentUpdate = Tables['design_intents']['Update'];

export type DesignSystemVersionRow = Tables['design_system_versions']['Row'];
export type DesignSystemVersionInsert = Tables['design_system_versions']['Insert'];
export type DesignSystemVersionUpdate = Tables['design_system_versions']['Update'];

export type ComponentDocumentationRow = Tables['component_documentation']['Row'];
export type ComponentDocumentationInsert = Tables['component_documentation']['Insert'];
export type ComponentDocumentationUpdate = Tables['component_documentation']['Update'];

export type LDLDocumentRow = Tables['ldl_documents']['Row'];
export type LDLDocumentInsert = Tables['ldl_documents']['Insert'];
export type LDLDocumentUpdate = Tables['ldl_documents']['Update'];

export type UserPreferencesRow = Tables['user_preferences']['Row'];
export type UserPreferencesInsert = Tables['user_preferences']['Insert'];
export type UserPreferencesUpdate = Tables['user_preferences']['Update'];

// =============================================================================
// Composite Types (with relations)
// =============================================================================

export interface DesignSystemWithRelations extends DesignSystemRow {
  themes: ThemeRow[];
  design_intents: DesignIntentRow[];
  design_system_versions: DesignSystemVersionRow[];
}

export interface LDLDocumentWithRelations extends LDLDocumentRow {
  design_system?: DesignSystemRow | null;
}
