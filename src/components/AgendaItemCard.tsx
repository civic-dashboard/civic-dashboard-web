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
import { Link2, MessageSquarePlus, Speech, Bell, Vote, UserSquare2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLink,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import Link from 'next/link';
import { ThumbsUpIcon, ThumbsDownIcon, CircleMinusIcon, CircleDotDashedIcon } from 'lucide-react';
import Image from 'next/image';

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
            <a href={commentHref}>Submit a comment</a>
          </Button>
          <Button asChild size="lg" className="grow sm:flex-initial">
            <a href={requestToSpeakHref}>Request to speak</a>
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
        Footer={({ commentHref, requestToSpeakHref }) => (
          <>
            <Button
              size="lg"
              variant="outline"
              className="grow sm:flex-initial"
            >
              Learn more
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="grow sm:flex-initial">
                  Take action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end">
                <DropdownMenuLink href={commentHref}>
                  <MessageSquarePlus />
                  Submit a comment
                </DropdownMenuLink>
                <DropdownMenuSeparator />
                <DropdownMenuLink href={requestToSpeakHref}>
                  <Speech />
                  Request to speak
                </DropdownMenuLink>
              </DropdownMenuContent>
            </DropdownMenu>
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

type Motion = {
  committeeSlug: string;
  motionType: string;
  motionId: string;
  voteDescription: string;
  dateTime: string;
  value: string;
  tally: string;
  resultKind: string;
  committeeName: string;
};

type SearchPageAgendaItemCardProps = {
  item: AgendaItem;
  decisionBody: DecisionBody;
  categories: string[];
  motions: Motion[];
};

export function SearchPageAgendaItemCard({
  item,
  decisionBody,
  categories,
  motions,
}: SearchPageAgendaItemCardProps) {
  return (
    <Link href={`/actions/item/${item.reference}`}>
      <AgendaItemCard
        item={item}
        decisionBody={decisionBody}
        className="transition-shadow hover:shadow-md"
        Footer={() => (
          <Button size="lg" className="w-full" variant="default">
            Learn more
          </Button>
        )}
      >
        <div className="space-y-4">
          {/* Category tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip key={category} variant="secondary" className="bg-neutral-100 dark:bg-neutral-800">
                {category}
              </Chip>
            ))}
          </div>

          {/* Title and summary */}
          <div>
            <h3 className="text-lg font-semibold">{item.agendaItemTitle}</h3>
            <div
              className="mt-2 text-neutral-600 dark:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
            />
          </div>

          {/* Decision section if present */}
          {item.agendaItemRecommendation && (
            <div>
              <h4 className="font-bold mb-2">The decision</h4>
              <div
                className="text-neutral-600 dark:text-neutral-300"
                dangerouslySetInnerHTML={{ __html: item.agendaItemRecommendation }}
              />
            </div>
          )}

          {/* Motions section using the councillor page style */}
          <div className="mt-2">
            {motions.map((motion) => (
              <div key={motion.motionId} className="border-t p-4">
                <dl className="flex -center mb-2 text-xs gap-1">
                  <dt>Date</dt>
                  <dd className="text-gray-500">{motion.dateTime}</dd>
                  <dt className="ml-auto">Motion</dt>
                  <dd className="text-gray-500">{motion.motionType}</dd>
                </dl>

                <dl className="flex flex-row gap-4 justify-between items-center text-xs">
                  <div className="flex items-center">
                    <dt className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1870F8] text-white text-md">
                      <VoteIcon value={motion.value} />
                    </dt>
                    <dd className="pl-2">
                      <div>Vote</div>
                      <div className="text-gray-500">{motion.value}</div>
                    </dd>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <dt>Decision body</dt>
                    <dd className="text-gray-500">{motion.committeeName}</dd>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <dt>Total</dt>
                    <dd className="text-gray-500">{motion.tally}</dd>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <dt>Status</dt>
                    <dd className="text-gray-500">{motion.resultKind}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </AgendaItemCard>
    </Link>
  );
}

// Add the VoteIcon component at the top of the file
const VoteIcon = ({ value }: { value: string }) => {
  switch (value?.toLowerCase()) {
    case 'yes':
      return <ThumbsUpIcon className="w-4 h-4" />;
    case 'no':
      return <ThumbsDownIcon className="w-4 h-4" />;
    case 'absent':
      return <CircleMinusIcon className="w-4 h-4" />;
    default:
      return <CircleDotDashedIcon className="w-4 h-4" />;
  }
};

// Add Councillor type before the SearchPageCouncillorCard
export type Councillor = {
  id: string;
  name: string;
  ward: string;
  wardNumber: number;
  email: string;
  phone: string;
  photoUrl: string;
  keyIssues: string[];
  profile: string;
  stats: {
    voted: number;
    moved: number;
    seconded: number;
  };
};

export function SearchPageCouncillorCard({ councillor, decisionBody }: { councillor: Councillor; decisionBody: DecisionBody }) {
  const mockItem = {
    id: councillor.id,
    decisionBodyId: decisionBody.decisionBodyId,
    decisionBodyName: decisionBody.decisionBodyName,
    meetingDate: new Date().getTime(),
    reference: `Ward ${councillor.wardNumber}`,
    agendaItemTitle: councillor.name,
    agendaItemSummary: councillor.profile,
  } as AgendaItem;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div>
          <Chip variant="secondary" className="bg-blue-100 text-black">Current Councillor</Chip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Profile section */}
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={councillor.photoUrl}
                alt={councillor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{councillor.name}</h3>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600">Ward {councillor.wardNumber}, {councillor.ward}</p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <div>
              <span className="font-medium">Email</span>{" "}
              <a href={`mailto:${councillor.email}`} className="text-blue-600 hover:underline">{councillor.email}</a>
            </div>
            <div>
              <span className="font-medium">Phone</span>{" "}
              <a href={`tel:${councillor.phone}`} className="text-blue-600 hover:underline">{councillor.phone}</a>
            </div>
          </div>

          {/* Key Issues */}
          <div>
            <h4 className="font-semibold mb-2">Key Issues</h4>
            <div className="flex flex-wrap gap-2">
              {councillor.keyIssues.map((issue) => (
                <Chip key={issue} variant="secondary" className="bg-neutral-100 dark:bg-neutral-800">
                  {issue}
                </Chip>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div>
            <h4 className="font-semibold mb-2">Profile</h4>
            <p className="text-gray-600">{councillor.profile}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              <span className="font-medium">Voted ({councillor.stats.voted})</span>
            </div>
            <div className="flex items-center gap-2">
              <UserSquare2 className="h-5 w-5" />
              <span className="font-medium">Moved ({councillor.stats.moved})</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              <span className="font-medium">Seconded ({councillor.stats.seconded})</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full" variant="default">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  );
}
