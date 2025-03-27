import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';
import { MouseEventHandler, useCallback } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border border-slate-200 px-3 py-[6px] gap-x-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        secondary:
          'border-transparent bg-slate-50 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        destructive:
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
        green: 'border-transparent text-black bg-[#a5f2d4]',
        sky: 'border-transparent text-black bg-[#d3e3ff]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const onMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback(
    (ev) => ev.preventDefault(),
    [],
  );
  return (
    <button
      onMouseDown={onMouseDown}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
