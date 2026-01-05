import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TokenPreviewProps {
  tokens?: any;
}

export function TokenPreview({ tokens }: TokenPreviewProps) {
  if (!tokens) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Import tokens to see live preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Live Component Preview</h3>
        <p className="text-sm text-muted-foreground mb-6">
          These components will update instantly when you import new tokens
        </p>
      </div>

      {/* Color Preview */}
      {tokens.colors && (
        <div className="space-y-4">
          <h4>Colors Applied</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(tokens.colors).slice(0, 8).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div
                  className="h-16 rounded-lg border"
                  style={{ background: `hsl(${value})` }}
                />
                <div className="text-xs">
                  <p className="font-semibold">{key}</p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    {value as string}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Component Preview */}
      <div className="space-y-4">
        <h4>Components with New Tokens</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Button Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive Button
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Text input with new colors" />
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Success alert with new colors</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Error alert with new colors</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h1 className="text-foreground">Heading 1</h1>
              <h2 className="text-foreground">Heading 2</h2>
              <h3 className="text-foreground">Heading 3</h3>
              <p className="text-muted-foreground">
                Paragraph text with muted foreground color
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Border Radius Preview */}
      {tokens.borderRadius && (
        <div className="space-y-4">
          <h4>Border Radius</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(tokens.borderRadius).map(([key, value]) => (
              <div key={key} className="text-center space-y-2">
                <div
                  className="h-16 bg-primary mx-auto"
                  style={{
                    borderRadius: value as string,
                    width: '64px',
                  }}
                />
                <div className="text-xs">
                  <p className="font-semibold">{key}</p>
                  <p className="text-muted-foreground">{value as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography Preview */}
      {tokens.typography?.fontSizes && (
        <div className="space-y-4">
          <h4>Font Sizes</h4>
          <div className="space-y-3">
            {Object.entries(tokens.typography.fontSizes).map(([key, value]) => (
              <div key={key} className="flex items-baseline gap-4">
                <Badge variant="outline" className="w-16 justify-center">
                  {key}
                </Badge>
                <p style={{ fontSize: value as string }}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <span className="text-xs text-muted-foreground ml-auto">
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacing Preview */}
      {tokens.spacing && (
        <div className="space-y-4">
          <h4>Spacing Scale</h4>
          <div className="space-y-2">
            {Object.entries(tokens.spacing).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <Badge variant="outline" className="w-12 justify-center">
                  {key}
                </Badge>
                <div
                  className="h-8 bg-primary"
                  style={{ width: value as string }}
                />
                <span className="text-xs text-muted-foreground">
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
