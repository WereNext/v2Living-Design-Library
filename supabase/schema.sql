-- =============================================================================
-- Living Design Library - Supabase Database Schema
-- =============================================================================
-- Run this SQL in your Supabase SQL Editor to set up the database.
-- https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- DESIGN SYSTEMS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.design_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  use_icons BOOLEAN DEFAULT TRUE,

  -- Sharing
  is_public BOOLEAN DEFAULT FALSE,
  share_slug TEXT UNIQUE,

  -- Versioning
  current_version_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_design_systems_user ON public.design_systems(user_id);
CREATE INDEX IF NOT EXISTS idx_design_systems_share_slug ON public.design_systems(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_design_systems_public ON public.design_systems(is_public) WHERE is_public = TRUE;

-- =============================================================================
-- THEMES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT FALSE,

  -- Token collections (JSONB for flexibility)
  colors JSONB NOT NULL DEFAULT '{}',
  spacing JSONB NOT NULL DEFAULT '{}',
  typography JSONB NOT NULL DEFAULT '{}',
  border_radius JSONB NOT NULL DEFAULT '{}',
  shadows JSONB NOT NULL DEFAULT '{}',
  sidebar JSONB,
  opacity JSONB,
  effects JSONB,

  -- Theme customizer presets
  color_theme TEXT,
  font_family TEXT,
  visual_feel TEXT,

  -- Component-specific styles
  component_styles JSONB,

  -- Ordering
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_themes_design_system ON public.themes(design_system_id);

-- =============================================================================
-- DESIGN INTENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.design_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Core fields
  intent_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  icon TEXT,

  -- Categories
  categories JSONB NOT NULL DEFAULT '[]',

  -- Token overrides
  tokens JSONB,

  -- Flags
  is_custom BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(design_system_id, intent_key)
);

CREATE INDEX IF NOT EXISTS idx_design_intents_system ON public.design_intents(design_system_id);
CREATE INDEX IF NOT EXISTS idx_design_intents_user ON public.design_intents(user_id);

-- =============================================================================
-- DESIGN SYSTEM VERSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.design_system_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,

  -- Version info
  version TEXT NOT NULL,
  version_type TEXT NOT NULL CHECK (version_type IN ('major', 'minor', 'patch')),
  notes TEXT,
  author TEXT,

  -- Complete snapshot
  snapshot JSONB NOT NULL,

  -- Change tracking
  changes JSONB NOT NULL DEFAULT '[]',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_versions_design_system ON public.design_system_versions(design_system_id);
CREATE INDEX IF NOT EXISTS idx_versions_created ON public.design_system_versions(created_at DESC);

-- =============================================================================
-- COMPONENT DOCUMENTATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.component_documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,

  -- Component reference
  component_id TEXT NOT NULL,
  component_name TEXT NOT NULL,

  -- Documentation content
  overview TEXT,
  when_to_use TEXT,
  best_practices JSONB DEFAULT '[]',
  accessibility TEXT,
  design_notes TEXT,

  -- Code examples
  code_examples JSONB DEFAULT '[]',

  -- Custom sections
  custom_sections JSONB DEFAULT '[]',

  -- Metadata
  author TEXT,
  tags JSONB DEFAULT '[]',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, design_system_id, component_id)
);

CREATE INDEX IF NOT EXISTS idx_documentation_user ON public.component_documentation(user_id);
CREATE INDEX IF NOT EXISTS idx_documentation_system ON public.component_documentation(design_system_id);

