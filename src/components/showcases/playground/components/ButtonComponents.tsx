import { Button } from "../../../ui/button";
import { Heart, Share2, Bookmark, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { PlaygroundComponent } from "../types";

export const buttonVariants: PlaygroundComponent = {
  id: "button-variants",
  name: "Button Variants",
  category: "Buttons",
  code: `import { Button } from "./components/ui/button";
import { toast } from "sonner";

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
};

export const buttonSizes: PlaygroundComponent = {
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
};

export const iconButtons: PlaygroundComponent = {
  id: "icon-buttons",
  name: "Icon Buttons",
  category: "Buttons",
  code: `import { Button } from "./components/ui/button";
import { Heart, Share2, Bookmark, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

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
};

export const buttonComponents = [buttonVariants, buttonSizes, iconButtons];
