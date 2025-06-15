import { SearchInterface } from '@/app/labs/unified-search/SearchInterface';
import { PrototypeNotice } from '@/app/labs/PrototypeNotice';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unified Search Prototype',
  description: 'An experimental unified search UI for Civic Dashboard',
};

export default function Home() {
  return (
    <div className="mx-auto max-w-max-content-width min-h-screen flex flex-col items-center">
      <PrototypeNotice>
        This is an experimental search UI, exploring the idea of searching over
        different kinds of data in one place!
      </PrototypeNotice>
      <SearchInterface />
    </div>
  );
}
