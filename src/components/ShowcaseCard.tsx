/**
 * Showcase Card Wrapper
 *
 * Wraps showcase components in a card
 */

import React from 'react';
import { Card } from './ui/card';

interface ShowcaseCardProps {
  children: React.ReactNode;
  defaultName?: string;
  category?: string;
  designIntent?: string;
  description?: string;
}

export function ShowcaseCard({
  children,
}: ShowcaseCardProps) {
  return (
    <Card className="p-6">
      {children}
    </Card>
  );
}
