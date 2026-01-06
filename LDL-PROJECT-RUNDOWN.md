# Living Design Library (LDL) - Project Rundown

## Quick Summary

**Living Design Library** is a design system management platform that lets users create, customize, and export design tokens across multiple UI frameworks. Think "Figma Variables, but open source and framework-agnostic."

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Supabase

**Repo:** https://github.com/WereNext/v2Living-Design-Library

---

## What It Does

### Core Features (Working)
1. **Theme Customization** - Visual editors for colors, spacing, typography, border-radius, shadows
2. **Multiple Themes** - Create light/dark/custom theme variants per design system
3. **Component Showcase** - 30+ component categories with live previews
4. **Token Export** - CSS variables, SCSS, Tailwind config, JSON
5. **Design Intents** - Semantic token layer (like "cta-primary" maps to specific tokens)
6. **Version Control** - Snapshot-based versioning with change tracking
7. **Quick Start Wizard** - Guided onboarding flow

### Backend (Supabase - Schema Ready)
- User profiles with OAuth (Google, GitHub)
- Design systems with public/private sharing
- Themes with JSONB token storage
- Design intents (semantic layer)
- Version history with snapshots
- Component documentation
- LDL Documents (exportable token format)
- Full RLS policies

### WIP Features
- **Multi-Library Adapters** - Render same components in shadcn, MUI, Chakra, Ant Design, Bootstrap
- **Theme Mappers** - Convert LDL tokens to library-specific theme formats
- **UILibraryProvider** - Context for switching render targets

---

## Codebase Structure

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
├── components/
│   ├── ui/                    # shadcn/ui components (80+ files)
│   ├── ui-adapters/           # Cross-library component wrappers (WIP)
│   ├── ui-mui/                # MUI implementations (WIP)
│   ├── ui-chakra/             # Chakra implementations (WIP)
│   ├── ui-antd/               # Ant Design implementations (WIP)
│   ├── ui-bootstrap/          # Bootstrap implementations (WIP)
│   ├── showcases/             # Component demo pages (30+ categories)
│   │   ├── playground/        # Interactive component playground
│   │   └── enhanced-playground/
│   ├── wizard-steps/          # Quick start wizard steps
│   ├── theme-customizer/      # Token editing components
│   ├── design-system-builder/ # Design system management
│   └── token-features/        # Token export, search, validation
├── contexts/
│   ├── AppStateContext.tsx    # Global app state
│   └── ActiveThemeContext.tsx # Theme management
├── hooks/
│   ├── useTheme.ts            # Theme application hook
│   ├── useDesignSystems.ts    # Design system CRUD
│   └── useUILibrary.ts        # Library switching (WIP)
├── lib/
│   ├── constants.ts           # Component/intent definitions
│   ├── default-themes.ts      # Built-in theme presets
│   ├── code-generators.ts     # Export format generators
│   ├── theme-mappers/         # Library-specific converters (WIP)
│   └── supabase/              # Database service layer
├── providers/
│   └── UILibraryProvider.tsx  # Multi-library context (WIP)
└── services/
    └── supabase/              # API service classes
```

**Stats:** 289 TypeScript files, 44 directories

---

## Database Schema (Supabase)

```
profiles          - User accounts (OAuth from auth.users)
design_systems    - User's design systems with sharing
themes            - Token collections (colors, spacing, etc.)
design_intents    - Semantic token mappings
design_system_versions - Version snapshots
component_documentation - Component usage docs
ldl_documents     - Exportable token documents
user_preferences  - Active selections, UI prefs
```

All tables have RLS policies for user isolation and public sharing.

---

## Key Concepts

### LDL Tokens
Our open-source semantic token format - like Figma Variables but portable:
- Version controlled in Git
- Exports to any framework (CSS, Tailwind, SCSS, etc.)
- Supports aliases/references (`{color.primary.500}`)
- Theme variants (light/dark/custom)

### Design Intents
Semantic layer on top of raw tokens:
```
"cta-primary" → background: primary-500, text: white, hover: primary-600
"form-input" → border: gray-300, focus: primary-500, radius: md
```

### Multi-Library Architecture (WIP)
```
LDL Tokens → Theme Mapper → MUI Theme / Chakra Theme / etc.
                ↓
         UI Adapter Layer → Renders correct component
```

---

## What's Working vs WIP

### Working
- Theme editor with all token categories
- Component showcases with live preview
- Quick start wizard
- Export to CSS/SCSS/Tailwind/JSON
- Design intent system
- Version management UI
- Supabase schema and service layer
- Error boundaries

### WIP / Incomplete
- Multi-library rendering (adapters exist, not wired up)
- Theme mappers (code exists, not integrated)
- Supabase auth flow (schema ready, UI not connected)
- Figma plugin (researched, not started)
- Public sharing (schema ready, UI not built)
- LDL document export format

---

## Business Context

### Target Users
- Design system teams
- Frontend developers
- Agencies managing multiple brands

### Pricing Model (Planned)
- **Free:** Individuals, 1 design system, public only
- **Team:** $49-99/mo flat (not per-seat), unlimited systems, private sharing

### Acquisition Potential
- Strategic fit: Figma/Adobe, Webflow, Vercel, Framer
- Comparable exits: $3-20M depending on traction
- Key differentiator: Multi-library export, open LDL format

### Figma Plugin Feasibility
- Fully feasible via Plugin API (`figma.variables`)
- Could fork Tokens Studio (MIT license, 1.5k stars)
- Bi-directional sync possible with REST API (Enterprise tier)

---

## Next Steps / Priorities

1. **Wire up Supabase auth** - Enable login/signup
2. **Connect service layer** - CRUD operations to Supabase
3. **Public sharing** - Generate share URLs, public view
4. **Complete multi-library adapters** - Full component coverage
5. **LDL export format** - Standardize JSON schema
6. **Figma plugin** - Fork Tokens Studio or build from scratch

---

## Running Locally

```bash
npm install
npm run dev
```

Supabase setup:
1. Create project at supabase.com
2. Run `supabase/schema.sql`
3. Enable Google/GitHub OAuth
4. Add env vars (see .env.example if exists)

---

## Dependencies (Notable)

- **UI:** shadcn/ui, Radix primitives, Tailwind
- **Multi-lib:** MUI, Chakra, Ant Design, Bootstrap
- **Backend:** Supabase (auth, database, RLS)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form
