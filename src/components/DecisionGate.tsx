import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Eye, Upload, Sparkles, Package, FileImage } from "lucide-react";
import { branding } from "../config";

interface DecisionGateProps {
  onViewDemo: () => void;
  onImportSystem: () => void;
  onImportComponent?: () => void;
  onClose?: () => void;
}

export function DecisionGate({ onViewDemo, onImportSystem, onImportComponent, onClose }: DecisionGateProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl mb-4">{branding.welcomeMessage}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {branding.welcomeDescription}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* View Demo Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            <CardHeader className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">View Demo</CardTitle>
              <CardDescription className="text-base">
                Explore pre-built design systems and interactive components
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Browse 3 complete design systems with multiple themes
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Test 40+ interactive component examples in real-time
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Export components to any framework instantly
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Perfect for inspiration and learning
                  </p>
                </div>
              </div>
              <Button 
                onClick={onViewDemo}
                className="w-full"
                size="lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                Start Exploring
              </Button>
            </CardContent>
          </Card>

          {/* Import Design System Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            <CardHeader className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Import Design System</CardTitle>
              <CardDescription className="text-base">
                Build or import your own custom design system from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Import design tokens from Figma or JSON
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Create custom themes with visual token editor
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    AI-powered code generation from your designs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Build a complete design system library
                  </p>
                </div>
              </div>
              <Button 
                onClick={onImportSystem}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Create System
              </Button>
            </CardContent>
          </Card>

          {/* Import Figma Component Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            <CardHeader className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileImage className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Import Components</CardTitle>
              <CardDescription className="text-base">
                Import individual components directly from Figma
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Import buttons, cards, forms from Figma
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Automatic image and asset extraction
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Generate code for React, Vue, Svelte, and more
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Dynamic and responsive by default
                  </p>
                </div>
              </div>
              <Button 
                onClick={onImportComponent}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Import Component
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          You can always switch between demo mode and your custom systems later
        </p>
      </div>
    </div>
  );
}