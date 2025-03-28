import { decisionBodies } from '@/constants/decisionBodies';
import {
  areSearchFiltersEmpty,
  SubscribableSearchFilters,
} from '@/logic/search';
import { Text } from '@react-email/components';
import { allTags } from '@/constants/tags';

type Props = { filters: SubscribableSearchFilters };
export const EmailSubscriptionCard = ({ filters }: Props) => {
  return (
    <>
      {areSearchFiltersEmpty(filters) && (
        <Text>Subscription to all results</Text>
      )}
      {filters.textQuery.length > 0 && (
        <EmailSearchFilter label="Query" content={filters.textQuery} />
      )}
      {filters.tags.length > 0 && (
        <EmailSearchFilter
          label="Tags"
          content={filters.tags.map((t) => allTags[t].displayName).join(', ')}
        />
      )}
      {filters.decisionBodyIds.length > 0 && (
        <EmailSearchFilter
          label="Decision Bodies"
          content={filters.decisionBodyIds
            .map((id) => decisionBodies[id].decisionBodyName)
            .join(', ')}
        />
      )}
    </>
  );
};

type SearchFilterProps = {
  label: string;
  content: string;
};
const EmailSearchFilter = ({ label, content }: SearchFilterProps) => {
  return (
    <Text style={{ fontSize: 16, margin: 0 }}>
      <strong>{label}: </strong> {content}
    </Text>
  );
};
