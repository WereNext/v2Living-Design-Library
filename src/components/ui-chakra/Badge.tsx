/**
 * Chakra UI v3 Badge implementation
 */
import { Badge as ChakraBadge } from '@chakra-ui/react';
import type { BadgeProps } from '../ui-adapters/types';

// Map our variants to Chakra v3 badge props
const variantMap: Record<string, { variant: 'solid' | 'subtle' | 'outline'; colorPalette: string }> = {
  default: { variant: 'solid', colorPalette: 'blue' },
  secondary: { variant: 'subtle', colorPalette: 'gray' },
  destructive: { variant: 'solid', colorPalette: 'red' },
  outline: { variant: 'outline', colorPalette: 'gray' },
};

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const { variant: badgeVariant, colorPalette } = variantMap[variant] || variantMap.default;

  return (
    <ChakraBadge
      variant={badgeVariant}
      colorPalette={colorPalette}
      className={className}
      borderRadius="md"
      px={2}
      py={0.5}
    >
      {children}
    </ChakraBadge>
  );
}
