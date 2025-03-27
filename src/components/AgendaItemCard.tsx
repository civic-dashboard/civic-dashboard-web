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
import { Badge } from '@/components/ui/badge';
import { Link2, MessageSquarePlus, Speech } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLink,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

type Props = {
  item: AgendaItem;
  decisionBody: DecisionBody;
};

export function AgendaItemCard({ item, decisionBody }: Props) {
  const {
    searchOptions: { textQuery },
  } = useSearch();
  const formattedDate = new Date(item.meetingDate)
    .toLocaleString('default', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    })
    .replace(',', '');
  const commentsHref = `mailto:${decisionBody.email}?subject=My comments for ${item.reference}&body=My comments`;
  const requestHref = `mailto:${decisionBody.email}?subject=Request to appear before ${item.decisionBodyName} on item ${item.reference}&body=Request to appear`;

  return (
    <Card>
      <CardHeader>
        <Badge variant="green">{formattedDate}</Badge>
        <Badge variant="outline">
          <Link2 size={14} />
          {item.reference}
        </Badge>
      </CardHeader>
      <CardContent className="relative max-h-[200px] overflow-hidden">
        <div className="absolute inset-0 h-[100px] top-[100px] bg-gradient-to-t from-white from-1% via-transparent to-transparent pointer-events-none"></div>
        <div className="overflow-y-auto max-h-full">
          <HighlightChildren terms={textQuery}>
            <CardTitle>{item.agendaItemTitle}</CardTitle>
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
            />
          </HighlightChildren>
        </div>
      </CardContent>
      <CardContent className="border border-neutral-100 flex justify-center p-2">
        {item.decisionBodyName}
      </CardContent>
      <CardFooter>
        <Button size="lg" variant="outline" className="grow sm:flex-initial">
          Learn more
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="grow sm:flex-initial">
              Take action
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            <DropdownMenuLink href={commentsHref}>
              <MessageSquarePlus />
              Submit a comment
            </DropdownMenuLink>
            <DropdownMenuSeparator />
            <DropdownMenuLink href={requestHref}>
              <Speech />
              Request to speak
            </DropdownMenuLink>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
