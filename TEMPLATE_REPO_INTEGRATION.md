# Template Repository Integration - "Hidden Layer" Architecture

## 🎯 Vision

Create a **hidden layer** of complete front-end templates beneath the custom design system layer, where users can:

1. **Start with a complete repo** (e.g., shadcn-admin, Ant Design Pro, Next.js SaaS starter)
2. **Extract the design system** (tokens, colors, spacing, typography) from that template
3. **Customize the tokens** using your visual token editor
4. **Re-apply customized tokens** back to the original template
5. **Save as their own design system** for future use
6. **Export the modified template** as a complete, production-ready codebase

### **The Flow**:
```
1. User: "I want to build an admin dashboard"
2. App: Shows shadcn-admin, Ant Design Pro, TailAdmin templates
3. User: Selects shadcn-admin
4. App: Imports entire repo, extracts design tokens → Design System
5. User: Customizes colors, spacing, fonts in visual editor
6. App: Re-generates template with custom tokens
7. User: Downloads complete, customized admin dashboard repo
```

---

## 🏗️ Architecture: The "Hidden Layer"

### **Layer 1: Template Repository Storage**
```
Complete front-end repos stored as:
- Git submodules (for updates)
- NPM packages (for versioning)
- Bundled snapshots (for offline)
```

### **Layer 2: Token Extraction Engine**
```
Analyzes template code and extracts:
- Tailwind config → Design tokens
- CSS variables → Color palette
- Theme files → Typography, spacing
- Component styles → Semantic tokens
```

### **Layer 3: Visual Token Editor** (Already exists!)
```
Your existing 6-tab token editor:
- Colors, Spacing, Typography, Radius, Shadows, etc.
```

### **Layer 4: Token Re-Application Engine**
```
Takes customized tokens and:
- Regenerates Tailwind config
- Updates CSS variables
- Rewrites theme files
- Preserves template structure
```

### **Layer 5: Export as Complete Repo**
```
Exports:
- Full Next.js/Vite project
- Modified design tokens
- Original components (now themed)
- package.json, config files, etc.
```

---

## 📦 Template Categories & Repos

Based on the research, here are the top repos to integrate:

### **Admin Dashboards** (Intent: `admin`, `dashboard`)

**1. shadcn-admin** (10.9k stars, MIT)
```typescript
{
  id: 'shadcn-admin',
  name: 'shadcn Admin Dashboard',
  github: 'satnaing/shadcn-admin',
  license: 'MIT',
  framework: 'Vite + React',
  uiLibrary: 'shadcn',
  intents: ['admin', 'dashboard', 'saas'],
  tokenExtraction: {
    sources: ['tailwind.config.ts', 'src/styles/globals.css'],
    format: 'css-variables',
  },
  features: [
    '10+ dashboard pages',
    'Light/dark mode',
    'RTL support',
    'Global search',
    'Authentication layouts',
  ],
  bundleSize: '~150kb',
}
```

**2. next-shadcn-dashboard-starter** (5.9k stars, MIT)
```typescript
{
  id: 'next-shadcn-dashboard',
  name: 'Next.js Shadcn Dashboard',
  github: 'Kiranism/next-shadcn-dashboard-starter',
  license: 'MIT',
  framework: 'Next.js 16',
  uiLibrary: 'shadcn',
  intents: ['saas', 'admin', 'multi-tenant'],
  tokenExtraction: {
    sources: ['tailwind.config.ts', 'app/globals.css'],
    format: 'tailwind-v4',
  },
  features: [
    'RBAC navigation',
    'TanStack tables',
    'Clerk auth',
    'Multi-tenant',
    'Billing integration',
  ],
  bundleSize: '~200kb',
}
```

