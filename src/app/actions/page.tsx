import { AgendaItemList } from '@/components/AgendaItemList';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <AgendaItemList />
    </div>
  );
}
