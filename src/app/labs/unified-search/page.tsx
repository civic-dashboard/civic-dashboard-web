import { SearchInterface } from '@/app/labs/unified-search/SearchInterface';

export default function Home() {
  return (
    <div className="mx-auto max-w-max-content-width min-h-screen flex flex-col items-center">
      <SearchInterface />
    </div>
  );
}
