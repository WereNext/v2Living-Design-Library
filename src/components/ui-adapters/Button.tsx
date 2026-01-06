/**
 * Button adapter - selects the correct Button implementation based on active UI library
 */
import { lazy, Suspense, forwardRef } from 'react';
import { useUILibrary } from '../../hooks/useUILibrary';
import { UI_LIBRARIES } from '../../lib/constants';
import type { ButtonProps } from './types';

// Lazy load library-specific implementations
const ShadcnButton = lazy(() => import('../ui/button').then(m => ({ default: m.Button })));
const MUIButton = lazy(() => import('../ui-mui/Button'));
const ChakraButton = lazy(() => import('../ui-chakra/Button'));
const AntdButton = lazy(() => import('../ui-antd/Button'));
const BootstrapButton = lazy(() => import('../ui-bootstrap/Button'));

// Fallback button while loading
function FallbackButton({ children, disabled, className }: ButtonProps) {
  return (
    <button disabled={disabled} className={`px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50 ${className || ''}`}>
      {children}
    </button>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { library } = useUILibrary();

  const ButtonComponent = {
    [UI_LIBRARIES.SHADCN]: ShadcnButton,
    [UI_LIBRARIES.MUI]: MUIButton,
    [UI_LIBRARIES.CHAKRA]: ChakraButton,
    [UI_LIBRARIES.ANTD]: AntdButton,
    [UI_LIBRARIES.BOOTSTRAP]: BootstrapButton,
  }[library] || ShadcnButton;

  return (
    <Suspense fallback={<FallbackButton {...props} />}>
      <ButtonComponent ref={ref} {...props} />
    </Suspense>
  );
});

Button.displayName = 'Button';

export default Button;
