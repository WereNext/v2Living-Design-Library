/**
 * UI Component Adapters
 *
 * These adapters provide a unified API for components across different UI libraries.
 * They automatically select the correct implementation based on the active design system's
 * uiLibrary setting.
 *
 * Usage:
 *   import { Button, Input, Card } from '../ui-adapters';
 *
 * The adapter will automatically use:
 * - shadcn/ui components when uiLibrary is 'shadcn'
 * - MUI components when uiLibrary is 'mui'
 * - Chakra UI components when uiLibrary is 'chakra'
 * - Ant Design components when uiLibrary is 'antd'
 * - Bootstrap components when uiLibrary is 'bootstrap'
 */

// Core Components
export { Button } from './Button';
export { Input } from './Input';
export { Badge } from './Badge';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

// Types
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  InputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  CheckboxProps,
  RadioGroupProps,
  RadioOption,
  SwitchProps,
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  BadgeProps,
  BadgeVariant,
  AlertProps,
  AlertVariant,
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TooltipProps,
  ProgressProps,
  SliderProps,
  AvatarProps,
  SkeletonProps,
  SpinnerProps,
} from './types';
