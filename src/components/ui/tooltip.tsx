'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { X } from 'lucide-react';

interface TooltipProps {
  children: React.ReactNode;
  tooltipContent: string;
  tooltipTitle: string;
}

export function Tooltip({
  children,
  tooltipContent,
  tooltipTitle,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isTouchDevice = React.useRef(false);

  React.useEffect(() => {
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <TooltipPrimitive.Trigger
          asChild
          onClick={(e) => {
            if (isTouchDevice.current) {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        >
          <span className="cursor-pointer underline" role="button" tabIndex={0}>
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className="z-50 w-[400px] border border-[#E0E0E0] overflow-hidden rounded-md bg-white p-[23px] text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -right-[11px] -top-[11px] rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Close tooltip"
              >
                <X />
              </button>
              <div className="font-bold italic text-[20px] mb-[10px]">
                {tooltipTitle}:
              </div>
              <div className="text-[18px]">{tooltipContent}</div>
            </div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export const Provider = TooltipPrimitive.Provider;
