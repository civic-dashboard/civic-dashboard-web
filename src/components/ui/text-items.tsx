import type { ReactNode } from 'react';
import { cn } from '@/components/ui/utils';

type TextItemProps = {
  children: ReactNode;
  className?: string;
};

// DisplayText is intended for stylistic purposes, not semantic meaning.
// Therefore we use a <p> instead of h*
export function DisplayText({ children, className }: TextItemProps) {
  return <p className={cn('text-display mb-12', className)}>{children}</p>;
}

export function Heading1({ children, className }: TextItemProps) {
  return <h1 className={cn('text-h1 mb-12', className)}>{children}</h1>;
}

export function Heading2({ children, className }: TextItemProps) {
  return <h2 className={cn('text-h2 mb-6', className)}>{children}</h2>;
}

export function Heading3({ children, className }: TextItemProps) {
  return <h3 className={cn('text-h3 mb-6', className)}>{children}</h3>;
}

export function Subheading({ children, className }: TextItemProps) {
  return <h3 className={cn('text-subheading mb-6', className)}>{children}</h3>;
}

/**
 * Renders a `<ul>` styled as a bulleted list. `children` should be `<li>`
 * elements. You do not need to add margin/padding for `<li>` -- this component
 * will provide it automatically.
 */
export function BulletedList({ children, className }: TextItemProps) {
  return (
    <ul className={cn('text-body list-disc mb-6 pl-6 space-y-4', className)}>
      {children}
    </ul>
  );
}
