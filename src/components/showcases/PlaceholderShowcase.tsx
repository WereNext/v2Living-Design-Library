import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Button } from "../ui-adapters/Button";
import { Sparkles } from "lucide-react";

interface PlaceholderShowcaseProps {
  title: string;
  description: string;
}

export function PlaceholderShowcase({ title, description }: PlaceholderShowcaseProps) {
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This component showcase is coming soon! We're working on creating 
            beautiful, interactive examples for this category.
          </p>
          <Button variant="outline">
            View Other Components
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
