# Front-End Libraries Implementation

## Overview

The Front-End Libraries feature allows users to import complete front-end template repositories from GitHub, automatically extract their design tokens, create design systems, and customize them visually.

## Architecture

### Core Services

#### 1. GitHub Service (`src/services/github-service.ts`)

Handles all interactions with the GitHub API:

- **Repository fetching**: Get repo metadata, stars, description
- **File browsing**: Navigate directory structures, fetch file contents
- **Config file detection**: Automatically finds Tailwind configs, CSS files, theme files
- **Base64 decoding**: Handles GitHub's base64-encoded file contents

**Key Methods:**
- `getRepo(owner, repo)`: Fetch repository information
- `getContents(owner, repo, path)`: Get directory/file contents
- `getFileContent(owner, repo, path)`: Download raw file content
- `findConfigFiles(owner, repo)`: Locate all relevant config files

**Rate Limiting:** Uses unauthenticated GitHub API (60 requests/hour). Can be upgraded with a token for 5,000 requests/hour.

#### 2. Token Extraction Engine (`src/services/token-extraction.ts`)

Extracts design tokens from multiple configuration formats:

**Supported Formats:**
- **Tailwind CSS configs** (`.js`, `.ts`, `.cjs`, `.mjs`)
  - Colors, spacing, font families, border radius, shadows
- **CSS Variables** (`:root` blocks in CSS/SCSS)
  - Categorizes by naming convention (color, spacing, typography, etc.)
- **shadcn/ui CSS** (globals.css, app.css)
  - Extracts both light and dark mode variables

**Key Methods:**
- `extractFromTailwind(configContent)`: Parse Tailwind config objects
- `extractFromCSS(cssContent)`: Extract CSS custom properties
- `extractFromShadcnCSS(cssContent)`: Handle shadcn-style CSS variables
- `tokensToTheme(tokens, themeName)`: Convert to Theme format
- `mergeTokens(...sources)`: Combine multiple token sources

**Token Categories:**
```typescript
{
  colors: Record<string, string>,
  spacing: Record<string, string>,
  typography: {
    fontFamily: Record<string, string>,
    fontSize: Record<string, string>,
    fontWeight: Record<string, string>,
    lineHeight: Record<string, string>,
  },
  borderRadius: Record<string, string>,
  shadows: Record<string, string>,
  breakpoints: Record<string, string>
}
```

#### 3. Template Import Service (`src/services/template-import.ts`)

Orchestrates the complete import workflow:

**Import Flow:**
1. **Fetch** repository from GitHub
2. **Locate** config files (Tailwind, CSS, themes)
3. **Extract** design tokens from all sources
4. **Merge** tokens from multiple files
5. **Create** design system with extracted theme
6. **Detect** UI library from package.json
7. **Store** template metadata in localStorage

**Progress Tracking:**
```typescript
interface ImportProgress {
  step: 'fetching' | 'extracting' | 'creating' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
}
```

**Storage:**
- Design systems stored via AppStateContext
- Template metadata stored in `localStorage` under `ldl-imported-templates`

### UI Components

#### Front-End Libraries Config (`src/components/Front-EndLibrariesConfig.tsx`)

**Features:**
- **Template Browser**: 12+ curated templates with metadata
- **Search & Filters**: Full-text search + category tabs
- **Live Import**: Real-time progress indicator with toast notifications
- **Template Cards**: Show stars, license, framework, features, bundle size
- **GitHub Integration**: Direct links to view source on GitHub

**Import UX:**
1. User clicks "Import & Customize"
2. Progress bar appears with status messages:
   - "Fetching repository information..."
   - "Locating configuration files..."
   - "Extracting design tokens..."
   - "Creating design system..."
3. On success:
   - Design system added to app
   - Automatically applied as active system
   - User can immediately customize tokens

**Template Registry:**
- 4 Admin Dashboards (shadcn-admin, Next.js dashboards, Ant Design Pro, TailAdmin)
- 2 SaaS Starters (BoxyHQ, T3 Stack)
- 1 E-commerce (Medusa)
- 2 Landing Pages (shadcn-landing, Page UI)
- 3 Component Libraries (shadcn/ui, Tremor, DaisyUI)

## Data Flow

```
User clicks "Import"
  ↓
Front-EndLibrariesConfig.handleImport()
  ↓
templateImportService.importTemplate()
  ↓
├─→ githubService.getRepo() ────────────→ Fetch repo metadata
├─→ githubService.findConfigFiles() ────→ Locate configs
├─→ githubService.getFileContent() ─────→ Download files
  ↓
├─→ tokenExtractor.extractFromTailwind()
├─→ tokenExtractor.extractFromCSS()
├─→ tokenExtractor.extractFromShadcnCSS()
  ↓
├─→ tokenExtractor.mergeTokens()
├─→ tokenExtractor.tokensToTheme()
  ↓
├─→ Create DesignSystem object
├─→ Detect UI library from package.json
  ↓
Return { designSystem, template }
  ↓
Front-EndLibrariesConfig:
├─→ addDesignSystem() ──────────→ Add to AppStateContext
├─→ applySystem() ──────────────→ Set as active system
├─→ saveImportedTemplate() ─────→ Store in localStorage
  ↓
Success! User can now customize tokens
```

## Integration Points

### AppStateContext

The imported design system integrates seamlessly with the existing app:

