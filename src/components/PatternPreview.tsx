/**
 * PatternPreview Component
 *
 * Renders patterns from the registry with:
 * - Live preview
 * - Code view for copy-paste
 * - Token usage info
 * - Metadata for each variant
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Copy, Code, Eye, Sparkles, Tag } from "lucide-react";
import { Mail, Send, Gift, CheckCircle2 } from "lucide-react";
import type { PatternCategory, PatternVariant } from "../patterns/types";
import { ShowcaseSection } from "./ShowcaseSection";
import { ShowcaseWithNav } from "./ShowcaseWithNav";

interface PatternPreviewProps {
  category: PatternCategory;
}

interface VariantPreviewProps {
  variant: PatternVariant;
}

// Component map for rendering patterns
// This allows us to render the code strings as actual React components
const ComponentMap: Record<string, React.ComponentType<any>> = {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Checkbox,
  Mail,
  Send,
  Gift,
  Sparkles,
  CheckCircle2,
};

function VariantPreview({ variant }: VariantPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "tokens">("preview");

  const copyCode = () => {
    navigator.clipboard.writeText(variant.code);
    toast.success("Code copied to clipboard");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-sm">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{variant.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-xs">
              {variant.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {variant.addedBy}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-md">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview" className="gap-xs">
                <Eye className="w-3 h-3" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-xs">
                <Code className="w-3 h-3" />
                Code
              </TabsTrigger>
              <TabsTrigger value="tokens" className="gap-xs">
                <Tag className="w-3 h-3" />
                Tokens
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={copyCode} className="gap-xs">
              <Copy className="w-3 h-3" />
              Copy
            </Button>
          </div>

          <TabsContent value="preview" className="mt-md">
            <div className="border rounded-lg p-lg bg-background">
              <PatternRenderer code={variant.code} />
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-md">
            <pre className="border rounded-lg p-md bg-muted overflow-x-auto text-sm">
              <code>{variant.code}</code>
            </pre>
          </TabsContent>

          <TabsContent value="tokens" className="mt-md">
            <div className="border rounded-lg p-md space-y-sm">
              {variant.tokens.spacing && variant.tokens.spacing.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-xs">Spacing</p>
                  <div className="flex flex-wrap gap-xs">
                    {variant.tokens.spacing.map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {variant.tokens.colors && variant.tokens.colors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-xs">Colors</p>
                  <div className="flex flex-wrap gap-xs">
                    {variant.tokens.colors.map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {variant.tokens.radius && variant.tokens.radius.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-xs">Radius</p>
                  <div className="flex flex-wrap gap-xs">
                    {variant.tokens.radius.map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {variant.tokens.shadows && variant.tokens.shadows.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-xs">Shadows</p>
                  <div className="flex flex-wrap gap-xs">
                    {variant.tokens.shadows.map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-sm border-t">
                <p className="text-xs font-medium text-muted-foreground mb-xs">Components Used</p>
                <div className="flex flex-wrap gap-xs">
                  {variant.components.map(c => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
              <div className="pt-sm border-t">
                <p className="text-xs font-medium text-muted-foreground mb-xs">Use When</p>
                <div className="flex flex-wrap gap-xs">
                  {variant.useWhen.map(u => (
                    <Badge key={u} variant="outline" className="text-xs bg-primary/5">{u}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a pattern code string as a live React component
 * This is a simplified renderer - for production you'd want a proper JSX parser
 */