**3. Ant Design Pro** (37.9k stars, MIT)
```typescript
{
  id: 'ant-design-pro',
  name: 'Ant Design Pro',
  github: 'ant-design/ant-design-pro',
  license: 'MIT',
  framework: 'Umi + React',
  uiLibrary: 'antd',
  intents: ['enterprise', 'admin', 'crm'],
  tokenExtraction: {
    sources: ['config/theme.ts', 'src/global.less'],
    format: 'antd-tokens',
  },
  features: [
    'Enterprise-grade',
    'Complex forms & tables',
    'i18n support',
    'Authorization',
    'Mock data',
  ],
  bundleSize: '~520kb',
}
```

**4. TailAdmin React** (1.1k stars, MIT)
```typescript
{
  id: 'tailadmin',
  name: 'TailAdmin Dashboard',
  github: 'TailAdmin/free-react-tailwind-admin-dashboard',
  license: 'MIT',
  framework: 'React 19 + Vite',
  uiLibrary: 'tailwind',
  intents: ['admin', 'analytics', 'ecommerce-admin'],
  tokenExtraction: {
    sources: ['tailwind.config.js'],
    format: 'tailwind-v4',
  },
  features: [
    '7 unique dashboards',
    '35+ components',
    'Dark mode',
    'Analytics charts',
  ],
  bundleSize: '~180kb',
}
```

---

### **SaaS Starter Kits** (Intent: `saas`, `web-app`)

**5. BoxyHQ SaaS Starter Kit** (4.7k stars, Apache 2.0)
```typescript
{
  id: 'boxyhq-saas',
  name: 'BoxyHQ SaaS Starter',
  github: 'boxyhq/saas-starter-kit',
  license: 'Apache-2.0',
  framework: 'Next.js',
  uiLibrary: 'headless-ui',
  intents: ['saas', 'enterprise', 'b2b'],
  tokenExtraction: {
    sources: ['tailwind.config.js', 'styles/globals.css'],
    format: 'tailwind',
  },
  features: [
    'SAML SSO',
    'Directory Sync',
    'Stripe billing',
    'Team management',
    'Audit logs',
  ],
  bundleSize: '~250kb',
}
```

**6. T3 Stack** (28.5k stars, MIT)
```typescript
{
  id: 't3-stack',
  name: 'T3 Stack',
  github: 't3-oss/create-t3-app',
  license: 'MIT',
  framework: 'Next.js',
  uiLibrary: 'tailwind',
  intents: ['full-stack', 'saas', 'web-app'],
  tokenExtraction: {
    sources: ['tailwind.config.ts'],
    format: 'tailwind',
  },
  features: [
    'End-to-end type safety',
    'tRPC',
    'Prisma ORM',
    'NextAuth',
    'Modular',
  ],
  bundleSize: '~100kb',
}
```

---

### **E-commerce** (Intent: `ecommerce`)

**7. Medusa Next.js Starter** (31.8k stars, MIT)
```typescript
{
  id: 'medusa-nextjs',
  name: 'Medusa Storefront',
  github: 'medusajs/nextjs-starter-medusa',
  license: 'MIT',
  framework: 'Next.js 15',
  uiLibrary: 'tailwind',
  intents: ['ecommerce', 'storefront'],
  tokenExtraction: {
    sources: ['tailwind.config.js', 'styles/globals.css'],
    format: 'tailwind',
  },
  features: [
    'Headless commerce',
    'Product catalog',
    'Cart & checkout',
    'Medusa backend',
  ],
  bundleSize: '~200kb',
}
```

**8. Vue Storefront** (10.9k stars, MIT)
```typescript
{
  id: 'vue-storefront',
  name: 'Vue Storefront',
  github: 'vuestorefront/vue-storefront',
  license: 'MIT',
  framework: 'Vue.js / React',
  uiLibrary: 'storefront-ui',
  intents: ['ecommerce', 'composable-commerce'],
  tokenExtraction: {
    sources: ['storefront-ui/theme.config.js'],
    format: 'storefront-ui-tokens',
  },
  features: [
    'Headless commerce',
    'Multi-platform',
    'PWA ready',
  ],
  bundleSize: '~150kb',
}
```

---

### **Landing Pages** (Intent: `landing`, `marketing`)

