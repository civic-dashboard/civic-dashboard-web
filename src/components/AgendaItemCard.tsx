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
import type {
  AgendaItem,
  AgendaItemSearchResult,
} from '@/database/queries/agendaItems';
import { useSearch } from '@/contexts/SearchContext';
import { Chip, ChipLink } from '@/components/ui/chip';
import { Link2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SubmitCommentModal } from '@/components/deputation-modals/SubmitCommentModal';
import { RequestToSpeakModal } from '@/components/deputation-modals/RequestToSpeakModal';
import { allTags } from '@/constants/tags';
import React from 'react';
import { sanitize } from '@/logic/sanitize';
import { formatAgendaItemStatus } from '@/logic/strings';

import { getStartOfToday } from '@/logic/date';
import { Text } from '@/components/ui/text-items';

const cardDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
  timeZone: 'America/Toronto',
});

const cardDateMonthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'America/Toronto',
});

const cardDateDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  timeZone: 'America/Toronto',
});

const cardDateYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  timeZone: 'America/Toronto',
});

function itemDateIsAfterToday(dateNumber: number): boolean {
  const today = getStartOfToday();

  const date = new Date(dateNumber);

  return date >= today;
}

function DisplayTag({ tagKey, tagName }: { tagKey: string; tagName: string }) {
  return (
    <Link className="mr-1" href={`/actions?tag=${tagKey}`}>
      <Chip
        className="hover:border-gray-400 text-sm hover:underline"
        variant="outline"
      >
        {tagName.toLowerCase()}
      </Chip>
    </Link>
  );
}

type AgendaItemCardProps = React.PropsWithChildren<{
  item: AgendaItem;
  decisionBody: DecisionBody;
  externalLink?: string;
  Footer: () => React.ReactNode;
  className?: string;
}>;

function AgendaItemCard({
  item,
  className,
  Footer,
  externalLink,
  children,
}: AgendaItemCardProps) {
  const formattedDate = cardDateFormatter
    .format(new Date(item.meetingDate))
    .replace(',', '');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-x-2">
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
      <CardContent className="sm:hidden flex justify-center p-2 border-neutral-100 dark:border-neutral-600 border-b">
        <span className="font-bold">{item.decisionBodyName}</span>
      </CardContent>
      <CardContent className="[&_ul]:ml-8 [&_td]:dark:!border-white [&_ul]:list-disc">
        {children}
      </CardContent>
      <CardFooter>
        <Footer />
      </CardFooter>
    </Card>
  );
}

