/**
 * Ant Design Card implementation
 */
import { Card as AntCard, Typography } from 'antd';
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from '../ui-adapters/types';

const { Title, Text } = Typography;

export function Card({ children, className, onClick }: CardProps) {
  return (
    <AntCard
      className={className}
      onClick={onClick}
      hoverable={!!onClick}
      styles={{
        body: { padding: 0 },
      }}
    >
      {children}
    </AntCard>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={className} style={{ padding: '16px 24px 0' }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, as = 'h3' }: CardTitleProps) {
  const levelMap: Record<string, 1 | 2 | 3 | 4 | 5> = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 5,
  };

  return (
    <Title
      level={levelMap[as] || 4}
      className={className}
      style={{ margin: 0 }}
    >
      {children}
    </Title>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Text type="secondary" className={className}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={className} style={{ padding: '16px 24px' }}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={className}
      style={{
        padding: '12px 24px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        gap: '8px',
      }}
    >
      {children}
    </div>
  );
}

export default Card;
