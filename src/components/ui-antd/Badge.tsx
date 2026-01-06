/**
 * Ant Design Badge/Tag implementation
 */
import { Tag } from 'antd';
import type { BadgeProps } from '../ui-adapters/types';

// Map our variants to Ant Design tag colors
const colorMap: Record<string, string | undefined> = {
  default: 'blue',
  secondary: 'default',
  destructive: 'error',
  outline: undefined, // Uses bordered style
};

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const color = colorMap[variant];
  const bordered = variant === 'outline';

  return (
    <Tag
      color={color}
      bordered={bordered}
      className={className}
    >
      {children}
    </Tag>
  );
}
