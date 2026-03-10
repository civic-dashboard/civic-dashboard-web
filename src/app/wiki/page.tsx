import { Metadata } from 'next';
import WikiIndexClient from '@/app/wiki/wikiIndexClient';

export const metadata: Metadata = {
  title: 'Wiki – Civic Dashboard',
  description:
    'Explore Civic Dashboard’s wiki for clear, accessible guides on Toronto City Council, municipal powers, elections, councillors, and how local government works',
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