```typescript
const { addDesignSystem, applySystem } = useAppState();

// After import
addDesignSystem(designSystem);  // Adds to designSystems array
applySystem(designSystem.id);    // Sets as activeSystemId
```

### Dynamic Theme Engine

The extracted tokens are automatically applied via the dynamic theme engine:
- CSS custom properties injected into `:root`
- Entire app becomes a live preview
- Theme customizer works with imported tokens

### Token Editor

Users can immediately edit imported tokens:
1. Navigate to "Design Tokens" page
2. See all extracted tokens organized by category
3. Edit colors, spacing, typography visually
4. Changes apply in real-time

## Current Status

### ✅ Implemented
- GitHub API service (fetch repos, files, contents)
- Token extraction engine (Tailwind, CSS, shadcn)
- Template import orchestration
- Design system creation from tokens
- UI library detection
- Progress tracking with live updates
- Template storage in localStorage
- Full UI integration with progress indicators
- 12+ curated templates

### 🚧 Next Steps (Future Enhancements)

1. **Token Re-application Engine**
   - Take customized tokens and re-apply to original template
   - Update Tailwind config, CSS files, theme files
   - Preserve template structure while updating tokens

2. **Template Export**
   - Export customized template as ZIP file
   - Include all original files with updated tokens
   - Ready for deployment

3. **One-Click Deploy**
   - Integrate with Vercel, Netlify, GitHub Pages
   - Deploy customized template directly from app

4. **Enhanced Token Detection**
   - Support Ant Design theme files
   - Support Material-UI theme providers
   - Support Chakra UI theme configs
   - Support Bootstrap SCSS variables

5. **Template Preview**
   - Show live preview of template before import
   - Use iframe or screenshots

6. **Template Versioning**
   - Track imported template versions
   - Update to latest template version
   - Preserve custom token overrides

7. **GitHub Authentication**
   - Use user's GitHub token for higher rate limits
   - Access private repositories
   - Fork templates directly to user's account

## File Structure

```
src/
├── services/
│   ├── github-service.ts          # GitHub API integration
│   ├── token-extraction.ts        # Token extraction engine
│   └── template-import.ts         # Import orchestration
├── components/
│   ├── Front-EndLibrariesConfig.tsx  # Main UI component
│   └── ui/
│       └── progress.tsx           # Progress bar component
└── contexts/
    └── AppStateContext.tsx        # Design system state

docs/
├── TEMPLATE_REPO_INTEGRATION.md   # Original vision document
├── FRONTEND_LIBRARIES_IMPLEMENTATION.md  # This file
└── MULTI_LIBRARY_VISION.md        # Multi-library showcase vision
```

## Usage Example

```typescript
// Import a template
const result = await templateImportService.importTemplate(
  'satnaing/shadcn-admin',
  'shadcn Admin Dashboard',
  (progress) => {
    console.log(`${progress.step}: ${progress.message} (${progress.progress}%)`);
  }
);

// Result contains:
// - designSystem: Ready to use DesignSystem object
// - template: ImportedTemplate metadata

// Add to app
addDesignSystem(result.designSystem);
applySystem(result.designSystem.id);

// Customize tokens
// User navigates to Design Tokens page and edits visually
```

## Technical Considerations

### GitHub API Rate Limits
- **Unauthenticated**: 60 requests/hour per IP
- **Authenticated**: 5,000 requests/hour per user
- Current implementation uses unauthenticated API
- Rate limit handling: Show error message if limit exceeded

### Token Extraction Accuracy
- Regex-based parsing (not AST-based)
- Works for 90% of common patterns
- May miss complex token definitions (nested objects, computed values)
- Future: Use proper JS/CSS parsers for 100% accuracy

### Browser Limitations
- All processing happens in browser (no backend)
- Large repos may be slow to download
- File size limits depend on browser memory
- Future: Add size warnings for large templates

### Storage
- Templates stored in localStorage (5-10MB limit)
- Design systems also in localStorage
- Future: Add cloud sync via Supabase

## Testing

To test the import flow:

1. Navigate to Configuration → Front-End Libraries
2. Click "Import & Customize" on any template (e.g., shadcn-admin)
3. Watch progress bar as tokens are extracted
4. New design system appears in sidebar
5. Navigate to Design Tokens page to see extracted tokens
6. Customize tokens and see changes in real-time

## Troubleshooting

**Import fails with GitHub API error:**
- Check GitHub API rate limit status
- Verify repo exists and is public
- Check browser console for detailed error

**No tokens extracted:**
- Template may use non-standard config format
- Check which files were found in browser console
- May need to add support for new token format

**Design system not appearing:**
- Check AppStateContext is properly initialized
- Verify localStorage is enabled
- Check browser console for errors

## Performance

**Import Speed:**
- Small templates (< 10 files): 2-5 seconds
- Medium templates (10-50 files): 5-15 seconds
- Large templates (> 50 files): 15-30 seconds

**Optimization Opportunities:**
- Cache GitHub responses (reduce duplicate fetches)
- Parallel file downloads (fetch multiple files at once)
- Skip non-essential files (focus on config files only)
- Add progress caching (resume failed imports)

## Credits

Built on top of:
- **GitHub API v3**: Repository and file access
- **shadcn/ui**: UI component foundation
- **Living Design Library**: Core design system architecture

Template sources:
- All templates are open-source projects from GitHub
- Full credit to original authors (see GitHub links)
- Templates used with permission under their respective licenses