**9. shadcn Landing Page** (Open source, MIT)
```typescript
{
  id: 'shadcn-landing',
  name: 'Shadcn Landing Page',
  github: 'leoMirandaa/shadcn-landing-page',
  license: 'MIT',
  framework: 'Next.js',
  uiLibrary: 'shadcn',
  intents: ['landing', 'marketing', 'saas-marketing'],
  tokenExtraction: {
    sources: ['tailwind.config.ts', 'app/globals.css'],
    format: 'css-variables',
  },
  features: [
    'Hero sections',
    'Pricing tables',
    'Testimonials',
    'CTA blocks',
  ],
  bundleSize: '~80kb',
}
```

**10. Page UI** (Open source)
```typescript
{
  id: 'page-ui',
  name: 'Page UI',
  github: 'danmindru/page-ui',
  license: 'MIT',
  framework: 'React + Next.js',
  uiLibrary: 'radix',
  intents: ['landing', 'high-conversion'],
  tokenExtraction: {
    sources: ['theme.config.ts'],
    format: 'css-variables',
  },
  features: [
    'High-converting components',
    'Unstyled primitives',
    'Themeable',
  ],
  bundleSize: '~50kb',
}
```

---

### **Component Libraries** (Intent: `design-system`)

**11. shadcn/ui** (105k stars, MIT)
```typescript
{
  id: 'shadcn-ui',
  name: 'shadcn/ui',
  github: 'shadcn-ui/ui',
  license: 'MIT',
  framework: 'React',
  uiLibrary: 'shadcn',
  intents: ['design-system', 'components'],
  tokenExtraction: {
    sources: ['registry/default/ui/*.tsx', 'app/globals.css'],
    format: 'css-variables',
  },
  features: [
    '50+ components',
    'Copy-paste',
    'Radix primitives',
    'Tailwind styled',
  ],
  bundleSize: '~45kb per component',
}
```

**12. Tremor** (3.2k stars, Apache 2.0)
```typescript
{
  id: 'tremor',
  name: 'Tremor',
  github: 'tremorlabs/tremor',
  license: 'Apache-2.0',
  framework: 'React',
  uiLibrary: 'tremor',
  intents: ['data-visualization', 'dashboard', 'analytics'],
  tokenExtraction: {
    sources: ['tailwind.config.js'],
    format: 'tailwind',
  },
  features: [
    '35+ dashboard components',
    'Built-in charts',
    'Recharts integration',
  ],
  bundleSize: '~120kb',
}
```

**13. DaisyUI** (40k stars, MIT)
```typescript
{
  id: 'daisyui',
  name: 'DaisyUI',
  github: 'saadeghi/daisyui',
  license: 'MIT',
  framework: 'Framework-agnostic',
  uiLibrary: 'daisyui',
  intents: ['tailwind-components', 'rapid-prototyping'],
  tokenExtraction: {
    sources: ['tailwind.config.js (daisyui themes)'],
    format: 'daisyui-semantic-tokens',
  },
  features: [
    '65+ components',
    'No JavaScript',
    'Themeable',
    '32 themes',
  ],
  bundleSize: '~15kb',
}
```

---

## 🔧 Technical Implementation

### **Phase 1: Template Storage System**

#### 1.1: Template Registry
```typescript
// src/lib/template-registry.ts
export interface TemplateRepo {
  id: string;
  name: string;
  description: string;
  github: string;
  license: string;
  framework: 'Next.js' | 'Vite' | 'Remix' | 'Astro';
  uiLibrary: UILibrary;
  intents: string[];

  // Token extraction configuration
  tokenExtraction: {
    sources: string[];        // File paths to scan
    format: TokenFormat;      // How tokens are stored
    parser: string;           // Parser function name
  };

  // Repository metadata
  stars: number;
  bundleSize: string;
  features: string[];
  demoUrl?: string;

  // Installation
  installation: {
    method: 'git' | 'npm' | 'degit' | 'download';
    command: string;
    postInstall?: string[];
  };
}

export type TokenFormat =
  | 'css-variables'
  | 'tailwind'
  | 'tailwind-v4'
  | 'antd-tokens'
  | 'mui-theme'
  | 'chakra-theme'
  | 'daisyui-semantic-tokens'
  | 'storefront-ui-tokens';

export const TEMPLATE_REGISTRY: TemplateRepo[] = [
  // All templates from above...
];
```

