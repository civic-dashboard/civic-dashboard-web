'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  return (
    <div className="mx-auto p-4 w-full max-w-3xl">
      <div className="relative mb-2">
        <Input
          type="text"
          placeholder="Search by topic, councillor, item"
          className="bg-gray-100 py-6 pr-12 pl-4 rounded-full text-base"
        />
        <div className="top-1/2 right-3 absolute -translate-y-1/2 transform">
          <Search className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
