/**
 * MUI Card implementation
 */
import MuiCard from '@mui/material/Card';
import MuiCardHeader from '@mui/material/CardHeader';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
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
    <MuiCard
      className={className}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </MuiCard>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <MuiCardHeader
      className={className}
      title={children}
      sx={{ pb: 0 }}
    />
  );
}

export function CardTitle({ children, className, as = 'h3' }: CardTitleProps) {
  const variantMap: Record<string, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
  };

  return (
    <Typography
      variant={variantMap[as] || 'h6'}
      component={as}
      className={className}
      sx={{ fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      className={className}
    >
      {children}
    </Typography>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <MuiCardContent className={className}>
      {children}
    </MuiCardContent>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <MuiCardActions className={className} sx={{ px: 2, pb: 2 }}>
      {children}
    </MuiCardActions>
  );
}

export default Card;
