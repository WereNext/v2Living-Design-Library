import { ShowcaseSection } from "../ShowcaseSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AspectRatio } from "../ui/aspect-ratio";
import { ScrollArea } from "../ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function LayoutShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "cards", title: "Cards" },
    { id: "separator", title: "Separator" },
    { id: "aspect-ratio", title: "Aspect Ratio" },
    { id: "scroll-area", title: "Scroll Area" },
    { id: "collapsible", title: "Collapsible" },
  ];

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection 
          id="cards"
          title="Cards" 
          description="Container component for grouping related content"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content area of the card. You can put any content here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>A simpler card without footer actions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Another Card</CardTitle>
                <CardDescription>With some description text</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards are versatile components that can contain various types of content.</p>
              </CardContent>
            </Card>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="separator"
          title="Separator" 
          description="Visual divider between content sections"
        >
          <div className="space-y-4">
            <div>
              <p>Content above the separator</p>
            </div>
            <Separator />
            <div>
              <p>Content below the separator</p>
            </div>
            <div className="flex items-center gap-4">
              <p>Vertical</p>
              <Separator orientation="vertical" className="h-8" />
              <p>Separator</p>
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="aspect-ratio"
          title="Aspect Ratio" 
          description="Maintain consistent aspect ratios for media content"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2">16:9 Ratio</p>
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">16:9</span>
              </AspectRatio>
            </div>
            <div>
              <p className="mb-2">4:3 Ratio</p>
              <AspectRatio ratio={4 / 3} className="bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">4:3</span>
              </AspectRatio>
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="scroll-area"
          title="Scroll Area" 
          description="Customizable scrollable container"
        >
          <ScrollArea className="h-48 w-full rounded-md border p-4">
            <div className="space-y-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="p-2 border rounded">
                  Scroll item {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </ShowcaseSection>

        <ShowcaseSection 
          id="collapsible"
          title="Collapsible" 
          description="Expandable and collapsible content sections"
        >
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
              <h4>@peduarte starred 3 repositories</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-2">
              @radix-ui/primitives
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-2">
                @radix-ui/colors
              </div>
              <div className="rounded-md border px-4 py-2">
                @stitches/react
              </div>
            </CollapsibleContent>
          </Collapsible>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}