import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';
import { MouseEventHandler, useCallback } from 'react';

const chipVariants = cva(
  'inline-flex items-center rounded-lg border border-neutral-200 px-3 py-[6px] gap-x-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        destructive:
          'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        outline: 'text-neutral-950 dark:text-neutral-50',
        green: 'border-transparent text-black bg-[#a5f2d4]',
        sky: 'border-transparent text-black bg-[#d3e3ff]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant }), className)} {...props} />
  );
}

export interface ChipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof chipVariants> {}

function ChipLink({ className, variant, ...props }: ChipLinkProps) {
  return (
    <a
      className={cn(chipVariants({ variant }), 'hover:underline', className)}
      {...props}
    />
  );
}

export interface ChipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {}

function ChipButton({ className, variant, ...props }: ChipButtonProps) {
  const onMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback(
    (ev) => ev.preventDefault(),
    [],
  );

  return (
    <button
      onMouseDown={onMouseDown}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ChipButton, ChipLink, Chip, chipVariants };
