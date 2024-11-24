import { fetchDecisionBodies } from '@/api/decisionBody';
import { fetchItems } from '@/api/agendaItem';
import { PublicConsultationList } from '@/components/PublicConsultationList';
import { AgendaItemList } from '@/components/AgendaItemList';

export default async function Home() {
  const items = await fetchItems();
  const decisionBodies = await fetchDecisionBodies();

  return (
    <div className="flex flex-row bg-white min-w-[700px]">
      <div className="w-1/2 m-4">
        <h1>Upcoming Agenda Items</h1>
        <AgendaItemList items={items} decisionBodies={decisionBodies} />
      </div>
      <div className="w-1/2 m-4">
        <h1>Public Consultations</h1>
        <PublicConsultationList />
      </div>
    </div>
  );
}
