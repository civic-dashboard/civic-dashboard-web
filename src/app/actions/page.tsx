import { Metadata } from 'next';
import { AgendaItemList } from '@/components/AgendaItemList';
import { createDB } from '@/database/kyselyDb';
import { getAllDecisionBodies } from '@/database/queries/decisionBodies';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Take action at Toronto City Council – Civic Dashboard',
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const decisionBodies = await getAllDecisionBodies(createDB());
  return (
    <div className="min-h-screen flex flex-col items-center">
      <AgendaItemList
        initialSearchParams={params}
        decisionBodies={decisionBodies}
      />
    </div>
  );
}
