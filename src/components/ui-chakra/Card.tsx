/**
 * Chakra UI v3 Card implementation
 */
import { Box, Heading, Text } from '@chakra-ui/react';
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from '../ui-adapters/types';

export function Card({ children, className, onClick }: CardProps) {
  return (
    <Box
      className={className}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      _dark={{ bg: 'gray.800' }}
    >
      {children}
    </Box>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <Box className={className} p={4} pb={0}>
      {children}
    </Box>
  );
}

export function CardTitle({ children, className, as = 'h3' }: CardTitleProps) {
  const sizeMap: Record<string, 'xl' | 'lg' | 'md' | 'sm' | 'xs'> = {
    h1: 'xl',
    h2: 'lg',
    h3: 'md',
    h4: 'sm',
    h5: 'xs',
    h6: 'xs',
  };

  return (
    <Heading as={as} size={sizeMap[as] || 'md'} className={className}>
      {children}
    </Heading>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Text color="gray.500" fontSize="sm" className={className}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <Box className={className} p={4}>
      {children}
    </Box>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <Box className={className} p={4} pt={0}>
      {children}
    </Box>
  );
}

export default Card;