-- =============================================================================
-- LDL DOCUMENTS (Living Design Library Token Documents)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ldl_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE SET NULL,

  -- Metadata ($ prefix fields from LDL spec)
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,

  -- Token categories (JSONB)
  color JSONB,
  space JSONB,
  radius JSONB,
  shadow JSONB,
  font JSONB,
  duration JSONB,
  ease JSONB,
  component JSONB,
  mode JSONB,

  -- Publishing
  is_public BOOLEAN DEFAULT FALSE,
  share_slug TEXT UNIQUE,
  published_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ldl_documents_user ON public.ldl_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_ldl_documents_share_slug ON public.ldl_documents(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ldl_documents_public ON public.ldl_documents(is_public) WHERE is_public = TRUE;

-- =============================================================================
-- USER PREFERENCES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Active selections
  active_design_system_id UUID REFERENCES public.design_systems(id) ON DELETE SET NULL,
  active_theme_ids JSONB DEFAULT '{}',

  -- UI preferences
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  has_seen_decision_gate BOOLEAN DEFAULT FALSE,
  has_seen_quick_start_wizard BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_design_systems_updated_at ON public.design_systems;
CREATE TRIGGER tr_design_systems_updated_at
  BEFORE UPDATE ON public.design_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_themes_updated_at ON public.themes;
CREATE TRIGGER tr_themes_updated_at
  BEFORE UPDATE ON public.themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_design_intents_updated_at ON public.design_intents;
CREATE TRIGGER tr_design_intents_updated_at
  BEFORE UPDATE ON public.design_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_component_documentation_updated_at ON public.component_documentation;
CREATE TRIGGER tr_component_documentation_updated_at
  BEFORE UPDATE ON public.component_documentation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_ldl_documents_updated_at ON public.ldl_documents;
CREATE TRIGGER tr_ldl_documents_updated_at
  BEFORE UPDATE ON public.ldl_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER tr_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_system_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ldl_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES - PROFILES
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- RLS POLICIES - DESIGN SYSTEMS
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own or public design systems" ON public.design_systems;
CREATE POLICY "Users can view own or public design systems" ON public.design_systems
  FOR SELECT USING (user_id = auth.uid() OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can insert own design systems" ON public.design_systems;
CREATE POLICY "Users can insert own design systems" ON public.design_systems
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own design systems" ON public.design_systems;
CREATE POLICY "Users can update own design systems" ON public.design_systems
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own design systems" ON public.design_systems;
CREATE POLICY "Users can delete own design systems" ON public.design_systems
  FOR DELETE USING (user_id = auth.uid());

-- =============================================================================
-- RLS POLICIES - THEMES
-- =============================================================================

DROP POLICY IF EXISTS "Users can view themes of accessible systems" ON public.themes;
CREATE POLICY "Users can view themes of accessible systems" ON public.themes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = design_system_id
      AND (ds.user_id = auth.uid() OR ds.is_public = TRUE)
    )
  );

DROP POLICY IF EXISTS "Users can manage themes of own systems" ON public.themes;
CREATE POLICY "Users can manage themes of own systems" ON public.themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = design_system_id AND ds.user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES - DESIGN INTENTS
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own intents" ON public.design_intents;
CREATE POLICY "Users can view own intents" ON public.design_intents
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own intents" ON public.design_intents;
CREATE POLICY "Users can manage own intents" ON public.design_intents
  FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- RLS POLICIES - VERSIONS
-- =============================================================================

DROP POLICY IF EXISTS "Users can view versions of accessible systems" ON public.design_system_versions;
CREATE POLICY "Users can view versions of accessible systems" ON public.design_system_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = design_system_id
      AND (ds.user_id = auth.uid() OR ds.is_public = TRUE)
    )
  );

DROP POLICY IF EXISTS "Users can manage versions of own systems" ON public.design_system_versions;
CREATE POLICY "Users can manage versions of own systems" ON public.design_system_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems ds
      WHERE ds.id = design_system_id AND ds.user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES - DOCUMENTATION
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own documentation" ON public.component_documentation;
CREATE POLICY "Users can view own documentation" ON public.component_documentation
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own documentation" ON public.component_documentation;
CREATE POLICY "Users can manage own documentation" ON public.component_documentation
  FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- RLS POLICIES - LDL DOCUMENTS
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own or public LDL documents" ON public.ldl_documents;
CREATE POLICY "Users can view own or public LDL documents" ON public.ldl_documents
  FOR SELECT USING (user_id = auth.uid() OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can manage own LDL documents" ON public.ldl_documents;
CREATE POLICY "Users can manage own LDL documents" ON public.ldl_documents
  FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- RLS POLICIES - USER PREFERENCES
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- DONE
-- =============================================================================

-- After running this SQL:
-- 1. Enable Google OAuth in Authentication > Providers > Google
-- 2. Enable GitHub OAuth in Authentication > Providers > GitHub
-- 3. Set your Site URL in Authentication > URL Configuration
-- 4. Add redirect URLs for your app (localhost:3000 for dev)
