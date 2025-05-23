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

const submitCommentHref = (item: AgendaItem, decisionBody: DecisionBody) => {
  const formattedDate = new Date(item.meetingDate).toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const subject = `My comments for ${item.reference} on ${formattedDate} ${decisionBody.decisionBodyName}`;
  const body = `To the City Clerk:

Please add my comments to the agenda for the ${formattedDate} ${decisionBody.decisionBodyId} meeting on item ${item.reference}, ${item.agendaItemTitle}

I understand that my comments and the personal information in this email will form part of the public record and that my name will be listed as a correspondent on agendas and minutes of City Council or its committees. Also, I understand that agendas and minutes are posted online and my name may be indexed by search engines like Google.

Comments:


_____________________________________

You can write whatever you’d like - there’s no one correct way to engage with democracy! That said, your message is likely to be more impactful if you are clear about who you are, what you want, and why you want it.

If you’re not sure how to phrase your comments, try the following simple format to get started!

- Who you are - your name, where you live (if it’s relevant), and any relevant communities you are part of
- Your relationship to the item - why do you care about it? How does it affect you? Why do you think it’s important?
- What you want - what would you like this committee to do? Do you want them to vote yes or no on this item? Do you want them to amend/change it in some way?

Example:

Hi there!

My name is Lisa Michaels, I’m a 20 year resident of the High Park neighbourhood, and I’m a lifelong birder and animal lover.

This item is meant to protect wildlife, and yet it will greatly increase the level of noise in high park, which scares and disorients birds, damages the ecosystem, and makes the park less enjoyable for everyone! Parks are about bringing people and nature together, and this would do the opposite.

I ask that this committee either vote No on this item, or find a way to amend it that does not increase the level of noise in the park. My family, my birding group and I will be following this committee’s actions closely!

Sincerely,
Lisa Michaels
  `;

  return `mailto:${decisionBody.email}?subject=${subject}&body=${body.replaceAll('\n', '%0A')}`;
};

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
  Footer: (props: {
    commentHref: string;
    requestToSpeakHref: string;
  }) => React.ReactNode;
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
        <Footer
          commentHref={submitCommentHref(item, decisionBody)}
          requestToSpeakHref={requestToSpeakHref(item, decisionBody)}
        />
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
      Footer={({ commentHref, requestToSpeakHref }) => (
        <>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="grow sm:flex-initial"
          >
            <a href={commentHref} data-umami-event="Submit comment">
              Submit a comment
            </a>
          </Button>
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
  commentHref: string;
  requestToSpeakHref: string;
};
const TakeActionDropdown = ({
  commentHref,
  requestToSpeakHref,
}: TakeActionDropdownProps) => {
  return (
    <DropdownMenu
      onOpenChange={(isOpen) => isOpen && umami.track('Take action opened')}
    >
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="grow sm:flex-initial">
          Take action
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        <DropdownMenuLink href={commentHref} data-umami-event="Submit comment">
          <MessageSquarePlus />
          Submit a comment
        </DropdownMenuLink>
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
            <TakeActionDropdown {...props} />
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
