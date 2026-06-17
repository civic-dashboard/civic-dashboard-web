import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/components/ui/utils';

type TextItemProps = {
  children: ReactNode;
  className?: string;
};

type TextPreset = 'Heading1' | 'Heading2' | 'Heading3' | 'Body' | 'Small';
type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

type TextProps = {
  preset: TextPreset;
  as?: TextElement /* Optionally override the default HTML element for a11y compliance */;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>;

const textPresetElements: Record<TextPreset, TextElement> = {
  Heading1: 'h1',
  Heading2: 'h2',
  Heading3: 'h3',
  Body: 'p',
  Small: 'p',
};

const textPresetClasses: Record<TextPreset, string> = {
  Heading1:
    'font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight',
  Heading2: 'font-heading text-2xl md:text-3xl font-bold leading-[1.2]',
  Heading3: 'font-heading text-lg md:text-xl font-bold leading-[1.2]',
  Body: 'font-body text-base font-normal leading-[1.5]',
  Small: 'font-body text-sm font-normal leading-[1.5]',
};

export function Text({ preset, as, children, className, ...props }: TextProps) {
  const Element = as ?? textPresetElements[preset];

  return (
    <Element className={cn(textPresetClasses[preset], className)} {...props}>
      {children}
    </Element>
  );
}

/**
 * Renders a `<ul>` styled as a bulleted list. `children` should be `<li>`
 * elements. You do not need to add margin/padding for `<li>` -- this component
 * will provide it automatically.
 */
export function BulletedList({ children, className }: TextItemProps) {
  return (
    <ul className={cn('text-base list-disc mb-6 pl-6 space-y-4', className)}>
      {children}
    </ul>
  );
}