#### 1.2: Template Storage Options

**Option A: Git Submodules** (Best for staying up-to-date)
```bash
# Add template as submodule
git submodule add https://github.com/satnaing/shadcn-admin templates/shadcn-admin

# User customizes tokens
# Export modified template to user's directory
```

**Option B: NPM Package Wrappers** (Best for versioning)
```bash
npm install @ldl-templates/shadcn-admin
# Template stored in node_modules, extracted on demand
```

**Option C: Bundled Snapshots** (Best for offline, fast startup)
```
/templates/
  ├── shadcn-admin/
  │   ├── snapshot.tar.gz
  │   ├── metadata.json
  │   └── tokens.json (pre-extracted)
  ├── ant-design-pro/
  │   ├── snapshot.tar.gz
  │   └── ...
```

**Recommended: Hybrid Approach**
- Bundle top 5 templates as snapshots (offline-first)
- On-demand download for additional templates
- Git submodules for developers who want latest updates

---

### **Phase 2: Token Extraction Engine**

#### 2.1: Parser Functions per Format

**CSS Variables Parser**
```typescript
// src/lib/parsers/css-variables-parser.ts
export function parseCSSVariables(filePath: string): DesignTokens {
  const css = fs.readFileSync(filePath, 'utf-8');

  const tokens: DesignTokens = {
    colors: {},
    spacing: {},
    typography: {},
    radius: {},
    shadows: {},
  };

  // Extract CSS variables
  const variableRegex = /--([a-z-]+):\s*([^;]+);/g;
  let match;

  while ((match = variableRegex.exec(css)) !== null) {
    const [, name, value] = match;

    // Categorize based on naming convention
    if (name.includes('color') || name.includes('bg') || name.includes('text')) {
      tokens.colors[name] = value.trim();
    } else if (name.includes('space') || name.includes('gap')) {
      tokens.spacing[name] = value.trim();
    } else if (name.includes('radius')) {
      tokens.radius[name] = value.trim();
    }
    // ... more categorization
  }

  return tokens;
}
```

**Tailwind Config Parser**
```typescript
// src/lib/parsers/tailwind-parser.ts
export function parseTailwindConfig(filePath: string): DesignTokens {
  // Dynamic import of tailwind.config.js
  const config = require(filePath);

  const tokens: DesignTokens = {
    colors: config.theme?.extend?.colors || config.theme?.colors || {},
    spacing: config.theme?.extend?.spacing || config.theme?.spacing || {},
    fontFamily: config.theme?.extend?.fontFamily || {},
    borderRadius: config.theme?.extend?.borderRadius || {},
    boxShadow: config.theme?.extend?.boxShadow || {},
  };

  return tokens;
}
```

**Ant Design Theme Parser**
```typescript
// src/lib/parsers/antd-parser.ts
export function parseAntdTheme(filePath: string): DesignTokens {
  const themeConfig = require(filePath);

  // Ant Design 5.0+ uses token system
  const antdTokens = themeConfig.token || {};

  return {
    colors: {
      primary: antdTokens.colorPrimary,
      success: antdTokens.colorSuccess,
      warning: antdTokens.colorWarning,
      error: antdTokens.colorError,
      info: antdTokens.colorInfo,
      text: antdTokens.colorText,
      background: antdTokens.colorBgContainer,
    },
    spacing: {
      // Ant Design uses margin/padding multipliers
      xs: `${antdTokens.marginXS}px`,
      sm: `${antdTokens.marginSM}px`,
      md: `${antdTokens.margin}px`,
      lg: `${antdTokens.marginLG}px`,
      xl: `${antdTokens.marginXL}px`,
    },
    radius: {
      sm: `${antdTokens.borderRadiusSM}px`,
      md: `${antdTokens.borderRadius}px`,
      lg: `${antdTokens.borderRadiusLG}px`,
    },
    typography: {
      fontFamily: antdTokens.fontFamily,
      fontSize: `${antdTokens.fontSize}px`,
    },
  };
}
```

