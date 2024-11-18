import { fetchDecisionBody } from '@/api/decisionbody';
import { fetchItems } from '@/api/item';
import { EventList } from '@/components/EventList';
import { ItemList } from '@/components/ItemList';

export default async function Home() {
  const items = await fetchItems();
  const decisionBodyIds = new Set(items.map((item) => item.decisionBodyId));
  const decisionBodies = Object.fromEntries(
    (
      await Promise.all([...decisionBodyIds.values()].map(fetchDecisionBody))
    ).map((body) => [body.decisionBodyId, body])
  );
  return (
    <div className="flex flex-row bg-white min-w-[700px]">
      <div className="w-1/2 m-4">
        <h1>Upcoming Agenda Items</h1>
        <ItemList items={items} decisionBodies={decisionBodies} />
      </div>
      <div className="w-1/2 m-4">
        <h1>Public Consultations</h1>
        <EventList />
      </div>
    </div>
  );
}
