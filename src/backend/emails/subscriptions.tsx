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
import { SubscriptionUpdateEmail } from '@/backend/emails/templates/subscriptionUpdate';
import { render } from 'react-email';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { getDecisionBodies } from '@/database/queries/decisionBodies';

import { getStartOfToday } from '@/logic/date';

const PREVIEW_UNSUBSCRIBE_TOKEN = 'preview';

async function searchCurrentResults(
  db: Kysely<DB>,
  filters: SubscribableSearchFilters,
) {
  return searchAgendaItems(db, {
    options: {
      ...filters,
      minimumDate: getStartOfToday(),
      sortBy: 'relevance',
      sortDirection: 'descending',
    },
    pagination: {
      page: 0,
      pageSize: 20,
    },
  });
}

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

  const currentResults = await searchCurrentResults(db, filters);
  await sendNewSubscriptionEmail({
    to: email,
    props: {
      unsubscribeToken,
      items: currentResults.results,
      filters: filters,
    },
  });

  if (process.env.NEW_EMAIL_ALERT_WEBHOOK) {
    const decisionBodies = await getDecisionBodies(db);
    await fetch(process.env.NEW_EMAIL_ALERT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: tags.map((t) => allTags[t].displayName).join(', '),
        decisionBodies: decisionBodyIds
          .map((id) => decisionBodies[id]?.decisionBodyName)
          .filter(Boolean)
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

  const currentResults = await searchCurrentResults(db, filters);

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
        pageSize: 20,
      },
    });
    displayResults = pastResults.results;
  }

  const decisionBodies = await getDecisionBodies(db);
  const previewHtml = await render(
    <SubscriptionUpdateEmail
      unsubscribeToken={PREVIEW_UNSUBSCRIBE_TOKEN}
      items={displayResults}
      filters={[filters]}
      decisionBodies={decisionBodies}
    />,
  );
  return {
    previewHtml,
    hasMatchingResults: displayResults.length > 0,
  };
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