**Universal Token Extractor** (Master orchestrator)
```typescript
// src/lib/token-extractor.ts
import { parseCSSVariables } from './parsers/css-variables-parser';
import { parseTailwindConfig } from './parsers/tailwind-parser';
import { parseAntdTheme } from './parsers/antd-parser';
import type { TemplateRepo } from './template-registry';

export async function extractTokensFromTemplate(
  template: TemplateRepo,
  templatePath: string
): Promise<DesignSystem> {
  const { tokenExtraction } = template;

  let tokens: DesignTokens = {};

  // Use appropriate parser based on format
  switch (tokenExtraction.format) {
    case 'css-variables':
      for (const source of tokenExtraction.sources) {
        const filePath = path.join(templatePath, source);
        const extracted = parseCSSVariables(filePath);
        tokens = mergeTokens(tokens, extracted);
      }
      break;

    case 'tailwind':
    case 'tailwind-v4':
      for (const source of tokenExtraction.sources) {
        const filePath = path.join(templatePath, source);
        const extracted = parseTailwindConfig(filePath);
        tokens = mergeTokens(tokens, extracted);
      }
      break;

    case 'antd-tokens':
      for (const source of tokenExtraction.sources) {
        const filePath = path.join(templatePath, source);
        const extracted = parseAntdTheme(filePath);
        tokens = mergeTokens(tokens, extracted);
      }
      break;

    // ... more parsers
  }

  // Create Design System from extracted tokens
  return {
    id: `template-${template.id}`,
    name: `${template.name} Theme`,
    description: `Extracted from ${template.name}`,
    source: 'template-repo',
    sourceRepo: template.github,
    themes: [
      {
        id: 'default',
        name: 'Default',
        ...tokens,
      },
    ],
    intents: template.intents,
    uiLibrary: template.uiLibrary,
  };
}
```

---

### **Phase 3: Token Re-Application Engine**

#### 3.1: Template Transformer

```typescript
// src/lib/template-transformer.ts
export async function applyCustomTokensToTemplate(
  templatePath: string,
  template: TemplateRepo,
  customTokens: DesignTokens
): Promise<string> {
  const outputPath = `/tmp/customized-${template.id}-${Date.now()}`;

  // 1. Copy entire template to output directory
  await fs.copy(templatePath, outputPath);

  // 2. Transform token files based on format
  switch (template.tokenExtraction.format) {
    case 'css-variables':
      await rewriteCSSVariables(outputPath, template, customTokens);
      break;

    case 'tailwind':
    case 'tailwind-v4':
      await rewriteTailwindConfig(outputPath, template, customTokens);
      break;

    case 'antd-tokens':
      await rewriteAntdTheme(outputPath, template, customTokens);
      break;

    // ... more transformers
  }

  // 3. Run post-processing (optional)
  await runPostProcessing(outputPath, template);

  return outputPath;
}

async function rewriteCSSVariables(
  outputPath: string,
  template: TemplateRepo,
  tokens: DesignTokens
) {
  for (const source of template.tokenExtraction.sources) {
    const filePath = path.join(outputPath, source);
    let css = await fs.readFile(filePath, 'utf-8');

    // Replace color variables
    for (const [name, value] of Object.entries(tokens.colors)) {
      const regex = new RegExp(`--${name}:\\s*[^;]+;`, 'g');
      css = css.replace(regex, `--${name}: ${value};`);
    }

    // Replace spacing variables
    for (const [name, value] of Object.entries(tokens.spacing)) {
      const regex = new RegExp(`--${name}:\\s*[^;]+;`, 'g');
      css = css.replace(regex, `--${name}: ${value};`);
    }

    // ... more replacements

    await fs.writeFile(filePath, css);
  }
}

async function rewriteTailwindConfig(
  outputPath: string,
  template: TemplateRepo,
  tokens: DesignTokens
) {
  const configPath = path.join(
    outputPath,
    template.tokenExtraction.sources.find(s => s.includes('tailwind.config'))!
  );

  // Read current config
  let configContent = await fs.readFile(configPath, 'utf-8');

  // Parse as JavaScript object
  const config = eval(`(${configContent})`);

  // Update theme values
  config.theme = config.theme || {};
  config.theme.extend = config.theme.extend || {};
  config.theme.extend.colors = tokens.colors;
  config.theme.extend.spacing = tokens.spacing;
  config.theme.extend.borderRadius = tokens.radius;
  config.theme.extend.fontFamily = {
    sans: [tokens.typography.fontFamily],
    mono: [tokens.typography.fontFamilyMono],
  };

  // Write back as formatted JavaScript
  const newConfig = `export default ${JSON.stringify(config, null, 2)}`;
  await fs.writeFile(configPath, newConfig);
}
```

