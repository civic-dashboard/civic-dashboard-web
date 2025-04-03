'use server';

import { SearchOptions as SubscribableSearchFilters } from '@/logic/search';
import * as subscriptions from '@/database/queries/subscriptions';
import { createDB } from '@/database/kyselyDb';
import { sendNewSubscriptionEmail } from '@/backend/emails/sendNewSubscriptionEmail';
import { searchAgendaItems } from '@/database/queries/agendaItems';
import { allTags } from '@/constants/tags';
import { decisionBodies } from '@/constants/decisionBodies';

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

  if (process.env.NEW_EMAIL_ALERT_WEBHOOK) {
    await fetch(process.env.NEW_EMAIL_ALERT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: tags.map((t) => allTags[t].displayName).join(', '),
        decisionBodies: decisionBodyIds
          .map((id) => decisionBodies[id].decisionBodyName)
          .join(', '),
        textSearchUsed: textQuery ? 'Yes' : 'No',
      }),
    });
  }
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
