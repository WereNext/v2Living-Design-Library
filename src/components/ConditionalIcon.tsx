import { useAppState } from '../contexts/AppStateContext';
import type { LucideIcon } from 'lucide-react';

interface ConditionalIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Conditionally renders an icon based on the active design system's useIcons setting.
 * For minimalist design systems (useIcons: false), this returns null.
 * For all other systems, this renders the icon normally.
 */
export function ConditionalIcon({ icon: Icon, className, size, strokeWidth }: ConditionalIconProps) {
  const { shouldShowIcons } = useAppState();
  
  if (!shouldShowIcons) {
    return null;
  }
  
  return <Icon className={className} size={size} strokeWidth={strokeWidth} />;
}
