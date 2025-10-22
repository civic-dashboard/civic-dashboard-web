import { Metadata } from 'next';
import WikiIndexClient from '@/app/wiki/wikiIndexClient';

export const metadata: Metadata = {
  title: 'Generated Pages – Civic Dashboard',
};

export default function WikiIndex() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <WikiIndexClient />
      </main>
    </div>
  );
}
