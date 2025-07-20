'use client';

import { DecisionBody } from '@/api/decisionBody';
import { HighlightChildren } from '@/components/ui/highlightChildren';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AgendaItem } from '@/database/queries/agendaItems';
import { useSearch } from '@/contexts/SearchContext';
import { Chip, ChipLink } from '@/components/ui/chip';
import { Link2, MessageSquarePlus, Speech } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLink,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import Link from 'next/link';
import { logAnalytics } from '@/api/analytics';
import { AgendaItemCommentModal } from '@/components/AgendaItemCommentModal';

const requestToSpeakHref = (item: AgendaItem, decisionBody: DecisionBody) => {
  const formattedDate = new Date(item.meetingDate).toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const subject = `Request to appear before ${formattedDate} ${decisionBody.decisionBodyName} on item ${item.agendaItemId}`;
  const body = `To the City Clerk:

I would like to appear before the ${formattedDate} ${decisionBody.decisionBodyId} to speak on item ${item.reference}, ${item.agendaItemTitle}

Name:
Organization (if applicable):
Mailing Address:
Telephone:

To learn more about speaking to committees, visit: toronto.ca/council

****
Notice:

When you request to speak, your name, e-mail, mailing address become part of the record of the meeting.
  - The day of the meeting, your name will appear on the "Speakers List" which is posted online
  - If you choose to speak, you will appear in the live broadcast and video archive of the meeting
  - Your name will appear online in the meeting minutes
  - For certain items, we will share your information with third-parties like the Local Planning Appeal Tribunal as required by law

We are collecting your information under the authority of the Toronto Municipal Code Chapter 27, Council Procedures or any other applicable procedural By-law. As permitted under Section 27 of the Municipal Freedom of Information and Privacy Act, we are collecting this information to create a public record. Information in public records is not subject to privacy requirements. Have questions? Call or write: 416-392-8016 or clerk@toronto.ca
  `;

  return `mailto:${decisionBody.email}?subject=${subject}&body=${body.replaceAll('\n', '%0A')}`;
};

type AgendaItemCardProps = React.PropsWithChildren<{
  item: AgendaItem;
  decisionBody: DecisionBody;
  externalLink?: string;
  Footer: (props: { requestToSpeakHref: string }) => React.ReactNode;
  className?: string;
}>;

function AgendaItemCard({
  item,
  decisionBody,
  className,
  Footer,
  externalLink,
  children,
}: AgendaItemCardProps) {
  const formattedDate = new Date(item.meetingDate)
    .toLocaleString('default', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    })
    .replace(',', '');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex gap-x-2 items-center">
          <Chip variant="green">{formattedDate}</Chip>
          <span className="hidden sm:inline font-bold">
            {item.decisionBodyName}
          </span>
        </div>
        {externalLink ? (
          <ChipLink href={externalLink} target="_blank" variant="outline">
            <Link2 size={14} />
            {item.reference}
          </ChipLink>
        ) : (
          <Chip variant="outline">
            <Link2 size={14} />
            {item.reference}
          </Chip>
        )}
      </CardHeader>
      <CardContent className="sm:hidden border-b border-neutral-100 dark:border-neutral-600 flex justify-center p-2">
        <span className="font-bold">{item.decisionBodyName}</span>
      </CardContent>
      <CardContent className="[&_ul]:ml-8 [&_ul]:list-disc [&_td]:dark:!border-white">
        {children}
      </CardContent>
      <CardFooter>
        <Footer requestToSpeakHref={requestToSpeakHref(item, decisionBody)} />
      </CardFooter>
    </Card>
  );
}

type FullPageAgendaItemCardProps = {
  item: AgendaItem;
  decisionBody: DecisionBody;
};
export function FullPageAgendaItemCard({
  item,
  decisionBody,
}: FullPageAgendaItemCardProps) {
  return (
    <AgendaItemCard
      className="max-sm:rounded-none"
      item={item}
      decisionBody={decisionBody}
      externalLink={`https://secure.toronto.ca/council/agenda-item.do?item=${item.reference}`}
      Footer={({ requestToSpeakHref }) => (
        <>
          <AgendaItemCommentModal
            agendaItem={item}
            decisionBody={decisionBody}
            trigger={
              <Button
                size="lg"
                variant="outline"
                className="grow sm:flex-initial"
                data-umami-event="Submit comment"
              >
                Submit a comment
              </Button>
            }
          />
          <Button asChild size="lg" className="grow sm:flex-initial">
            <a href={requestToSpeakHref} data-umami-event="Request to speak">
              Request to speak
            </a>
          </Button>
        </>
      )}
    >
      <CardTitle className="text-lg">{item.agendaItemTitle}</CardTitle>
      {item.agendaItemRecommendation && (
        <h4 className="mt-4 font-bold">Summary</h4>
      )}
      <div
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      />

      {item.agendaItemRecommendation && (
        <>
          <h4 className="mt-4 font-bold">Recommendations</h4>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: item.agendaItemRecommendation }}
          />
        </>
      )}
    </AgendaItemCard>
  );
}

type TakeActionDropdownProps = {
  requestToSpeakHref: string;
  agendaItem: AgendaItem;
  decisionBody: DecisionBody;
};
const TakeActionDropdown = ({
  requestToSpeakHref,
  agendaItem,
  decisionBody,
}: TakeActionDropdownProps) => {
  return (
    <DropdownMenu
      onOpenChange={(isOpen) => isOpen && logAnalytics('Take action opened')}
    >
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="grow sm:flex-initial">
          Take action
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        <AgendaItemCommentModal
          agendaItem={agendaItem}
          decisionBody={decisionBody}
          trigger={
            // This duplicates the classes on DropdownMenuItem. Doing it this way because
            // Using that component directly causes the opened modal to immediately unmount
            // when the menu item is clicked
            <button
              className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              data-umami-event="Submit comment"
            >
              <MessageSquarePlus /> Submit a comment
            </button>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuLink
          href={requestToSpeakHref}
          data-umami-event="Request to speak"
        >
          <Speech />
          Request to speak
        </DropdownMenuLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type SearchResultAgendaItemCardProps = {
  item: AgendaItem;
  decisionBody: DecisionBody;
};
export function SearchResultAgendaItemCard({
  item,
  decisionBody,
}: SearchResultAgendaItemCardProps) {
  const {
    searchOptions: { textQuery },
  } = useSearch();

  return (
    <Link href={`/actions/item/${item.reference}`} target="_blank">
      <AgendaItemCard
        item={item}
        decisionBody={decisionBody}
        className="transition-shadow sm:hover:shadow-xl dark:hover:bg-neutral-700 group"
        Footer={(props) => (
          <>
            <Button
              size="lg"
              variant="outline"
              className="grow sm:flex-initial"
            >
              Learn more
            </Button>
            <TakeActionDropdown
              requestToSpeakHref={props.requestToSpeakHref}
              agendaItem={item}
              decisionBody={decisionBody}
            />
          </>
        )}
      >
        <div className="relative max-h-[200px] overflow-hidden">
          <div
            className="absolute inset-0 h-[100px] top-[100px] bg-gradient-to-t from-white dark:from-neutral-800 dark:group-hover:from-neutral-700 from-1% via-transparent to-transparent pointer-events-none"
            data-overflow-gradient
          />
          <div className="overflow-y-auto max-h-full">
            <HighlightChildren terms={textQuery}>
              <CardTitle>{item.agendaItemTitle}</CardTitle>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
              />
            </HighlightChildren>
          </div>
        </div>
      </AgendaItemCard>
    </Link>
  );
}