---

### **Phase 4: Template Browser UI**

#### 4.1: Template Gallery Component

```tsx
// src/components/TemplateBrowser.tsx
import { TEMPLATE_REGISTRY } from '@/lib/template-registry';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TemplateBrowser({ intent }: { intent?: string }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRepo | null>(null);

  // Filter templates by intent
  const templates = intent
    ? TEMPLATE_REGISTRY.filter(t => t.intents.includes(intent))
    : TEMPLATE_REGISTRY;

  const handleImport = async (template: TemplateRepo) => {
    // 1. Download/extract template
    const templatePath = await downloadTemplate(template);

    // 2. Extract tokens
    const designSystem = await extractTokensFromTemplate(template, templatePath);

    // 3. Save to local storage (as hidden layer)
    await saveDesignSystem({
      ...designSystem,
      isTemplate: true,
      templateSource: template.id,
    });

    // 4. Navigate to token editor
    router.push(`/design-tokens?system=${designSystem.id}`);
  };

  return (
    <div className="template-browser">
      <h2>Choose a Template</h2>
      <p>Start with a production-ready template and customize the design tokens</p>

      <div className="grid grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id}>
            <img src={`/templates/${template.id}/preview.png`} alt={template.name} />

            <h3>{template.name}</h3>
            <p>{template.description}</p>

            <div className="badges">
              <Badge>{template.framework}</Badge>
              <Badge>{template.uiLibrary}</Badge>
              <Badge>⭐ {template.stars}</Badge>
            </div>

            <ul className="features">
              {template.features.slice(0, 3).map(feature => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <div className="actions">
              <Button onClick={() => handleImport(template)}>
                Import & Customize
              </Button>
              <Button variant="outline" asChild>
                <a href={`https://github.com/${template.github}`} target="_blank">
                  View on GitHub
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

#### 4.2: Template Customization Flow

```tsx
// User journey after importing a template:

1. [Template Browser] → Select "shadcn-admin"
2. [Loading Screen] → "Extracting design tokens..."
3. [Token Editor] → Shows extracted tokens (colors, spacing, etc.)
4. [User customizes] → Changes primary color, spacing scale, fonts
5. [Preview] → Live preview of admin dashboard with new tokens
6. [Export Options]:
   a. "Download Customized Template" → Full Next.js project
   b. "Save as Design System" → Save tokens for reuse
   c. "Deploy to Vercel" → One-click deployment
```

---

### **Phase 5: Export System**

#### 5.1: Export Customized Template

