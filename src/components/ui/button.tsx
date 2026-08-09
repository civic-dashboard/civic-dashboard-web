import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-4',
    'whitespace-nowrap text-base font-semibold',
    'transition-colors',
    'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:grow-0 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/80',
        outline:
          'border border-primary text-primary hover:bg-primary-lightest dark:border-white dark:text-white dark:hover:bg-white/10',
        ghost:
          'hover:bg-primary-lightest hover:text-black dark:hover:bg-white/10 dark:hover:text-white',
      },
      size: {
        sm: 'h-10 px-3 py-2 text-sm min-w-10',
        md: 'h-12 px-4 py-3',
        lg: 'h-14 px-6 py-4',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