function PatternRenderer({ code }: { code: string }) {
  // For now, we render based on pattern ID
  // In a full implementation, you'd parse the JSX or use a registry of pre-built components

  // Simple Card pattern
  if (code.includes('Subscribe to our newsletter')) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-md">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Subscribe to our newsletter</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get the latest updates delivered to your inbox
          </p>
        </CardHeader>
        <CardContent className="space-y-md">
          <div className="space-y-xs">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button className="w-full" onClick={() => toast.success("Subscribed!")}>
            Subscribe
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Inline compact
  if (code.includes('flex gap-sm') && code.includes('Send')) {
    return (
      <Card>
        <CardContent className="pt-lg">
          <div className="flex gap-sm">
            <div className="flex-1">
              <Input type="email" placeholder="Enter your email" />
            </div>
            <Button onClick={() => toast.success("Subscribed!")}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Popup discount
  if (code.includes('20% off')) {
    return (
      <Card className="border-2 shadow-xl">
        <CardContent className="pt-lg relative">
          <button
            className="absolute top-md right-md text-muted-foreground hover:text-foreground"
            onClick={() => toast("Modal closed")}
          >
            ✕
          </button>
          <div className="text-center mb-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-md text-3xl">
              🎁
            </div>
            <h3 className="mb-xs">Get 20% off your first order!</h3>
            <p className="text-muted-foreground">
              Join our newsletter and receive exclusive offers
            </p>
          </div>
          <div className="space-y-md">
            <div className="space-y-xs">
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div className="flex items-start gap-xs">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                I agree to receive marketing emails and accept the privacy policy
              </label>
            </div>
            <Button className="w-full" size="lg" onClick={() => toast.success("Welcome!")}>
              <Gift className="w-4 h-4 mr-xs" />
              Claim My Discount
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              10,000+ people already subscribed
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Gradient banner
  if (code.includes('bg-gradient-to-r from-blue-600')) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-xl text-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <Sparkles className="w-10 h-10 mb-md" />
              <h3 className="text-white mb-xs">Stay updated</h3>
              <p className="text-white/90">
                Join our community and never miss an update
              </p>
            </div>
            <div className="flex gap-xs">
              <Input type="email" placeholder="Your email" className="bg-white/90 flex-1" />
              <Button variant="secondary" onClick={() => toast.success("Subscribed!")}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waitlist card
  if (code.includes('Get early access')) {
    return (
      <Card>
        <CardContent className="pt-lg">
          <div className="grid md:grid-cols-[1fr_auto] gap-lg items-center">
            <div>
              <h4 className="mb-xs">Get early access</h4>
              <p className="text-sm text-muted-foreground">
                Be the first to know when we launch new features
              </p>
            </div>
            <div className="flex gap-xs md:min-w-[400px]">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button onClick={() => toast.success("You're on the list!")}>
                Join Waitlist
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Weekly newsletter
  if (code.includes('Weekly Newsletter')) {
    return (
      <div className="border-2 border-dashed rounded-lg p-xl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-md">📬</div>
          <h3 className="mb-xs">Weekly Newsletter</h3>
          <p className="text-muted-foreground mb-lg">
            Tips, tutorials, and exclusive content delivered every week
          </p>
          <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto mb-lg">
            <Input type="email" placeholder="you@example.com" className="flex-1" />
            <Button onClick={() => toast.success("Welcome aboard!")}>
              Sign Up Free
            </Button>
          </div>
          <div className="flex items-center justify-center gap-lg text-sm text-muted-foreground">
            <div className="flex items-center gap-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              No spam
            </div>
            <div className="flex items-center gap-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Unsubscribe anytime
            </div>
            <div className="flex items-center gap-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Free forever
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-muted-foreground text-center py-xl">
      <Code className="w-8 h-8 mx-auto mb-sm opacity-50" />
      <p>Preview not available</p>
      <p className="text-xs">View code tab to see the pattern</p>
    </div>
  );
}

export function PatternPreview({ category }: PatternPreviewProps) {
  const sections = category.variants.map(v => ({
    id: v.id,
    title: v.name,
  }));

  return (
    <ShowcaseWithNav sections={sections}>
      {category.variants.map(variant => (
        <ShowcaseSection
          key={variant.id}
          id={variant.id}
          title={variant.name}
          description={variant.description}
        >
          <VariantPreview variant={variant} />
        </ShowcaseSection>
      ))}
    </ShowcaseWithNav>
  );
}

export default PatternPreview;
