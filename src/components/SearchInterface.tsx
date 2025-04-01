'use client';

import { SearchProvider } from "@/contexts/SearchContext";
import SearchCard from "./SearchCard";
import SearchCouncillorCard from "./SearchCouncillorCard";
import { Separator } from "./ui/separator";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Tags } from "@/components/search";
import { useState } from "react";
import SearchBar from "./SearchBar" ;

export function SearchInterface() {
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  return (
    <SearchProvider>
    
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div>
        <SearchBar />
      </div>
      
      <Separator className="mb-5.5" />

      {/* Advanced Filter */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2 cursor-pointer justify-end w-full" onClick={() => setIsTagsOpen(!isTagsOpen)}>
          <span className="text-sm font-medium">Open Advanced Filter</span>
          {isTagsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        {isTagsOpen && <Tags />}
      </div>

      {/* Trending Items */}
      <div className="mt-8">
        {/* Trending Items Header */}
        <div className="flex flex-col gap-4 p-4">
          <header className="flex items-center justify-between gap-5 mb-3">
            <h2 className="whitespace-nowrap mb-0">Trending Items</h2>
            <TrendingUp className="h-5 w-5" />
          </header>
        </div>
        {/* Trending Items Cards */}
        <div className="grid grid-cols-1 gap-6">
          <SearchCard />  
          <SearchCouncillorCard />
        </div>
      </div>

      {/* Recent Items */}
        <div className="mt-4">
        {/* Recent Items Header */}
        <div className="flex flex-col gap-4 p-4">
          <header className="flex items-center justify-between gap-5 mb-3">
            <h2 className="whitespace-nowrap mb-0">Recent Items</h2>
            <Clock className="h-5 w-5" />
          </header>
        </div>
        {/* Recent Items Cards */}
        <div className="grid grid-cols-1 gap-6">
          <SearchCard />  
          <SearchCouncillorCard />
        </div>
      </div>
    </div>
    </SearchProvider>
  );
}