```typescript
// src/lib/template-exporter.ts
export async function exportCustomizedTemplate(
  templateId: string,
  designSystemId: string
): Promise<string> {
  // 1. Get template and design system
  const template = TEMPLATE_REGISTRY.find(t => t.id === templateId)!;
  const designSystem = getDesignSystem(designSystemId);
  const customTokens = designSystem.themes[0]; // Active theme

  // 2. Get original template path
  const templatePath = getTemplatePath(template);

  // 3. Apply custom tokens to template
  const customizedPath = await applyCustomTokensToTemplate(
    templatePath,
    template,
    customTokens
  );

  // 4. Create downloadable archive
  const zipPath = await createZip(customizedPath, `${template.id}-customized.zip`);

  return zipPath;
}

async function createZip(sourcePath: string, outputName: string): Promise<string> {
  const archiver = require('archiver');
  const output = fs.createWriteStream(`/tmp/${outputName}`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(sourcePath, false);
  await archive.finalize();

  return `/tmp/${outputName}`;
}
```

#### 5.2: One-Click Deploy Integration

```typescript
// src/lib/deploy-integrations.ts
export async function deployToVercel(
  customizedTemplatePath: string,
  projectName: string
) {
  // 1. Create GitHub repo (optional)
  const repo = await createGitHubRepo(projectName);

  // 2. Push customized template to repo
  await pushToGitHub(customizedTemplatePath, repo.url);

  // 3. Trigger Vercel deployment
  const vercelProject = await vercelAPI.createProject({
    name: projectName,
    gitRepository: repo.url,
  });

  return vercelProject.deploymentUrl;
}
```

---

## 🎨 UI/UX Flow

### **Entry Point 1: Empty State**
```
"What do you want to build?"
┌──────────────────────────────────────┐
│ [Admin Dashboard]                    │
│ [SaaS Application]                   │
│ [E-commerce Store]                   │
│ [Landing Page]                       │
│ [Component Library]                  │
└──────────────────────────────────────┘
        ↓
   Template Browser
```

### **Entry Point 2: Design Intent Selection**
```
Selected Intent: "Admin Dashboard"

Recommended Templates:
┌────────────────┬────────────────┬────────────────┐
│ shadcn-admin   │ Ant Design Pro │ TailAdmin      │
│ 10.9k ⭐       │ 37.9k ⭐        │ 1.1k ⭐         │
│ [Import]       │ [Import]       │ [Import]       │
└────────────────┴────────────────┴────────────────┘
```

### **Entry Point 3: Custom Design System**
```
Design System Editor

Source: [Custom] ▼
       ├─ Custom (from scratch)
       ├─ Template: shadcn-admin ✓
       ├─ Template: Ant Design Pro
       └─ Template: ...

[If template selected]
→ Tokens extracted from shadcn-admin
→ Customize below, export modified template when done
```

---

## 📁 File Structure

```
src/
├── lib/
│   ├── template-registry.ts          ← Registry of all templates
│   ├── template-installer.ts         ← Download/install templates
│   ├── token-extractor.ts            ← Extract tokens from templates
│   ├── template-transformer.ts       ← Apply custom tokens to templates
│   ├── template-exporter.ts          ← Export customized templates
│   └── parsers/
│       ├── css-variables-parser.ts
│       ├── tailwind-parser.ts
│       ├── antd-parser.ts
│       ├── mui-parser.ts
│       └── chakra-parser.ts
│
├── components/
│   ├── TemplateBrowser.tsx           ← Template gallery
│   ├── TemplateCard.tsx              ← Template preview card
│   ├── TemplateImportDialog.tsx      ← Import flow
│   ├── TemplateCustomizer.tsx        ← Token customization for templates
│   └── TemplateExportDialog.tsx      ← Export options
│
├── pages/
│   └── templates/
│       ├── index.tsx                 ← Template browser page
│       └── [id].tsx                  ← Template detail page
│
└── templates/                        ← Local template storage
    ├── shadcn-admin/
    │   ├── snapshot.tar.gz
    │   ├── metadata.json
    │   └── tokens.json
    ├── ant-design-pro/
    └── ...
```

---

## 🚀 Implementation Phases

### **Phase 1: Template Storage & Registry (Week 1)**
- ✅ Create template registry with top 5 templates
- ✅ Implement template installer (download/extract)
- ✅ Bundle top 3 templates as offline snapshots

