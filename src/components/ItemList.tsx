import { fetchDecisionBody } from '@/api/decisionbody';
import { fetchItems } from '@/api/item';
import { ItemCard } from '@/components/ItemCard';

export async function ItemList() {
  const items = await fetchItems();
  const decisionBodyIds = new Set(items.map((item) => item.decisionBodyId));
  const decisionBodies = Object.fromEntries(
    (
      await Promise.all([...decisionBodyIds.values()].map(fetchDecisionBody))
    ).map((body) => [body.decisionBodyId, body])
  );
  return (
    <div className="flex-col space-y-4 p-4 bg-slate-200">
      {items?.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          decisionBody={decisionBodies[item.decisionBodyId]}
        />
      ))}
    </div>
  );
}
