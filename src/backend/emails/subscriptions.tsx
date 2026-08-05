'use server';

import { SearchOptions as SubscribableSearchFilters } from '@/logic/search';
import * as subscriptions from '@/database/queries/subscriptions';
import { createDB } from '@/database/kyselyDb';
import { sendNewSubscriptionEmail } from '@/backend/emails/sendNewSubscriptionEmail';
import {
  AgendaItemSearchResult,
  searchAgendaItems,
} from '@/database/queries/agendaItems';
import { allTags } from '@/constants/tags';
import { decisionBodies } from '@/constants/decisionBodies';
import { SubscriptionUpdateEmail } from '@/backend/emails/templates/subscriptionUpdate';
import { SAMPLE_AGENDA_ITEMS } from '@/backend/emails/sampleAgendaItems';
import { render } from 'react-email';

import { getStartOfToday } from '@/logic/date';

const PREVIEW_UNSUBSCRIBE_TOKEN = 'preview';

type SubscribeToSearchArgs = {
  email: string;
  filters: SubscribableSearchFilters;
};
export async function subscribeToSearch({
  email,
  filters: { textQuery, tags, decisionBodyIds },
}: SubscribeToSearchArgs) {
  if (!email || !email.trim()) return;
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
  const startOfToday = getStartOfToday();

  const currentResults = await searchAgendaItems(db, {
    options: {
      ...filters,
      minimumDate: startOfToday,
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

type PreviewSubscriptionEmailArgs = {
  filters: SubscribableSearchFilters;
};
export async function previewSubscriptionEmail({
  filters: { textQuery, tags, decisionBodyIds },
}: PreviewSubscriptionEmailArgs) {
  const filters = {
    textQuery,
    tags,
    decisionBodyIds,
  };

  const db = createDB();
  const startOfToday = getStartOfToday();

  let displayResults: AgendaItemSearchResult[] = [];

  const currentResults = await searchAgendaItems(db, {
    options: {
      ...filters,
      minimumDate: startOfToday,
      sortBy: 'relevance',
      sortDirection: 'descending',
    },
    pagination: {
      page: 0,
      pageSize: 20,
    },
  });

  if (currentResults.totalCount > 0) {
    displayResults = currentResults.results;
  } else {
    const pastResults = await searchAgendaItems(db, {
      options: {
        ...filters,
        maximumDate: new Date(startOfToday.getTime() - 1),
        sortBy: 'date',
        sortDirection: 'descending',
      },
      pagination: {
        page: 0,
        pageSize: 10,
      },
    });
    displayResults = pastResults.results;
  }

  const previewHtml = await render(
    <SubscriptionUpdateEmail
      unsubscribeToken={PREVIEW_UNSUBSCRIBE_TOKEN}
      items={displayResults}
      filters={[filters]}
    />,
  );
  return { previewHtml };
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
