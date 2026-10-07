import * as React from 'react';

import { cn } from '@/components/ui/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex bg-white dark:bg-neutral-950 file:bg-transparent disabled:opacity-50 px-3 py-2 border border-neutral-200 dark:border-neutral-800 file:border-0 focus-visible:outline-hidden dark:focus-visible:ring-neutral-300 ring-offset-white dark:ring-offset-neutral-950 w-full h-10 file:font-medium dark:placeholder:text-neutral-400 dark:file:text-neutral-50 placeholder:text-neutral-500 file:text-neutral-950 file:text-sm text-base disabled:cursor-not-allowed',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
