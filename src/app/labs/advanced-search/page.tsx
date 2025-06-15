import { PrototypeNotice } from '@/app/labs/PrototypeNotice';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Search Prototype',
  description: 'An experimental advanced search backend for Civic Dashboard',
};

export default function AdvancedSearch() {
  return (
    <main className="min-h-screen w-full">
      <PrototypeNotice>
        This is an experimental search page, using a more advanced search
        backend than we use for the rest of the site! AI summaries are also
        provided.
      </PrototypeNotice>
      <iframe
        className="w-full min-h-screen"
        src="https://nextjs-opensearch.d2psjv0lhudilg.amplifyapp.com/"
      />
    </main>
  );
}
