import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";
import { useActiveTheme } from "../../contexts/ActiveThemeContext";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  const { activeTheme } = useActiveTheme();

  // Check theme settings for border and icons
  const showBorder = activeTheme?.componentStyles?.chip?.showBorder !== false;
  const showIcons = activeTheme?.componentStyles?.chip?.showIcons !== false;

  // Remove border class if theme disables borders
  let finalClassName = cn(badgeVariants({ variant }), className);
  if (!showBorder) {
    finalClassName = finalClassName.replace(/\bborder\b/g, '').replace(/border-transparent/g, '');
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
      data-slot="badge"
      className={finalClassName}
      {...props}
    >
      {processedChildren}
    </Comp>
  );
}

export { Badge, badgeVariants };