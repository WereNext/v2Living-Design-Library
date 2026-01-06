/**
 * Input adapter - selects the correct Input implementation based on active UI library
 */
import { lazy, Suspense } from 'react';
import { useUILibrary } from '../../hooks/useUILibrary';
import { UI_LIBRARIES } from '../../lib/constants';
import type { InputProps } from './types';

// Lazy load library-specific implementations
const ShadcnInput = lazy(() => import('../ui/input').then(m => ({ default: m.Input })));
const MUIInput = lazy(() => import('../ui-mui/Input'));
const ChakraInput = lazy(() => import('../ui-chakra/Input'));
const AntdInput = lazy(() => import('../ui-antd/Input'));
const BootstrapInput = lazy(() => import('../ui-bootstrap/Input'));

// Fallback input while loading
function FallbackInput({ placeholder, disabled }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      disabled={disabled}
      className="px-3 py-2 border rounded-md opacity-50 w-full"
    />
  );
}

export function Input(props: InputProps) {
  const { library } = useUILibrary();

  const InputComponent = {
    [UI_LIBRARIES.SHADCN]: ShadcnInput,
    [UI_LIBRARIES.MUI]: MUIInput,
    [UI_LIBRARIES.CHAKRA]: ChakraInput,
    [UI_LIBRARIES.ANTD]: AntdInput,
    [UI_LIBRARIES.BOOTSTRAP]: BootstrapInput,
  }[library] || ShadcnInput;

  return (
    <Suspense fallback={<FallbackInput {...props} />}>
      <InputComponent {...props} />
    </Suspense>
  );
}

export default Input;
