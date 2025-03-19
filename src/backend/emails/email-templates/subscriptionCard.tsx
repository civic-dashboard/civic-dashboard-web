import { decisionBodies } from '@/constants/decisionBodies';
import { SearchOptions } from '@/logic/search';
import { Text } from '@react-email/components';

type Props = { searchOptions: SearchOptions };
export const EmailSubscriptionCard = ({ searchOptions }: Props) => {
  return (
    <>
      {searchOptions.textQuery && (
        <SearchOption label="Query" content={searchOptions.textQuery} />
      )}
      {searchOptions.tags.length > 0 && (
        <SearchOption label="Tags" content={searchOptions.tags.join(', ')} />
      )}
      {searchOptions.decisionBodyIds.length > 0 && (
        <SearchOption
          label="Decision Bodies"
          content={searchOptions.decisionBodyIds
            .map((id) => decisionBodies[id].decisionBodyName)
            .join(', ')}
        />
      )}
    </>
  );
};

type SearchOptionProps = {
  label: string;
  content: string;
};
function SearchOption({ label, content }: SearchOptionProps) {
  return (
    <Text style={{ fontSize: 16, margin: 0 }}>
      <strong>{label}: </strong> {content}
    </Text>
  );
}
