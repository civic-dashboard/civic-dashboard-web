'use client';

import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FeedbackFormContent } from '@/components/FeedbackFormContent';

export function FeedbackWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="icon"
          aria-label="Open feedback form"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Thoughts</DialogTitle>
        </DialogHeader>
        <FeedbackFormContent />
      </DialogContent>
    </Dialog>
  );
}
