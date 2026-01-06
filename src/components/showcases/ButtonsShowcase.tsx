import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Toggle } from "../ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Heart, Share2, Bookmark, Bold, Italic, Underline, ShoppingCart, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { CodePlayground } from "../CodePlayground";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { ConditionalIcon } from "../ConditionalIcon";
import { useAppState } from "../../contexts/AppStateContext";

interface ButtonsShowcaseProps {
  designIntent?: string;
}

export function ButtonsShowcase({ designIntent = "web-app" }: ButtonsShowcaseProps) {
  const { shouldShowIcons } = useAppState();
  
  const sections = [
    { id: "button-variants", title: "Button Variants" },
    { id: "button-sizes", title: "Button Sizes" },
    ...(shouldShowIcons ? [{ id: "icon-buttons", title: "Icon Buttons" }] : []),
    { id: "badges", title: "Badges" },
    ...(shouldShowIcons ? [{ id: "toggle", title: "Toggle" }] : []),
    ...(shouldShowIcons ? [{ id: "toggle-group", title: "Toggle Group" }] : []),
  ];

  const buttonVariantsCode = `import { Button } from "./components/ui/button";
import { toast } from "sonner@2.0.3";

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast.success("Default button clicked!")}>
        Default
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`;

  const iconButtonsCode = `import { Button } from "./components/ui/button";
import { Heart, Share2, Bookmark, ShoppingCart, CreditCard } from "lucide-react";
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
      <Button variant="secondary" onClick={() => toast("Bookmarked!")}>
        <Bookmark className="mr-2 h-4 w-4" />
        Bookmark
      </Button>
      <Button variant="outline" onClick={() => toast("Added to cart!")}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
      <Button variant="outline" onClick={() => toast("Payment successful!")}>
        <CreditCard className="mr-2 h-4 w-4" />
        Pay
      </Button>
    </div>
  );
}`;

  const badgesCode = `import { Badge } from "./components/ui/badge";

export function Badges() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}`;

  const buttonSizesCode = `import { Button } from "./components/ui/button";
import { Heart } from "lucide-react";

export function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  );
}`;

  const toggleCode = `import { Toggle } from "./components/ui/toggle";
import { Bold } from "lucide-react";

export function ToggleExample() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}`;

  const toggleGroupCode = `import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function TextFormatting() {
  return (
    <ToggleGroup 
      type="multiple" 
      onValueChange={(value) => toast(\`Selected: \${value.join(", ")}\`)}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`;

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection 
          id="button-variants"
          title="Button Variants" 
          description={
            designIntent === "ecommerce" 
              ? "Button styles optimized for e-commerce actions" 
              : designIntent === "landing"
              ? "Button styles perfect for call-to-actions on landing pages"
              : designIntent === "mobile"
              ? "Button styles optimized for mobile touch interfaces"
              : "Different button styles for various use cases"
          }
        >
          <CodePlayground
            code={buttonVariantsCode}
            title="Button Variants"
            description="Explore all button variants with interactive examples"
          >
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => toast.success("Default button clicked!")}>
                {designIntent === "ecommerce" ? "Buy Now" : "Default"}
              </Button>
              <Button variant="secondary">
                {designIntent === "ecommerce" ? "Add to Wishlist" : "Secondary"}
              </Button>
              <Button variant="destructive">
                {designIntent === "ecommerce" ? "Remove" : "Destructive"}
              </Button>
              <Button variant="outline">
                {designIntent === "landing" ? "Learn More" : "Outline"}
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection 
          id="button-sizes"
          title="Button Sizes" 
          description="Buttons in different sizes"
        >
          <CodePlayground
            code={buttonSizesCode}
            title="Button Sizes"
            description="Buttons in various sizes for different use cases"
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        {shouldShowIcons && (
          <ShowcaseSection 
            id="icon-buttons"
            title="Icon Buttons" 
            description="Buttons with icons for common actions"
          >
            <CodePlayground
              code={iconButtonsCode}
              title="Icon Buttons"
              description="Buttons combined with icons for better UX"
            >
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
                <Button variant="outline" onClick={() => toast("Payment successful!")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay
                </Button>
              </div>
            </CodePlayground>
          </ShowcaseSection>
        )}

        <ShowcaseSection 
          id="badges"
          title="Badges" 
          description="Small status indicators and labels"
        >
          <CodePlayground
            code={badgesCode}
            title="Badge Components"
            description="Compact status indicators and labels"
          >
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        {shouldShowIcons && (
          <ShowcaseSection 
            id="toggle"
            title="Toggle" 
            description="Toggle buttons for binary states"
          >
            <CodePlayground
              code={toggleCode}
              title="Toggle Example"
              description="Simple toggle button for binary states"
            >
              <Toggle aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </Toggle>
            </CodePlayground>
          </ShowcaseSection>
        )}

        {shouldShowIcons && (
          <ShowcaseSection 
            id="toggle-group"
            title="Toggle Group" 
            description="Group of toggles with single or multiple selection"
          >
            <CodePlayground
              code={toggleGroupCode}
              title="Toggle Group"
              description="Multiple toggles working together"
            >
              <ToggleGroup type="multiple" onValueChange={(value) => toast(`Selected: ${value.join(", ")}`)}>
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Toggle underline">
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </CodePlayground>
          </ShowcaseSection>
        )}
      </ShowcaseWithNav>
    </div>
  );
}