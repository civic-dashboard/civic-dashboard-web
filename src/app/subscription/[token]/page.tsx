import { SubscriptionCard } from '@/components/searchSubscriptionCard';
import { createDB } from '@/database/kyselyDb';
import { getSubscriptionsByToken } from '@/database/queries/subscriptions';

type Params = {
  token: string;
};

type Props = {
  params: Promise<Params>;
};
export default async function SubscriptionsPage({ params }: Props) {
  const db = createDB();
  const { token } = await params;
  const subscriptionInfo = await getSubscriptionsByToken(db, token);

  if (!subscriptionInfo) {
    return (
      <main className="p-12 min-h-[500]">
        <h1>We couldn&apos;t find that subscription</h1>
      </main>
    );
  }

  const { subscriber, subscriptions } = subscriptionInfo;

  return (
    <main className="p-12">
      <h2>Subscriptions for:</h2>
      <h3 className="pb-6 break-words break-all">{subscriber.email}</h3>
      <div className="flex-col space-y-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            filters={subscription}
            unsubscribeToken={token}
            subscriptionId={subscription.id}
          />
        ))}
      </div>
    </main>
  );
}
