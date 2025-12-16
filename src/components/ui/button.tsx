import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-semibold',
    'transition-colors',
    'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
    'dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'bg-[#1870f8] text-white ',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-[#1870f8] text-[#1870f8] bg-white dark:border-neutral-200 dark:text-neutral-200 dark:bg-neutral-800',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        'secondary-outline':
          'border border-neutral-200 bg-white dark:border-neutral-400 dark:bg-neutral-950',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        'secondary-opposite':
          'bg-neutral-100/80 text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800/80 dark:text-neutral-50 dark:hover:bg-neutral-800',
      },
      size: {
        default: 'h-10 rounded-[17px] px-4 py-2',
        sm: 'h-8 rounded-[13px] px-3 text-xs',
        lg: 'h-11 rounded-[20px] px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
