/**
 * Badge adapter - selects the correct Badge implementation based on active UI library
 */
import { lazy, Suspense } from 'react';
import { useUILibrary } from '../../hooks/useUILibrary';
import { UI_LIBRARIES } from '../../lib/constants';
import type { BadgeProps } from './types';

// Lazy load library-specific implementations
const ShadcnBadge = lazy(() => import('../ui/badge').then(m => ({ default: m.Badge })));
const MUIBadge = lazy(() => import('../ui-mui/Badge'));
const ChakraBadge = lazy(() => import('../ui-chakra/Badge'));
const AntdBadge = lazy(() => import('../ui-antd/Badge'));
const BootstrapBadge = lazy(() => import('../ui-bootstrap/Badge'));

// Fallback badge while loading
function FallbackBadge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary opacity-50">
      {children}
    </span>
  );
}

export function Badge(props: BadgeProps) {
  const { library } = useUILibrary();

  const BadgeComponent = {
    [UI_LIBRARIES.SHADCN]: ShadcnBadge,
    [UI_LIBRARIES.MUI]: MUIBadge,
    [UI_LIBRARIES.CHAKRA]: ChakraBadge,
    [UI_LIBRARIES.ANTD]: AntdBadge,
    [UI_LIBRARIES.BOOTSTRAP]: BootstrapBadge,
  }[library] || ShadcnBadge;

  return (
    <Suspense fallback={<FallbackBadge {...props} />}>
      <BadgeComponent {...props} />
    </Suspense>
  );
}

export default Badge;
