// app/info/page.tsx
import { Metadata } from 'next';
import HtmlDocumentsClient from '@/app/wiki/htmlDocumentsClient';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

export default function Wiki() {
  // Render a client component that fetches from the browser (relative URLs)
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <HtmlDocumentsClient />
      </main>
    </div>
  );
}
