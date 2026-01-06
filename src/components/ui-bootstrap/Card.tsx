/**
 * Bootstrap Card implementation
 */
import { Card as BsCard } from 'react-bootstrap';
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
    <BsCard
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </BsCard>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <BsCard.Header className={className}>
      {children}
    </BsCard.Header>
  );
}

export function CardTitle({ children, className, as = 'h3' }: CardTitleProps) {
  return (
    <BsCard.Title as={as} className={className}>
      {children}
    </BsCard.Title>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <BsCard.Text className={`text-muted ${className || ''}`}>
      {children}
    </BsCard.Text>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <BsCard.Body className={className}>
      {children}
    </BsCard.Body>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <BsCard.Footer className={className}>
      {children}
    </BsCard.Footer>
  );
}

export default Card;
