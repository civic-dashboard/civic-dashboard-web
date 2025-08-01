'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative mb-2">
        <Input
          type="text"
          placeholder="Search by topic, councillor, item"
          className="pl-4 pr-12 py-6 bg-gray-100 rounded-full text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
