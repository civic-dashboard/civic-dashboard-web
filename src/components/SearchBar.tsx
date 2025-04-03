'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for councillors, motions, or agenda items..."
          className="pl-8"
        />
      </div>
      <Link
        href="/search"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Search
      </Link>
    </div>
  );
}
