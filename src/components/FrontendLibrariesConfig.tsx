/**
 * Front-End Libraries Configuration
 *
 * Browse, import, and customize complete front-end template repositories.
 * Extracts design tokens from templates and allows visual customization.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Download,
  Star,
  GitFork,
  ExternalLink,
  Palette,
  Code2,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Package,
  Layers,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// =============================================================================
// Template Types & Registry
// =============================================================================

interface FrontendTemplate {
  id: string;
  name: string;
  description: string;
  category: 'admin' | 'saas' | 'ecommerce' | 'landing' | 'components' | 'mobile';
  github: string;
  stars: string;
  license: string;
  framework: string;
  uiLibrary: string;
  features: string[];
  preview?: string;
  demoUrl?: string;
  screenshots?: string[];
  bundleSize: string;
  status: 'available' | 'coming-soon' | 'installed';
}

const FRONTEND_TEMPLATES: FrontendTemplate[] = [
  // Admin Dashboards
  {
    id: 'shadcn-admin',
    name: 'shadcn Admin Dashboard',
    description: 'Modern admin dashboard with 10+ pages, dark mode, and global search',
    category: 'admin',
    github: 'satnaing/shadcn-admin',
    stars: '10.9k',
    license: 'MIT',
    framework: 'Vite + React',
    uiLibrary: 'shadcn/ui',
    features: ['10+ pages', 'Dark mode', 'RTL support', 'Global search', 'Auth layouts'],
    demoUrl: 'https://shadcn-admin.netlify.app',
    bundleSize: '~150kb',
    status: 'available',
  },
  {
    id: 'next-shadcn-dashboard',
    name: 'Next.js Shadcn Dashboard',
    description: 'Enterprise dashboard with RBAC, multi-tenancy, and billing integration',
    category: 'admin',
    github: 'Kiranism/next-shadcn-dashboard-starter',
    stars: '5.9k',
    license: 'MIT',
    framework: 'Next.js 16',
    uiLibrary: 'shadcn/ui',
    features: ['RBAC', 'TanStack tables', 'Clerk auth', 'Multi-tenant', 'Stripe billing'],
    bundleSize: '~200kb',
    status: 'available',
  },
  {
    id: 'ant-design-pro',
    name: 'Ant Design Pro',
    description: 'Enterprise-grade admin solution with comprehensive features',
    category: 'admin',
    github: 'ant-design/ant-design-pro',
    stars: '37.9k',
    license: 'MIT',
    framework: 'Umi + React',
    uiLibrary: 'Ant Design',
    features: ['Enterprise-grade', 'Complex forms', 'i18n', 'Authorization', 'Mock data'],
    demoUrl: 'https://preview.pro.ant.design',
    bundleSize: '~520kb',
    status: 'available',
  },
  {
    id: 'tailadmin',
    name: 'TailAdmin Dashboard',
    description: '7 unique dashboards for analytics, ecommerce, CRM, and more',
    category: 'admin',
    github: 'TailAdmin/free-react-tailwind-admin-dashboard',
    stars: '1.1k',
    license: 'MIT',
    framework: 'React 19 + Vite',
    uiLibrary: 'Tailwind CSS',
    features: ['7 dashboards', '35+ components', 'Dark mode', 'Charts'],
    bundleSize: '~180kb',
    status: 'available',
  },

  // SaaS Starters
  {
    id: 'boxyhq-saas',
    name: 'BoxyHQ SaaS Starter',
    description: 'Enterprise SaaS with SAML SSO, Directory Sync, and Stripe billing',
    category: 'saas',
    github: 'boxyhq/saas-starter-kit',
    stars: '4.7k',
    license: 'Apache-2.0',
    framework: 'Next.js',
    uiLibrary: 'Headless UI',
    features: ['SAML SSO', 'Directory Sync', 'Stripe', 'Team management', 'Audit logs'],
    bundleSize: '~250kb',
    status: 'available',
  },
  {
    id: 't3-stack',
    name: 'T3 Stack',
    description: 'Type-safe full-stack with tRPC, Prisma, and NextAuth',
    category: 'saas',
    github: 't3-oss/create-t3-app',
    stars: '28.5k',
    license: 'MIT',
    framework: 'Next.js',
    uiLibrary: 'Tailwind CSS',
    features: ['End-to-end type safety', 'tRPC', 'Prisma ORM', 'NextAuth', 'Modular'],
    bundleSize: '~100kb',
    status: 'available',
  },

  // E-commerce
  {
    id: 'medusa-nextjs',
    name: 'Medusa Storefront',
    description: 'Headless e-commerce storefront with Medusa backend',
    category: 'ecommerce',
    github: 'medusajs/nextjs-starter-medusa',
    stars: '31.8k',
    license: 'MIT',
    framework: 'Next.js 15',
    uiLibrary: 'Tailwind CSS',
    features: ['Headless commerce', 'Product catalog', 'Cart & checkout', 'Medusa backend'],
    bundleSize: '~200kb',
    status: 'available',
  },

  // Landing Pages
  {
    id: 'shadcn-landing',
    name: 'Shadcn Landing Page',
    description: 'Modern landing page with hero, pricing, and testimonials',
    category: 'landing',
    github: 'leoMirandaa/shadcn-landing-page',
    stars: '2.5k',
    license: 'MIT',
    framework: 'Next.js',
    uiLibrary: 'shadcn/ui',
    features: ['Hero sections', 'Pricing tables', 'Testimonials', 'CTA blocks'],
    demoUrl: 'https://shadcn-landing-page.vercel.app',
    bundleSize: '~80kb',
    status: 'available',
  },
  {
    id: 'page-ui',
    name: 'Page UI',
    description: 'High-converting landing page components',
    category: 'landing',
    github: 'danmindru/page-ui',
    stars: '1.8k',
    license: 'MIT',
    framework: 'React + Next.js',
    uiLibrary: 'Radix UI',
    features: ['High-converting', 'Unstyled primitives', 'Themeable', 'Accessible'],
    bundleSize: '~50kb',
    status: 'available',
  },

  // Component Libraries
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    description: 'The foundational component library - copy-paste components',
    category: 'components',
    github: 'shadcn-ui/ui',
    stars: '105k',
    license: 'MIT',
    framework: 'React',
    uiLibrary: 'shadcn/ui',
    features: ['50+ components', 'Copy-paste', 'Radix primitives', 'Tailwind styled'],
    demoUrl: 'https://ui.shadcn.com',
    bundleSize: '~45kb per component',
    status: 'available',
  },
  {
    id: 'tremor',
    name: 'Tremor',
    description: 'Dashboard and data visualization component library',
    category: 'components',
    github: 'tremorlabs/tremor',
    stars: '3.2k',
    license: 'Apache-2.0',
    framework: 'React',
    uiLibrary: 'Tremor',
    features: ['35+ dashboard components', 'Built-in charts', 'Recharts integration'],
    bundleSize: '~120kb',
    status: 'available',
  },
  {
    id: 'daisyui',
    name: 'DaisyUI',
    description: 'Tailwind CSS component library with 65+ components',
    category: 'components',
    github: 'saadeghi/daisyui',
    stars: '40k',
    license: 'MIT',
    framework: 'Framework-agnostic',
    uiLibrary: 'DaisyUI',
    features: ['65+ components', 'No JavaScript', '32 themes', 'Semantic tokens'],
    bundleSize: '~15kb',
    status: 'available',
  },
];

// =============================================================================
// Component
// =============================================================================

export function FrontendLibrariesConfig() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<FrontendTemplate | null>(null);

  // Filter templates
  const filteredTemplates = FRONTEND_TEMPLATES.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleImport = (template: FrontendTemplate) => {
    try {
      // Validate template has required fields
      if (!template.id || !template.name) {
        toast.error('Invalid template data');
        console.error('Template missing required fields:', template);
        return;
      }

      // Store template selection for the Design System Builder
      const templateData = {
        id: template.id,
        name: template.name,
        description: template.description || '',
        github: template.github || '',
        uiLibrary: template.uiLibrary || '',
        framework: template.framework || '',
        demoUrl: template.demoUrl || '',
      };

      localStorage.setItem('ldl-selected-template', JSON.stringify(templateData));

      toast.success(`Ready to customize ${template.name}!`, {
        description: 'Opening Design System Builder...',
      });

      // Navigate to Design System Builder
      window.location.hash = '#design-system-builder';
    } catch (error) {
      console.error('Failed to store template selection:', error);
      toast.error('Failed to import template', {
        description: 'Please try again or check your browser storage.',
      });
    }
  };

  const categories = [
    { id: 'all', label: 'All Templates', icon: Layers },
    { id: 'admin', label: 'Admin Dashboards', icon: Package },
    { id: 'saas', label: 'SaaS Starters', icon: Zap },
    { id: 'ecommerce', label: 'E-commerce', icon: Package },
    { id: 'landing', label: 'Landing Pages', icon: Sparkles },
    { id: 'components', label: 'Component Libraries', icon: Code2 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Front-End Libraries</h1>
        <p className="text-muted-foreground">
          Import complete front-end templates, extract design tokens, and customize them visually.
        </p>
      </div>

      {/* Hero CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Start with Production-Ready Templates
          </CardTitle>
          <CardDescription>
            Import entire front-end repositories (admin dashboards, SaaS starters, e-commerce stores),
            extract their design tokens, customize them visually, and export a fully themed template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Download className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">1. Import Template</h4>
                <p className="text-xs text-muted-foreground">
                  Choose from 10+ open-source templates
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Palette className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">2. Customize Tokens</h4>
                <p className="text-xs text-muted-foreground">
                  Visually edit colors, spacing, typography
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">3. Export & Deploy</h4>
                <p className="text-xs text-muted-foreground">
                  Download customized template or deploy instantly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {cat.label.split(' ')[0]}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {template.stars}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {template.framework}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {template.uiLibrary}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.license}
                </Badge>
              </div>

              {/* Features */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Key Features</Label>
                <ul className="space-y-1">
                  {template.features.slice(0, 3).map(feature => (
                    <li key={feature} className="text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bundle Size */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Bundle size: <span className="font-medium text-foreground">{template.bundleSize}</span>
                </p>
              </div>
            </CardContent>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2">
              {template.status === 'available' ? (
                <>
                  <Button
                    className="w-full"
                    onClick={() => handleImport(template)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Import & Customize
                  </Button>
                  {template.demoUrl && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Demo
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={`https://github.com/${template.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitFork className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            The hidden layer architecture behind front-end library integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold mb-2">🔍 Token Extraction</h4>
              <p className="text-xs text-muted-foreground">
                Automatically scans template repositories to extract design tokens from
                Tailwind configs, CSS variables, theme files, and component styles.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">🎨 Visual Customization</h4>
              <p className="text-xs text-muted-foreground">
                Use the visual token editor to customize colors, spacing, typography, and more.
                See changes in real-time with live preview.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">🔄 Token Re-application</h4>
              <p className="text-xs text-muted-foreground">
                Customized tokens are automatically re-applied throughout the template,
                updating all config files and styles while preserving structure.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">📦 Complete Export</h4>
              <p className="text-xs text-muted-foreground">
                Export the fully customized template as a complete project ready for deployment.
                Includes all original features with your design tokens applied.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" asChild>
              <a href="https://github.com/your-repo/TEMPLATE_REPO_INTEGRATION.md" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Full Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
