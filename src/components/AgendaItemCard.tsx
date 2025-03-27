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
import { Chip } from '@/components/ui/chip';
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

type AgendaItemCardProps = React.PropsWithChildren<{
  item: AgendaItem;
  decisionBody: DecisionBody;
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
  children,
}: AgendaItemCardProps) {
  const formattedDate = new Date(item.meetingDate)
    .toLocaleString('default', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    })
    .replace(',', '');
  const commentHref = `mailto:${decisionBody.email}?subject=My comments for ${item.reference}&body=My comments`;
  const requestToSpeakHref = `mailto:${decisionBody.email}?subject=Request to appear before ${item.decisionBodyName} on item ${item.reference}&body=Request to appear`;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex gap-x-2 items-center">
          <Chip variant="green">{formattedDate}</Chip>
          <span className="hidden sm:inline font-bold">
            {item.decisionBodyName}
          </span>
        </div>
        <Chip variant="outline">
          <Link2 size={14} />
          {item.reference}
        </Chip>
      </CardHeader>
      <CardContent className="sm:hidden border-b border-neutral-100 dark:border-neutral-600 flex justify-center p-2">
        <span className="font-bold">{item.decisionBodyName}</span>
      </CardContent>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Footer
          commentHref={commentHref}
          requestToSpeakHref={requestToSpeakHref}
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
      <CardTitle>{item.agendaItemTitle}</CardTitle>
      <div
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      />
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
