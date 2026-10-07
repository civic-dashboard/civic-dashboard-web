'use client';

import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/components/ui/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'z-50 fixed inset-0 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  bottomSheet?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, bottomSheet = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        bottomSheet
          ? 'bottom-0 left-0 z-50 fixed flex h-dvh w-full max-w-none flex-col gap-0 border border-slate-200 bg-white p-0 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom dark:border-slate-800 dark:bg-slate-950'
          : 'top-[50%] data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-bottom-1/2 left-[50%] data-[state=closed]:slide-out-to-left-1/2 z-50 fixed gap-4 grid bg-white dark:bg-slate-950 shadow-lg p-6 border border-slate-200 dark:border-slate-800 sm:rounded-lg w-full max-w-lg translate-x-[-50%] translate-y-[-50%] data-[state=closed]:animate-out data-[state=open]:animate-in duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="top-4 right-4 absolute data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 opacity-70 hover:opacity-100 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-300 ring-offset-white focus:ring-offset-2 dark:ring-offset-slate-950 data-[state=open]:text-slate-500 dark:data-[state=open]:text-slate-400 transition-opacity disabled:pointer-events-none">
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col gap-y-1.5 p-4 sm:text-left text-center',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex sm:flex-row flex-col-reverse sm:justify-end sm:gap-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('mb-0 font-semibold text-lg leading-none', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-slate-500 dark:text-slate-400 text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
