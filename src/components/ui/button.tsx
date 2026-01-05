import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";
import { useActiveTheme } from "../../contexts/ActiveThemeContext";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { activeTheme } = useActiveTheme();

  // Check theme settings for border and icons
  const showBorder = activeTheme?.componentStyles?.button?.showBorder !== false;
  const showIcons = activeTheme?.componentStyles?.button?.showIcons !== false;

  // Remove border class if theme disables borders
  let finalClassName = cn(buttonVariants({ variant, size, className }));
  if (!showBorder && (variant === "outline" || variant === "secondary")) {
    finalClassName = finalClassName.replace(/\bborder\b/g, '');
  }

  // Filter out icons if theme disables them
  const processedChildren = !showIcons && React.Children.count(children) > 0
    ? React.Children.toArray(children).filter(child => {
        // Keep text nodes and non-SVG elements
        if (typeof child === 'string' || typeof child === 'number') return true;
        if (React.isValidElement(child) && child.type !== 'svg') {
          // Check if it's a lucide-react icon or any SVG-based component
          const childType = child.type as any;
          const isIcon = childType?.displayName?.includes('Icon') || 
                        childType?.name?.match(/[A-Z][a-z]+Icon/) ||
                        child.props?.className?.includes('lucide');
          return !isIcon;
        }
        return true;
      })
    : children;

  return (
    <Comp
      data-slot="button"
      className={finalClassName}
      ref={ref}
      {...props}
    >
      {processedChildren}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };