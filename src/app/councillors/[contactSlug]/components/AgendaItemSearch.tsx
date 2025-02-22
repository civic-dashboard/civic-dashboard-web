'use client';
import { useState } from 'react';

export default function AgendaItemSearch({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Example tags - replace with your actual tags
  const tags = ['Motion', 'Amendment', 'Budget', 'Planning', 'Transit'];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 p-2 border rounded-lg">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {/* Add hamburger icon */}
          <span className="sr-only">Menu</span>
        </button>

        <input
          type="text"
          placeholder="Search agenda items..."
          className="flex-1 outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />

        <button className="p-2 hover:bg-gray-100 rounded-full">
          {/* Add search icon */}
          <span className="sr-only">Search</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTags(
                selectedTags.includes(tag)
                  ? selectedTags.filter((t) => t !== tag)
                  : [...selectedTags, tag],
              );
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tag}
            {selectedTags.includes(tag) && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}