### **Phase 2: Token Extraction (Week 2)**
- ✅ Build CSS variables parser
- ✅ Build Tailwind config parser
- ✅ Build Ant Design theme parser
- ✅ Universal token extractor orchestrator

### **Phase 3: Template Browser UI (Week 2-3)**
- ✅ Template gallery component
- ✅ Template card with preview images
- ✅ Import flow dialog
- ✅ Filter by intent/framework/library

### **Phase 4: Token Re-Application (Week 3-4)**
- ✅ Template transformer
- ✅ CSS variable rewriter
- ✅ Tailwind config rewriter
- ✅ Live preview of customized template

### **Phase 5: Export System (Week 4)**
- ✅ Export as ZIP
- ✅ Export as GitHub repo
- ✅ One-click Vercel deploy
- ✅ Save as custom design system

---

## 💡 Unique Value Propositions

### **For Users**:
1. ✅ **Start with production code** instead of blank slate
2. ✅ **Customize visually** instead of editing config files
3. ✅ **Download complete project** ready to deploy
4. ✅ **No vendor lock-in** (open source templates)
5. ✅ **Learn by example** (see how pros structure projects)

### **For Your Product**:
1. ✅ **Unprecedented offering**: No tool lets you customize entire repos visually
2. ✅ **Lower barrier to entry**: Users get 80% done on day 1
3. ✅ **Viral potential**: "I customized Ant Design Pro in 5 minutes"
4. ✅ **Template marketplace**: Allow community template submissions
5. ✅ **Premium tier**: Advanced templates, one-click deploy, etc.

---

## 🎯 Example User Stories

### **Story 1: Solo Developer**
```
"I need an admin dashboard for my SaaS app but don't want to build from scratch"

1. Opens Living Design Library
2. Selects "Admin Dashboard" intent
3. Sees shadcn-admin, Ant Design Pro, TailAdmin
4. Chooses shadcn-admin
5. App extracts design tokens
6. Changes primary color to brand purple
7. Adjusts spacing to feel more spacious
8. Previews live changes
9. Downloads customized admin dashboard
10. Deploys to Vercel in 1 click
11. Has production-ready admin panel in 15 minutes
```

### **Story 2: Agency**
```
"We build dashboards for 5 different clients, each with their own branding"

1. Import Ant Design Pro once
2. Create 5 design systems from it:
   - "Client A Admin" (blue theme)
   - "Client B Admin" (green theme)
   - "Client C Admin" (dark theme)
   - etc.
3. Each client gets fully customized admin dashboard
4. Save all 5 as templates for future use
5. Agency now has a library of pre-customized dashboards
```

### **Story 3: Designer → Developer Handoff**
```
"Designer creates design system in Figma, developer needs code"

1. Designer exports Figma variables as JSON
2. Developer imports JSON into Living Design Library
3. Chooses "shadcn-admin" as base template
4. App applies Figma tokens to shadcn-admin
5. Developer downloads customized template
6. Zero manual theming needed - everything matches Figma
```

---

## 🔥 Next Steps

**Ready to build this?** I recommend:

### **Quick Win (2 weeks)**:
1. Implement template registry with 3 templates (shadcn-admin, Ant Design Pro, shadcn/ui)
2. Build CSS variables + Tailwind parsers
3. Create template browser UI
4. Enable export as ZIP

**Result**: Users can import shadcn-admin, customize tokens, export customized dashboard!

### **Full System (4-6 weeks)**:
1. Everything in Quick Win
2. Add 10+ more templates
3. Build all parsers (Ant Design, MUI, Chakra, etc.)
4. Token re-application engine
5. One-click deploy integrations
6. Template marketplace

**Result**: Complete "hidden layer" template system with visual customization!

---

**This is REVOLUTIONARY.** No design tool does this. You're not just building a design system manager - you're building a **template customization platform** that happens to use design systems as the abstraction layer.

Shall I start building Phase 1?
