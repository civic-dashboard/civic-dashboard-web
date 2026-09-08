'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FeedbackFormContent } from '@/components/FeedbackFormContent';
import { usePathname } from 'next/navigation';

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the widget when the route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 h-14 rounded-full px-4 sm:px-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          aria-label="Submit feedback"
        >
          {/* Small screens: thumbs up / thumbs down icons only */}
          <span className="flex items-center gap-1.5 sm:hidden">
            <ThumbsUp className="h-5 w-5" />
            <ThumbsDown className="h-5 w-5" />
          </span>
          {/* Larger screens: thumbs up + text + thumbs down */}
          <span className="hidden items-center gap-2 sm:flex">
            <ThumbsUp className="h-5 w-5" />
            Submit Feedback
            <ThumbsDown className="h-5 w-5" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Thoughts</DialogTitle>
        </DialogHeader>
        <FeedbackFormContent />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/feedback">
            Learn more about our approach to feedback →
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
