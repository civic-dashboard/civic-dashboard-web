import { Metadata } from 'next';
import { AgendaItemList } from '@/components/AgendaItemList';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Take action at Toronto City Council – Civic Dashboard',
  };
}

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <AgendaItemList />
    </div>
  );
}
