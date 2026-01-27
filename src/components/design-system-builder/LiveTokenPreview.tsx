/**
 * Live Token Preview
 *
 * Shows real-time preview of how design tokens look on actual UI components
 * Updates instantly as user edits tokens in Design System Builder
 */

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
  Check,
  Star,
  Heart,
  ShoppingCart,
  Settings
} from "lucide-react";
import { useState } from "react";

interface LiveTokenPreviewProps {
  /** Whether the preview is expanded by default */
  defaultExpanded?: boolean;
  /** The UI library to preview (e.g., 'shadcn/ui', 'Ant Design', 'Tremor') */
  uiLibrary?: string;
}

export function LiveTokenPreview({ defaultExpanded = false, uiLibrary = 'shadcn/ui' }: LiveTokenPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-green-50/50 to-blue-50/50">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Live Component Preview</CardTitle>
            <Badge variant="secondary" className="text-xs">Real-time</Badge>
            {uiLibrary && uiLibrary !== 'shadcn/ui' && (
              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                {uiLibrary}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <CardDescription>
          See how your tokens look on {uiLibrary || 'shadcn/ui'} components
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Buttons Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Buttons</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </div>

          {/* Cards Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Cards & Content</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Product Card</CardTitle>
                  <CardDescription>Beautiful UI components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">$49.99</span>
                      <Badge>New</Badge>
                    </div>
                    <Button className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notification</CardTitle>
                  <CardDescription>2 minutes ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Your order has been confirmed and is being processed.</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Track Order</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Forms Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Form Elements</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
              </div>
            </div>
          </div>

          {/* Badges & Tags Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Badges & Status</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge className="bg-green-500 hover:bg-green-600">
                <Check className="w-3 h-3 mr-1" />
                Success
              </Badge>
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
            </div>
          </div>

          {/* Alerts Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Alerts & Messages</h4>
            </div>
            <div className="space-y-2">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertDescription>
                  There was an error processing your request.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Interactive Elements Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Interactive Elements</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Typography Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Typography</h4>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-medium">Heading 3</h3>
              <p className="text-base">Body text with normal weight and standard line height for comfortable reading.</p>
              <p className="text-sm text-muted-foreground">Small muted text for secondary information.</p>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Color Palette</h4>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-primary" />
                <p className="text-xs text-center">Primary</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-secondary" />
                <p className="text-xs text-center">Secondary</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-accent" />
                <p className="text-xs text-center">Accent</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-muted" />
                <p className="text-xs text-center">Muted</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-destructive" />
                <p className="text-xs text-center">Destructive</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-card border" />
                <p className="text-xs text-center">Card</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-popover border" />
                <p className="text-xs text-center">Popover</p>
              </div>
              <div className="space-y-1">
                <div className="w-full aspect-square rounded-md bg-background border" />
                <p className="text-xs text-center">BG</p>
              </div>
            </div>
          </div>

          {/* Shadow & Border Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Shadows & Borders</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 bg-card rounded-sm shadow-sm border text-center text-xs">
                Small
              </div>
              <div className="p-4 bg-card rounded-md shadow-md border text-center text-xs">
                Medium
              </div>
              <div className="p-4 bg-card rounded-lg shadow-lg border text-center text-xs">
                Large
              </div>
              <div className="p-4 bg-card rounded-xl shadow-xl border text-center text-xs">
                XLarge
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Live Preview:</strong> This preview updates automatically as you edit your design tokens above.
              {uiLibrary && uiLibrary !== 'shadcn/ui' ? (
                <> Components follow {uiLibrary}'s design language and will reflect your custom tokens in real-time.</>
              ) : (
                <> All components use the same token system you're customizing.</>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
