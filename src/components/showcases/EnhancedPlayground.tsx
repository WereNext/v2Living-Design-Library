import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Copy, Check, Eye, Code2, Download, Heart, Share2, Bookmark, ShoppingCart } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateReactComponent,
  generateVueComponent,
  generateSvelteComponent,
  generateHTMLComponent,
  generateCSS,
  generateJSONTokens,
  generateSCSSVariables,
  generateAngularComponent,
} from '../../lib/code-generators';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Progress } from '../ui/progress';

type Framework = 'css' | 'tailwind' | 'react' | 'vue' | 'svelte' | 'html' | 'json' | 'scss' | 'angular';
type ViewMode = 'code' | 'preview';
type ComponentType = 'buttons' | 'cards' | 'forms' | 'badges' | 'inputs' | 'sliders' | 'layout';

export function EnhancedPlayground() {
  const { activeTheme, activeSystem } = useAppState();
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('buttons');
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCode = (): { code: string; language: string; filename: string } => {
    if (!activeTheme) {
      return { 
        code: '// No active theme selected\n// Please select a design system and theme to generate code', 
        language: 'javascript',
        filename: 'example.js'
      };
    }

    switch (selectedFramework) {
      case 'css':
        return { 
          code: generateCSSVariables(activeTheme), 
          language: 'css',
          filename: 'variables.css'
        };
      case 'tailwind':
        return { 
          code: generateTailwindConfig(activeTheme), 
          language: 'javascript',
          filename: 'tailwind.config.js'
        };
      case 'react':
        return { 
          code: generateReactComponent(activeTheme), 
          language: 'tsx',
          filename: 'Button.tsx'
        };
      case 'vue':
        return { 
          code: generateVueComponent(activeTheme), 
          language: 'vue',
          filename: 'Button.vue'
        };
      case 'svelte':
        return { 
          code: generateSvelteComponent(activeTheme), 
          language: 'svelte',
          filename: 'Button.svelte'
        };
      case 'html':
        return { 
          code: generateHTMLComponent(activeTheme), 
          language: 'html',
          filename: 'index.html'
        };
      case 'json':
        return { 
          code: generateJSONTokens(activeTheme), 
          language: 'json',
          filename: 'tokens.json'
        };
      case 'scss':
        return { 
          code: generateSCSSVariables(activeTheme), 
          language: 'scss',
          filename: 'variables.scss'
        };
      case 'angular':
        return { 
          code: generateAngularComponent(activeTheme), 
          language: 'typescript',
          filename: 'button.component.ts'
        };
      default:
        return { 
          code: '', 
          language: 'javascript',
          filename: 'example.js'
        };
    }
  };

  const { code, language, filename } = getCode();

  const frameworks: { id: Framework; label: string; description: string }[] = [
    { id: 'react', label: 'React', description: 'React components with CSS vars' },
    { id: 'vue', label: 'Vue', description: 'Vue 3 composition API' },
    { id: 'svelte', label: 'Svelte', description: 'Svelte components' },
    { id: 'angular', label: 'Angular', description: 'Angular components' },
    { id: 'css', label: 'CSS Variables', description: 'Native CSS custom properties' },
    { id: 'tailwind', label: 'Tailwind', description: 'Tailwind config' },
    { id: 'scss', label: 'SCSS', description: 'SCSS variables' },
    { id: 'html', label: 'HTML/CSS', description: 'Plain HTML & CSS' },
    { id: 'json', label: 'JSON', description: 'Design tokens as JSON' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Code Playground</h2>
            <p className="text-muted-foreground">
              Generate production-ready code from your design system
            </p>
          </div>
          {activeTheme && (
            <div className="text-right">
              <Badge variant="outline" className="mb-1">
                {activeSystem?.name}
              </Badge>
              <p className="text-sm text-muted-foreground">{activeTheme.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Framework Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Select Framework</h3>
        <div className="grid grid-cols-3 gap-2">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => setSelectedFramework(framework.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedFramework === framework.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="font-medium text-sm">{framework.label}</div>
              <div className="text-xs text-muted-foreground">{framework.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Component Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Select Component Type</h3>
        <Select value={selectedComponent} onValueChange={(value) => setSelectedComponent(value as ComponentType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buttons">Buttons & Actions</SelectItem>
            <SelectItem value="cards">Cards & Containers</SelectItem>
            <SelectItem value="forms">Forms & Inputs</SelectItem>
            <SelectItem value="badges">Badges & Pills</SelectItem>
            <SelectItem value="inputs">Interactive Inputs</SelectItem>
            <SelectItem value="sliders">Sliders & Progress</SelectItem>
            <SelectItem value="layout">Layout Components</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'code' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('code')}
        >
          <Code2 className="w-4 h-4 mr-2" />
          Code
        </Button>
        <Button
          variant={viewMode === 'preview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('preview')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Code Display */}
      {viewMode === 'code' && (
        <div className="relative">
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(code, filename)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy(code)}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-muted rounded-lg p-6 overflow-x-auto border">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      )}

      {/* Live Preview */}
      {viewMode === 'preview' && activeTheme && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Live Component Preview</h3>
          <LivePreview theme={activeTheme} componentType={selectedComponent} />
        </div>
      )}

      {/* Token Summary */}
      {activeTheme && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Design Token Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTheme.colors ? Object.keys(activeTheme.colors).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Colors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTheme.typography ? Object.keys(activeTheme.typography).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Typography</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTheme.spacing ? Object.keys(activeTheme.spacing).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Spacing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTheme.borderRadius ? Object.keys(activeTheme.borderRadius).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Radius</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTheme.shadows ? Object.keys(activeTheme.shadows).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Shadows</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Live Preview Component
function LivePreview({ theme, componentType }: { theme: any; componentType: ComponentType }) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(65);
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  
  return (
    <div className="border rounded-lg p-8 space-y-6 bg-background">
      {/* Buttons */}
      {componentType === 'buttons' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Interactive Buttons</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast.success('Primary button clicked!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
                boxShadow: theme.shadows?.['shadow-sm'] || 'none',
              }}
            >
              Primary Button
            </button>
            <button
              onClick={() => toast.success('Secondary button clicked!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: theme.colors?.['secondary'] ? `hsl(${theme.colors['secondary']})` : '#666',
                color: theme.colors?.['secondary-foreground'] ? `hsl(${theme.colors['secondary-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
                boxShadow: theme.shadows?.['shadow-sm'] || 'none',
              }}
            >
              Secondary Button
            </button>
            <button
              onClick={() => toast.info('Outline button clicked!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 border-2"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                borderColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              Outline Button
            </button>
            <button
              onClick={() => toast.error('Destructive action!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: theme.colors?.['destructive'] ? `hsl(${theme.colors['destructive']})` : '#ef4444',
                color: theme.colors?.['destructive-foreground'] ? `hsl(${theme.colors['destructive-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
                boxShadow: theme.shadows?.['shadow-sm'] || 'none',
              }}
            >
              Destructive
            </button>
          </div>
          
          <h4 className="text-sm font-medium text-muted-foreground mt-6">Icon Buttons</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast('Liked! ❤️')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              <Heart className="w-4 h-4" />
              Like
            </button>
            <button
              onClick={() => toast('Shared!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 border-2"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => toast('Bookmarked!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: theme.colors?.['secondary'] ? `hsl(${theme.colors['secondary']})` : '#666',
                color: theme.colors?.['secondary-foreground'] ? `hsl(${theme.colors['secondary-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              <Bookmark className="w-4 h-4" />
              Bookmark
            </button>
            <button
              onClick={() => toast('Added to cart!')}
              className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 border-2"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                borderColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      {componentType === 'cards' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Interactive Cards</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="p-6 rounded-lg border transition-shadow hover:shadow-md"
              style={{
                backgroundColor: theme.colors?.['card'] ? `hsl(${theme.colors['card']})` : '#fff',
                color: theme.colors?.['card-foreground'] ? `hsl(${theme.colors['card-foreground']})` : '#000',
                borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-lg'] || '0.75rem',
                boxShadow: theme.shadows?.['shadow-sm'] || 'none',
              }}
            >
              <h3 className="font-semibold mb-2">Card Title</h3>
              <p
                className="text-sm mb-4"
                style={{
                  color: theme.colors?.['muted-foreground'] ? `hsl(${theme.colors['muted-foreground']})` : '#666',
                }}
              >
                This card uses your design system tokens for consistent styling.
              </p>
              <button
                onClick={() => toast.success('Learn More clicked!')}
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                  color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
                  borderRadius: theme.borderRadius?.['radius-sm'] || '0.375rem',
                }}
              >
                Learn More
              </button>
            </div>

            <div
              className="p-6 rounded-lg border transition-shadow hover:shadow-md"
              style={{
                backgroundColor: theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#f5f5f5',
                color: theme.colors?.['muted-foreground'] ? `hsl(${theme.colors['muted-foreground']})` : '#666',
                borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-lg'] || '0.75rem',
              }}
            >
              <h3 className="font-semibold mb-2">Muted Card</h3>
              <p className="text-sm mb-4">
                Alternate card style with muted background for visual hierarchy.
              </p>
              <button
                onClick={() => toast.info('Learn More clicked!')}
                className="px-3 py-1.5 text-sm rounded-md font-medium border-2 transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                  borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                  borderRadius: theme.borderRadius?.['radius-sm'] || '0.375rem',
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {componentType === 'forms' && (
        <div className="space-y-6 max-w-md">
          <h4 className="text-sm font-medium text-muted-foreground">Interactive Form Elements</h4>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  toast(e.target.checked ? 'Checked!' : 'Unchecked!');
                }}
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                }}
              />
              <label className="text-sm cursor-pointer" onClick={() => setIsChecked(!isChecked)}>
                Accept terms and conditions
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Enable notifications</label>
              <button
                onClick={() => {
                  setIsSwitchOn(!isSwitchOn);
                  toast(isSwitchOn ? 'Turned off' : 'Turned on');
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: isSwitchOn 
                    ? (theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000')
                    : (theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5'),
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{
                    transform: isSwitchOn ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                  }}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                onFocus={() => toast.info('Email input focused')}
                className="w-full px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
                style={{
                  backgroundColor: theme.colors?.['background'] ? `hsl(${theme.colors['background']})` : '#fff',
                  color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                  borderColor: theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5',
                  borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
                }}
              />
            </div>

            <button
              onClick={() => toast.success('Form submitted!')}
              className="w-full px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            >
              Submit Form
            </button>
          </div>
        </div>
      )}

      {/* Badges */}
      {componentType === 'badges' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Badge Variants</h4>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
              }}
            >
              Primary
            </span>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: theme.colors?.['secondary'] ? `hsl(${theme.colors['secondary']})` : '#666',
                color: theme.colors?.['secondary-foreground'] ? `hsl(${theme.colors['secondary-foreground']})` : '#fff',
              }}
            >
              Secondary
            </span>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full border"
              style={{
                backgroundColor: 'transparent',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
              }}
            >
              Outline
            </span>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: theme.colors?.['destructive'] ? `hsl(${theme.colors['destructive']})` : '#ef4444',
                color: theme.colors?.['destructive-foreground'] ? `hsl(${theme.colors['destructive-foreground']})` : '#fff',
              }}
            >
              Destructive
            </span>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: theme.colors?.['accent'] ? `hsl(${theme.colors['accent']})` : '#f1f5f9',
                color: theme.colors?.['accent-foreground'] ? `hsl(${theme.colors['accent-foreground']})` : '#000',
              }}
            >
              Accent
            </span>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#f5f5f5',
                color: theme.colors?.['muted-foreground'] ? `hsl(${theme.colors['muted-foreground']})` : '#666',
              }}
            >
              Muted
            </span>
          </div>
          
          <h4 className="text-sm font-medium text-muted-foreground mt-6">Status Badges</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
              ✓ Success
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500 text-white">
              ⚠ Warning
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
              ✕ Error
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500 text-white">
              ℹ Info
            </span>
          </div>
        </div>
      )}

      {/* Interactive Inputs */}
      {componentType === 'inputs' && (
        <div className="space-y-4 max-w-md">
          <h4 className="text-sm font-medium text-muted-foreground">Text Inputs</h4>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Enter text..."
              onFocus={() => toast.info('Text input focused')}
              className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
              style={{
                backgroundColor: theme.colors?.['background'] ? `hsl(${theme.colors['background']})` : '#fff',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            />
            <input
              type="email"
              placeholder="Email address..."
              onFocus={() => toast.info('Email input focused')}
              className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
              style={{
                backgroundColor: theme.colors?.['background'] ? `hsl(${theme.colors['background']})` : '#fff',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            />
            <input
              type="password"
              placeholder="Password..."
              onFocus={() => toast.info('Password input focused')}
              className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors"
              style={{
                backgroundColor: theme.colors?.['background'] ? `hsl(${theme.colors['background']})` : '#fff',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            />
            <textarea
              placeholder="Enter a longer message..."
              rows={4}
              onFocus={() => toast.info('Textarea focused')}
              className="px-3 py-2 rounded-md border-2 outline-none focus:border-primary transition-colors resize-none"
              style={{
                backgroundColor: theme.colors?.['background'] ? `hsl(${theme.colors['background']})` : '#fff',
                color: theme.colors?.['foreground'] ? `hsl(${theme.colors['foreground']})` : '#000',
                borderColor: theme.colors?.['input'] ? `hsl(${theme.colors['input']})` : '#e5e5e5',
                borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
              }}
            />
          </div>
        </div>
      )}

      {/* Sliders & Progress */}
      {componentType === 'sliders' && (
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Volume Slider</h4>
              <span className="text-sm font-medium">{sliderValue[0]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue[0]}
              onChange={(e) => {
                setSliderValue([parseInt(e.target.value)]);
                toast.info(`Volume: ${e.target.value}%`);
              }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000'} 0%, ${theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000'} ${sliderValue[0]}%, ${theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#e5e5e5'} ${sliderValue[0]}%, ${theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#e5e5e5'} 100%)`,
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Upload Progress</h4>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{
                backgroundColor: theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#e5e5e5',
              }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newProgress = Math.min(progress + 10, 100);
                  setProgress(newProgress);
                  toast.success(`Progress: ${newProgress}%`);
                }}
                className="px-3 py-1 text-sm rounded-md"
                style={{
                  backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000',
                  color: theme.colors?.['primary-foreground'] ? `hsl(${theme.colors['primary-foreground']})` : '#fff',
                }}
              >
                +10%
              </button>
              <button
                onClick={() => {
                  const newProgress = Math.max(progress - 10, 0);
                  setProgress(newProgress);
                  toast.info(`Progress: ${newProgress}%`);
                }}
                className="px-3 py-1 text-sm rounded-md border"
                style={{
                  borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                }}
              >
                -10%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout Components */}
      {componentType === 'layout' && (
        <div className="space-y-6">
          <h4 className="text-sm font-medium text-muted-foreground">Layout Grid</h4>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="p-6 rounded-lg border flex items-center justify-center"
                style={{
                  backgroundColor: theme.colors?.['card'] ? `hsl(${theme.colors['card']})` : '#fff',
                  borderColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5',
                  borderRadius: theme.borderRadius?.['radius-md'] || '0.5rem',
                }}
              >
                <span className="text-sm font-medium">Item {item}</span>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-medium text-muted-foreground mt-6">Dividers</h4>
          <div className="space-y-4">
            <div className="h-px" style={{ backgroundColor: theme.colors?.['border'] ? `hsl(${theme.colors['border']})` : '#e5e5e5' }} />
            <div className="h-0.5" style={{ backgroundColor: theme.colors?.['primary'] ? `hsl(${theme.colors['primary']})` : '#000' }} />
            <div className="h-1" style={{ backgroundColor: theme.colors?.['muted'] ? `hsl(${theme.colors['muted']})` : '#f5f5f5' }} />
          </div>
        </div>
      )}
    </div>
  );
}