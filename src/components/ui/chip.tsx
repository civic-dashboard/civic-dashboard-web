import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';
import { MouseEventHandler, useCallback } from 'react';

const chipVariants = cva(
  'inline-flex items-center gap-x-1 px-3 py-[6px] border border-transparent font-medium text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        outline: 'border-gray-300 text-neutral-950 dark:text-neutral-50',
        green: 'text-black bg-[#a5f2d4]',
        primaryLightest: 'text-black bg-primary-lightest',
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
