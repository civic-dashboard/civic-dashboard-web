'use client';
import { useState } from 'react';

export default function AgendaItemSearch({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 p-2 border rounded-lg">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <span className="sr-only">Menu</span>
        </button>

        <input
          type="text"
          placeholder="Search agenda items..."
          className="flex-1 outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="sr-only">Search</span>
        </button>
      </div>
    </div>
  );
}
