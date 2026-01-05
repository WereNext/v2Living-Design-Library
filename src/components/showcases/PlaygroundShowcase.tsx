import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Sparkles, Code2, Download, Copy, Check, Heart, Share2, Bookmark, ShoppingCart, AlertCircle, Info, CheckCircle2, XCircle, Mail, Lock, Search, Target } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cn } from "../ui/utils";

interface Component {
  id: string;
  name: string;
  category: string;
  code: string;
  preview: React.ReactNode;
}

interface PlaygroundShowcaseProps {
  designIntent?: string;
  onDesignIntentChange?: (intent: string) => void;
  availableIntents?: Array<{ value: string; label: string }>;
}

export function PlaygroundShowcase({ 
  designIntent = "web-app",
  onDesignIntentChange,
  availableIntents = [
    { value: "web-app", label: "Web App" },
    { value: "marketing", label: "Marketing Site" },
    { value: "dashboard", label: "Dashboard" },
    { value: "ecommerce", label: "E-Commerce" },
  ]
}: PlaygroundShowcaseProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(60);
  const [selectedComponent, setSelectedComponent] = useState("button-variants");
  const [copied, setCopied] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("react");

  const features = [
    "Unlimited projects",
    "Advanced analytics", 
    "24/7 support",
    "Custom domain",
    "API access"
  ];

  const components: Component[] = [
    {
      id: "button-variants",
      name: "Button Variants",
      category: "Buttons",
      code: `import { Button } from "./components/ui/button";
import { toast } from "sonner@2.0.3";

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast.success("Clicked!")}>
        Default
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`,
      preview: (
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast.success("Default button clicked!")}>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      )
    },
    {
      id: "button-sizes",
      name: "Button Sizes",
      category: "Buttons",
      code: `import { Button } from "./components/ui/button";

export function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`,
      preview: (
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      )
    },
    {
      id: "icon-buttons",
      name: "Icon Buttons",
      category: "Buttons",
      code: `import { Button } from "./components/ui/button";
import { Heart, Share2, Bookmark, ShoppingCart } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function IconButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast("Liked!")}>
        <Heart className="mr-2 h-4 w-4" />
        Like
      </Button>
      <Button variant="outline" onClick={() => toast("Shared!")}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="secondary">
        <Bookmark className="mr-2 h-4 w-4" />
        Bookmark
      </Button>
      <Button variant="outline">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}`,
      preview: (
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast("Liked!")}>
            <Heart className="mr-2 h-4 w-4" />
            Like
          </Button>
          <Button variant="outline" onClick={() => toast("Shared!")}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="secondary" onClick={() => toast("Bookmarked!")}>
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmark
          </Button>
          <Button variant="outline" onClick={() => toast("Added to cart!")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      )
    },
    {
      id: "text-inputs",
      name: "Text Inputs",
      category: "Forms",
      code: `import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Mail, Lock, Search } from "lucide-react";

export function TextInputs() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search" 
            placeholder="Search..." 
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}`,
      preview: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="demo-email" 
                type="email" 
                placeholder="you@example.com" 
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="demo-password" 
                type="password" 
                placeholder="••••••••" 
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="demo-search" 
                placeholder="Search..." 
                className="pl-9"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "checkboxes-switches",
      name: "Checkboxes & Switches",
      category: "Forms",
      code: `import { Checkbox } from "./components/ui/checkbox";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";

export function CheckboxesSwitches() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="cursor-pointer">
          Send me marketing emails
        </Label>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">
          Enable notifications
        </Label>
        <Switch id="notifications" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark mode</Label>
        <Switch id="dark-mode" />
      </div>
    </div>
  );
}`,
      preview: (
        <div className="space-y-4 max-w-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="demo-terms" />
            <Label htmlFor="demo-terms" className="cursor-pointer">
              Accept terms and conditions
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="demo-marketing" />
            <Label htmlFor="demo-marketing" className="cursor-pointer">
              Send me marketing emails
            </Label>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="demo-notifications">Enable notifications</Label>
            <Switch id="demo-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="demo-dark-mode">Dark mode</Label>
            <Switch id="demo-dark-mode" />
          </div>
        </div>
      )
    },
    {
      id: "select-radio",
      name: "Select & Radio",
      category: "Forms",
      code: `import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

export function SelectRadio() {
  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label>Select Framework</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Choose Plan</Label>
        <RadioGroup defaultValue="pro">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer">
              Free
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro" className="cursor-pointer">
              Pro - $29/month
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise" className="cursor-pointer">
              Enterprise
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}`,
      preview: (
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Select Framework</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Choose Plan</Label>
            <RadioGroup defaultValue="pro">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="demo-free" />
                <Label htmlFor="demo-free" className="cursor-pointer">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="demo-pro" />
                <Label htmlFor="demo-pro" className="cursor-pointer">Pro - $29/month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="demo-enterprise" />
                <Label htmlFor="demo-enterprise" className="cursor-pointer">Enterprise</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    },
    {
      id: "pricing-card",
      name: "Pricing Card",
      category: "Cards",
      code: `import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export function PricingCard() {
  const features = [
    "Unlimited projects",
    "Advanced analytics",
    "24/7 support",
    "Custom domain",
    "API access"
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Pro Plan</CardTitle>
          <Badge>Popular</Badge>
        </div>
        <CardDescription>
          Perfect for growing teams
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl">$29</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full" size="lg">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}`,
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Pro Plan</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>Perfect for growing teams</CardDescription>
            <div className="mt-4">
              <span className="text-4xl">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg" onClick={() => toast.success("Subscribed to Pro!")}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: "stats-cards",
      name: "Stats Cards",
      category: "Cards",
      code: `import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export function StatsCards() {
  const stats = [
    { title: "Total Revenue", value: "$45,231", change: "+20.1%", emoji: "💰" },
    { title: "Active Users", value: "2,350", change: "+15.3%", emoji: "👥" },
    { title: "Total Orders", value: "1,234", change: "+8.2%", emoji: "🛒" },
    { title: "Growth Rate", value: "24.5%", change: "+4.1%", emoji: "📈" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{stat.title}</CardTitle>
            <span className="text-2xl">{stat.emoji}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`,
      preview: (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">$45,231</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Users</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">2,350</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "alerts",
      name: "Alert Variants",
      category: "Feedback",
      code: `import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react";

export function Alerts() {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components using the CLI.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>

      <Alert className="border-green-600 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-600 text-yellow-600">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action cannot be undone.
        </AlertDescription>
      </Alert>
    </div>
  );
}`,
      preview: (
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>

          <Alert className="border-green-600 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-600 text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone. Please proceed with caution.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "tabs",
      name: "Tabs",
      category: "Layout",
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-2xl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              View your account overview and recent activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your dashboard shows real-time data and insights.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Deep dive into your performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track user engagement and conversion rates.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and download custom reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Export your data in multiple formats.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}`,
      preview: (
        <Tabs defaultValue="overview" className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  View your account overview and recent activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your dashboard shows real-time data and insights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Deep dive into your performance metrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track user engagement and conversion rates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and download custom reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export your data in multiple formats.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )
    },
    {
      id: "slider-progress",
      name: "Slider & Progress",
      category: "Data Display",
      code: `import { Slider } from "./components/ui/slider";
import { Progress } from "./components/ui/progress";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { useState } from "react";

export function SliderProgress() {
  const [value, setValue] = useState([50]);

  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label>Volume: {value[0]}%</Label>
        <Slider 
          value={value} 
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Upload Progress</Label>
        <Progress value={60} />
        <p className="text-xs text-muted-foreground">
          60% complete
        </p>
      </div>

      <div className="space-y-2">
        <Label>Processing</Label>
        <Progress value={33} />
        <p className="text-xs text-muted-foreground">
          33% complete
        </p>
      </div>
    </div>
  );
}`,
      preview: (
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Volume: {sliderValue[0]}%</Label>
            <Slider 
              value={sliderValue} 
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>

          <div className="space-y-2">
            <Label>Processing</Label>
            <Progress value={33} />
            <p className="text-xs text-muted-foreground">33% complete</p>
          </div>
        </div>
      )
    }
  ];

  const categories = Array.from(new Set(components.map(c => c.category)));
  const selectedComponentData = components.find(c => c.id === selectedComponent);

  // Dynamic syntax highlighting theme based on CSS custom properties
  const syntaxTheme = useMemo(() => {
    const root = getComputedStyle(document.documentElement);
    const background = root.getPropertyValue('--card').trim() || '#ffffff';
    const foreground = root.getPropertyValue('--foreground').trim() || '#000000';
    const muted = root.getPropertyValue('--muted-foreground').trim() || '#6b7280';
    const primary = root.getPropertyValue('--primary').trim() || '#000000';
    const accent = root.getPropertyValue('--accent').trim() || '#e9ebef';
    
    return {
      'code[class*="language-"]': {
        color: foreground,
        background: background,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        fontSize: '0.875rem',
        textAlign: 'left' as const,
        whiteSpace: 'pre' as const,
        wordSpacing: 'normal',
        wordBreak: 'normal',
        wordWrap: 'normal',
        lineHeight: '1.6',
        tabSize: 2,
        hyphens: 'none' as const,
      },
      'pre[class*="language-"]': {
        color: foreground,
        background: background,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        fontSize: '0.875rem',
        textAlign: 'left' as const,
        whiteSpace: 'pre' as const,
        wordSpacing: 'normal',
        wordBreak: 'normal',
        wordWrap: 'normal',
        lineHeight: '1.6',
        tabSize: 2,
        hyphens: 'none' as const,
        padding: '1em',
        margin: '0',
        overflow: 'auto',
      },
      'comment': { color: muted, fontStyle: 'italic' },
      'prolog': { color: muted },
      'doctype': { color: muted },
      'cdata': { color: muted },
      'punctuation': { color: muted },
      'namespace': { opacity: 0.7 },
      'property': { color: primary },
      'tag': { color: primary },
      'boolean': { color: primary },
      'number': { color: primary },
      'constant': { color: primary },
      'symbol': { color: primary },
      'deleted': { color: '#ef4444' },
      'selector': { color: '#10b981' },
      'attr-name': { color: '#10b981' },
      'string': { color: '#10b981' },
      'char': { color: '#10b981' },
      'builtin': { color: '#10b981' },
      'inserted': { color: '#10b981' },
      'operator': { color: muted },
      'entity': { color: '#8b5cf6', cursor: 'help' },
      'url': { color: '#8b5cf6' },
      'atrule': { color: '#f59e0b' },
      'attr-value': { color: '#f59e0b' },
      'keyword': { color: '#ec4899' },
      'function': { color: '#0ea5e9' },
      'class-name': { color: '#f59e0b' },
      'regex': { color: '#f97316' },
      'important': { color: '#ef4444', fontWeight: 'bold' },
      'variable': { color: '#8b5cf6' },
      'bold': { fontWeight: 'bold' },
      'italic': { fontStyle: 'italic' },
    };
  }, []);

  const handleCopy = async () => {
    if (selectedComponentData) {
      await navigator.clipboard.writeText(selectedComponentData.code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header Toolbar */}
      <div className="border-b bg-card px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-primary" />
            <h1 className="text-sm">Playground</h1>
          </div>
          
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          
          {/* Design Intent Selector */}
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <Select 
              value={designIntent} 
              onValueChange={(value) => {
                if (onDesignIntentChange) {
                  onDesignIntentChange(value);
                }
                toast.success(`Switched to ${availableIntents.find(i => i.value === value)?.label} intent`);
              }}
            >
              <SelectTrigger className="w-[110px] sm:w-[130px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableIntents.map(intent => (
                  <SelectItem key={intent.value} value={intent.value}>
                    {intent.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          
          {/* Component Selector */}
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-[140px] sm:w-[160px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {components
                    .filter(c => c.category === category)
                    .map(component => (
                      <SelectItem key={component.id} value={component.id}>
                        {component.name}
                      </SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          {/* Framework Selector */}
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-[100px] sm:w-[110px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React + TS</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
              <SelectItem value="css">CSS Vars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Badge variant="outline" className="text-xs h-6 px-2">
            <Sparkles className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Tokens</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs px-2 sm:px-3 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs px-2 sm:px-3 gap-1.5"
            onClick={() => toast.info("Export feature ready!")}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Two Column Layout - Stacks vertically on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left - Code */}
        <div className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r max-h-[50vh] lg:max-h-none">
          <div className="border-b bg-muted/10 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm">Source Code</span>
              <Badge variant="secondary" className="text-xs">
                {selectedFramework === "react" ? "TypeScript" : selectedFramework}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground hidden md:block">
              Using design tokens from your active theme
            </span>
          </div>
          <ScrollArea className="flex-1">
            <SyntaxHighlighter
              language="tsx"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.75rem',
                height: '100%',
                background: '#ffffff',
              }}
              showLineNumbers
              codeTagProps={{
                style: {
                  fontSize: '0.75rem',
                  lineHeight: '1.5'
                }
              }}
            >
              {selectedComponentData?.code || ""}
            </SyntaxHighlighter>
          </ScrollArea>
        </div>

        {/* Right - Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/30 min-h-[50vh] lg:min-h-0">
          <div className="border-b bg-card/80 backdrop-blur-sm px-3 sm:px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-2 text-xs sm:text-sm text-muted-foreground">Live Preview</span>
            </div>
            <Badge variant="outline" className="text-xs">{selectedComponentData?.name}</Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-8 lg:p-12 flex items-center justify-center min-h-full">
              {selectedComponentData?.preview}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}