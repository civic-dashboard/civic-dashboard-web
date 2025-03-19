'use server';

import { SearchOptions } from '@/logic/search';
import * as subscriptions from '@/database/queries/subscriptions';
import { createDB } from '@/database/kyselyDb';
import { sendNewSubscriptionEmail } from '@/backend/emails/sendNewSubscriptionEmail';
import { searchAgendaItems } from '@/database/queries/agendaItems';

type SubscribeToSearchArgs = {
  email: string;
  searchOptions: SearchOptions;
};
export async function subscribeToSearch({
  email,
  searchOptions,
}: SubscribeToSearchArgs) {
  const subscriptionOptions = {
    textQuery: searchOptions.textQuery,
    tags: searchOptions.tags,
    decisionBodyIds: searchOptions.decisionBodyIds,
  };
  const db = createDB();
  await subscriptions.subscribeToSearch(db, { email, ...subscriptionOptions });
  const currentResults = await searchAgendaItems(db, {
    ...subscriptionOptions,
    minimumDate: new Date().getTime(),
    page: 0,
    pageSize: 20,
    sortBy: 'relevance',
    sortDirection: 'descending',
  });
  await sendNewSubscriptionEmail({
    to: email,
    props: {
      items: currentResults.results,
      searchOptions: subscriptionOptions,
    },
  });
}
