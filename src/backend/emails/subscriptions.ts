'use server';

import { SearchOptions as SubscribableSearchFilters } from '@/logic/search';
import * as subscriptions from '@/database/queries/subscriptions';
import { createDB } from '@/database/kyselyDb';
import { sendNewSubscriptionEmail } from '@/backend/emails/sendNewSubscriptionEmail';
import { searchAgendaItems } from '@/database/queries/agendaItems';

type SubscribeToSearchArgs = {
  email: string;
  filters: SubscribableSearchFilters;
};
export async function subscribeToSearch({
  email,
  filters: { textQuery, tags, decisionBodyIds },
}: SubscribeToSearchArgs) {
  const filters = {
    textQuery,
    tags,
    decisionBodyIds,
  };
  const db = createDB();
  const { unsubscribeToken } = await subscriptions.subscribeToSearch(db, {
    email,
    ...filters,
  });
  const currentResults = await searchAgendaItems(db, {
    options: {
      ...filters,
      minimumDate: new Date(),
      sortBy: 'relevance',
      sortDirection: 'descending',
    },
    pagination: {
      page: 0,
      pageSize: 20,
    },
  });
  await sendNewSubscriptionEmail({
    to: email,
    props: {
      unsubscribeToken,
      items: currentResults.results,
      filters: filters,
    },
  });
}

type UnsubscribeFromSearchArgs = {
  token: string;
  id: number;
};
export async function unsubscribeFromSearch({
  token,
  id,
}: UnsubscribeFromSearchArgs) {
  const db = createDB();
  await subscriptions.unsubscribeFromSearch(db, { token, subscriptionId: id });
}
