/**
 * Card adapter - selects the correct Card implementation based on active UI library
 */
import { lazy, Suspense, ReactNode } from 'react';
import { useUILibrary } from '../../hooks/useUILibrary';
import { UI_LIBRARIES } from '../../lib/constants';
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './types';

// Lazy load library-specific implementations
const ShadcnCard = lazy(() => import('../ui/card').then(m => ({ default: m.Card })));
const ShadcnCardHeader = lazy(() => import('../ui/card').then(m => ({ default: m.CardHeader })));
const ShadcnCardTitle = lazy(() => import('../ui/card').then(m => ({ default: m.CardTitle })));
const ShadcnCardDescription = lazy(() => import('../ui/card').then(m => ({ default: m.CardDescription })));
const ShadcnCardContent = lazy(() => import('../ui/card').then(m => ({ default: m.CardContent })));
const ShadcnCardFooter = lazy(() => import('../ui/card').then(m => ({ default: m.CardFooter })));

const MUICard = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.Card })));
const MUICardHeader = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.CardHeader })));
const MUICardTitle = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.CardTitle })));
const MUICardDescription = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.CardDescription })));
const MUICardContent = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.CardContent })));
const MUICardFooter = lazy(() => import('../ui-mui/Card').then(m => ({ default: m.CardFooter })));

const ChakraCard = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.Card })));
const ChakraCardHeader = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.CardHeader })));
const ChakraCardTitle = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.CardTitle })));
const ChakraCardDescription = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.CardDescription })));
const ChakraCardContent = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.CardContent })));
const ChakraCardFooter = lazy(() => import('../ui-chakra/Card').then(m => ({ default: m.CardFooter })));

const AntdCard = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.Card })));
const AntdCardHeader = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.CardHeader })));
const AntdCardTitle = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.CardTitle })));
const AntdCardDescription = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.CardDescription })));
const AntdCardContent = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.CardContent })));
const AntdCardFooter = lazy(() => import('../ui-antd/Card').then(m => ({ default: m.CardFooter })));

const BootstrapCard = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.Card })));
const BootstrapCardHeader = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.CardHeader })));
const BootstrapCardTitle = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.CardTitle })));
const BootstrapCardDescription = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.CardDescription })));
const BootstrapCardContent = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.CardContent })));
const BootstrapCardFooter = lazy(() => import('../ui-bootstrap/Card').then(m => ({ default: m.CardFooter })));

// Fallback components
function FallbackCard({ children }: { children: ReactNode }) {
  return <div className="border rounded-lg p-4 opacity-50">{children}</div>;
}

function FallbackDiv({ children }: { children: ReactNode }) {
  return <div className="opacity-50">{children}</div>;
}

// Component maps
const cardMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCard,
  [UI_LIBRARIES.MUI]: MUICard,
  [UI_LIBRARIES.CHAKRA]: ChakraCard,
  [UI_LIBRARIES.ANTD]: AntdCard,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCard,
};

const cardHeaderMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCardHeader,
  [UI_LIBRARIES.MUI]: MUICardHeader,
  [UI_LIBRARIES.CHAKRA]: ChakraCardHeader,
  [UI_LIBRARIES.ANTD]: AntdCardHeader,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCardHeader,
};

const cardTitleMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCardTitle,
  [UI_LIBRARIES.MUI]: MUICardTitle,
  [UI_LIBRARIES.CHAKRA]: ChakraCardTitle,
  [UI_LIBRARIES.ANTD]: AntdCardTitle,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCardTitle,
};

const cardDescriptionMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCardDescription,
  [UI_LIBRARIES.MUI]: MUICardDescription,
  [UI_LIBRARIES.CHAKRA]: ChakraCardDescription,
  [UI_LIBRARIES.ANTD]: AntdCardDescription,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCardDescription,
};

const cardContentMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCardContent,
  [UI_LIBRARIES.MUI]: MUICardContent,
  [UI_LIBRARIES.CHAKRA]: ChakraCardContent,
  [UI_LIBRARIES.ANTD]: AntdCardContent,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCardContent,
};

const cardFooterMap = {
  [UI_LIBRARIES.SHADCN]: ShadcnCardFooter,
  [UI_LIBRARIES.MUI]: MUICardFooter,
  [UI_LIBRARIES.CHAKRA]: ChakraCardFooter,
  [UI_LIBRARIES.ANTD]: AntdCardFooter,
  [UI_LIBRARIES.BOOTSTRAP]: BootstrapCardFooter,
};

export function Card(props: CardProps) {
  const { library } = useUILibrary();
  const Component = cardMap[library] || ShadcnCard;

  return (
    <Suspense fallback={<FallbackCard>{props.children}</FallbackCard>}>
      <Component {...props} />
    </Suspense>
  );
}

export function CardHeader(props: CardHeaderProps) {
  const { library } = useUILibrary();
  const Component = cardHeaderMap[library] || ShadcnCardHeader;

  return (
    <Suspense fallback={<FallbackDiv>{props.children}</FallbackDiv>}>
      <Component {...props} />
    </Suspense>
  );
}

export function CardTitle(props: CardTitleProps) {
  const { library } = useUILibrary();
  const Component = cardTitleMap[library] || ShadcnCardTitle;

  return (
    <Suspense fallback={<FallbackDiv>{props.children}</FallbackDiv>}>
      <Component {...props} />
    </Suspense>
  );
}

export function CardDescription(props: CardDescriptionProps) {
  const { library } = useUILibrary();
  const Component = cardDescriptionMap[library] || ShadcnCardDescription;

  return (
    <Suspense fallback={<FallbackDiv>{props.children}</FallbackDiv>}>
      <Component {...props} />
    </Suspense>
  );
}

export function CardContent(props: CardContentProps) {
  const { library } = useUILibrary();
  const Component = cardContentMap[library] || ShadcnCardContent;

  return (
    <Suspense fallback={<FallbackDiv>{props.children}</FallbackDiv>}>
      <Component {...props} />
    </Suspense>
  );
}

export function CardFooter(props: CardFooterProps) {
  const { library } = useUILibrary();
  const Component = cardFooterMap[library] || ShadcnCardFooter;

  return (
    <Suspense fallback={<FallbackDiv>{props.children}</FallbackDiv>}>
      <Component {...props} />
    </Suspense>
  );
}

export default Card;
