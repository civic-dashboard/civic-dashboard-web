'use client';

import {
  areSearchFiltersEmpty,
  SubscribableSearchFilters,
} from '@/logic/search';
import { Card } from '@/components/ui/card';
import { decisionBodies } from '@/constants/decisionBodies';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { unsubscribeFromSearch } from '@/backend/emails/subscriptions';
import { allTags } from '@/constants/tags';

type SearchOptionProps = {
  label: string;
  content: string;
};
const SearchFilter = ({ label, content }: SearchOptionProps) => {
  return (
    <p style={{ fontSize: 16, margin: 0 }}>
      <strong>{label}: </strong> {content}
    </p>
  );
};

type SubscriptionCardProps = {
  filters: SubscribableSearchFilters;
  unsubscribeToken: string;
  subscriptionId: number;
};
export const SubscriptionCard = ({
  filters,
  unsubscribeToken,
  subscriptionId,
}: SubscriptionCardProps) => {
  const [state, setState] = useState<
    'subscribed' | 'loading' | 'unsubscsribed'
  >('subscribed');

  const onUnsubscribe = useCallback(async () => {
    setState('loading');
    await unsubscribeFromSearch({
      token: unsubscribeToken,
      id: subscriptionId,
    })
      .catch(() => {
        alert(
          `Sorry, we weren't able to unsubscribe you. We will try to fix this as soon as possible!`,
        );
        setState('subscribed');
      })
      .then(() => {
        setState('unsubscsribed');
      });
  }, [subscriptionId, unsubscribeToken]);

  return (
    <Card className="p-6 space-y-4">
      {areSearchFiltersEmpty(filters) && <p>Subscription to all results</p>}
      {filters.textQuery.length > 0 && (
        <SearchFilter label="Query" content={filters.textQuery} />
      )}
      {filters.tags.length > 0 && (
        <SearchFilter
          label="Tags"
          content={filters.tags.map((t) => allTags[t].displayName).join(', ')}
        />
      )}
      {filters.decisionBodyIds.length > 0 && (
        <SearchFilter
          label="Decision Bodies"
          content={filters.decisionBodyIds
            .map((id) => decisionBodies[id].decisionBodyName)
            .join(', ')}
        />
      )}
      {state === 'loading' && <Spinner />}
      {state !== 'loading' && (
        <Button disabled={state === 'unsubscsribed'} onClick={onUnsubscribe}>
          Unsubscribe
        </Button>
      )}
    </Card>
  );
};