type FullPageAgendaItemCardProps = React.PropsWithChildren<{
  item: AgendaItem;
  decisionBody: DecisionBody;
}>;
export function FullPageAgendaItemCard({
  item,
  decisionBody,
  children,
}: FullPageAgendaItemCardProps) {
  const isMeetingUpcomingOrToday = itemDateIsAfterToday(item.meetingDate);

  const textToSearch = (
    (item.agendaItemRecommendation ?? '') +
    item.agendaItemSummary +
    item.agendaItemTitle
  ).toLowerCase();

  const relatedTags: { key: string; displayName: string }[] = [];
  Object.entries(allTags).forEach(([key, tag]) => {
    const tagName = tag['displayName'];
    const tagSearch = tag['searchQuery'].replaceAll('"', '').split(' OR ');

    for (const keyword of tagSearch) {
      if (textToSearch.includes(keyword)) {
        relatedTags.push({ key, displayName: tagName });
        break;
      }
    }
  });

  return (
    <AgendaItemCard
      className="max-sm:rounded-none"
      item={item}
      decisionBody={decisionBody}
      externalLink={`https://secure.toronto.ca/council/agenda-item.do?item=${item.reference}`}
      Footer={() => (
        <>
          {isMeetingUpcomingOrToday && (
            <SubmitCommentModal
              agendaItem={item}
              decisionBody={decisionBody}
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="sm:flex-initial grow"
                  data-umami-event="Submit comment"
                >
                  Submit a comment
                </Button>
              }
            />
          )}
          {isMeetingUpcomingOrToday && (
            <RequestToSpeakModal
              agendaItem={item}
              decisionBody={decisionBody}
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="sm:flex-initial grow"
                  data-umami-event="Request to speak"
                >
                  Request to speak
                </Button>
              }
            />
          )}
        </>
      )}
    >
      <CardTitle>{item.agendaItemTitle}</CardTitle>
      {item.itemStatus && (
        <div className="mt-2">
          <span className="font-bold">Status:</span>{' '}
          {formatAgendaItemStatus(item.itemStatus)}
        </div>
      )}

      {item.decisionRecommendations && (
        <>
          <h4 className="mt-4 font-bold">Decision</h4>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: sanitize(item.decisionRecommendations),
            }}
          />
        </>
      )}

      {item.decisionAdvice && (
        <>
          <h4 className="mt-4 font-bold">
            Decision Advice and Other Information
          </h4>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: sanitize(item.decisionAdvice) }}
          />
        </>
      )}

      {(item.agendaItemRecommendation ||
        item.decisionRecommendations ||
        item.decisionAdvice) && (
        <>
          {(item.decisionRecommendations || item.decisionAdvice) && (
            <hr className="my-8 border-neutral-100 dark:border-neutral-600 border-t" />
          )}
          <h4 className="mt-4 font-bold">Summary</h4>
        </>
      )}
      <div
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: sanitize(item.agendaItemSummary) }}
      />

      {item.agendaItemRecommendation && !item.decisionRecommendations && (
        <>
          <h4 className="mt-4 font-bold">Recommendations</h4>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: sanitize(item.agendaItemRecommendation),
            }}
          />
        </>
      )}
      {item.backgroundAttachmentId && (
        <>
          <h4 className="mt-8 mb-1 font-bold">Background Information</h4>
          {item.backgroundAttachmentId.map((id, i) => {
            return (
              <ChipLink
                className="mr-1 pl-2"
                href={`https://www.toronto.ca/legdocs/mmis/${item.termYear}/${item.agendaCd.toLowerCase()}/bgrd/backgroundfile-${id}.pdf`}
                key={i}
                target="_blank"
                variant="outline"
              >
                <Paperclip size={14} />
                Attachment {i + 1}
              </ChipLink>
            );
          })}
        </>
      )}
      {relatedTags.length > 0 && (
        <>
          <h4 className="mt-4 mb-1 font-bold">Related tags</h4>
          {relatedTags.map((tag) => (
            <DisplayTag
              tagKey={tag.key}
              tagName={tag.displayName}
              key={tag.key}
            />
          ))}
        </>
      )}
      {children}
    </AgendaItemCard>
  );
}

type SearchResultAgendaItemCardProps = {
  item: AgendaItemSearchResult;
  className?: string;
};

export function SearchResultMeetingDetails({
  item,
}: {
  item: AgendaItemSearchResult;
}) {
  const meetingDate = new Date(item.meetingDate);

  return (
    <div className="sm:top-26 sm:sticky flex items-center items-stretch self-start gap-4 pt-2">
      <div className="flex flex-col justify-center items-center bg-neutral-100 dark:bg-neutral-700 px-2 py-2 w-20 h-20 text-center shrink-0">
        <p className="font-semibold text-xs uppercase leading-none">
          {cardDateMonthFormatter.format(meetingDate)}
        </p>
        <p className="mt-[4px] text-3xl leading-none">
          {cardDateDayFormatter.format(meetingDate)}
        </p>
        <p className="mt-[6px] text-gray-darkest dark:text-gray-300 text-xs leading-none">
          {cardDateYearFormatter.format(meetingDate)}
        </p>
      </div>
      <div className="pl-3 border-primary border-l-2 font-semibold text-gray-darkest dark:text-gray-300 text-base leading-tight">
        <Text className="mb-0 font-semibold" preset="Body">
          {item.decisionBodyName}
        </Text>
      </div>
    </div>
  );
}

export function SearchResultAgendaItemCard({
  item,
  className,
}: SearchResultAgendaItemCardProps) {
  const {
    searchOptions: { textQuery },
  } = useSearch();
  return (
    <Link
      className={`group block pb-4 md:p-2 md:hover:bg-primary-lightest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ''}`}
      href={`/actions/item/${item.reference}`}
      target="_blank"
    >
      <div className="flex gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <HighlightChildren terms={textQuery}>
            <Text
              className="mb-1 text-primary decoration-4 decoration-primary-light group-:underline"
              preset="Heading4"
              tag="h2"
            >
              {item.agendaItemTitle}
            </Text>
          </HighlightChildren>
          {item.searchHeadline ? (
            <div
              className="[&_mark]:bg-yellow-200 dark:[&_mark]:bg-yellow-800 mt-1 [&_mark]:rounded-sm line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: sanitize(item.searchHeadline),
              }}
            />
          ) : (
            <div
              className="text-gray-dark group-hover:text-black text-sm line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: sanitize(item.agendaItemSummary),
              }}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
