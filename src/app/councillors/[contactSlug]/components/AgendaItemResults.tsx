'use client';

import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { useMemo, memo, useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import { SummaryPanel } from '@/app/councillors/[contactSlug]/components/SummaryPanel';
import { MotionsList } from '@/app/councillors/[contactSlug]/components/MotionsList';
import { Button, buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import Link from 'next/link';
import { cn } from '@/components/ui/utils';
import { formatAgendaItemStatus } from '@/logic/strings';

const AgendaItemCard = memo(function AgendaItemCard({
  item,
}: {
  item: AgendaItem;
}) {
  const firstMotion = item.motions[0];
  const dateString = firstMotion.dateTime?.substring(0, 10);
  const date = dateString ? new Date(dateString) : new Date(NaN);
  let formattedDate = 'Unknown date';

  if (!isNaN(date.getTime())) {
    date.setMinutes(date.getTimezoneOffset());
    formattedDate = date
      .toLocaleString('default', {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      })
      .replace(/,/g, '');
  }

  return (
    <div className="mb-8 last:mb-0">
      <Card className="transition-shadow h-full flex flex-col">
        <CardHeader>
          <div className="flex gap-x-2 items-center">
            <Chip variant="green">{formattedDate}</Chip>
            <span className="hidden sm:inline font-bold">
              {firstMotion.committeeName}
            </span>
          </div>
          <Link href={`/actions/item/${item.agendaItemNumber}`} target="_blank">
            <Chip
              variant="outline"
              className="hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Link2 size={14} />
              {item.agendaItemNumber}
            </Chip>
          </Link>
        </CardHeader>

        <CardContent className="sm:hidden border-b border-neutral-100 dark:border-neutral-600 flex justify-center p-2">
          <span className="font-bold">{firstMotion.committeeName}</span>
        </CardContent>

        <CardContent className="flex-grow pb-0">
          <div className="relative max-h-[250px] overflow-hidden">
            <div
              className="absolute inset-0 h-[100px] top-[150px] bg-gradient-to-t from-white dark:from-neutral-800 from-1% via-transparent to-transparent pointer-events-none z-10"
              data-overflow-gradient
            />
            <div className="overflow-y-auto max-h-full">
              <CardTitle className="text-lg mb-2">
                {item.agendaItemTitle}
              </CardTitle>
              {item.itemStatus && (
                <div className="mt-2 mb-2">
                  <span className="font-bold">Status:</span>{' '}
                  {formatAgendaItemStatus(item.itemStatus)}
                </div>
              )}
              {item.agendaItemSummary && (
                <SummaryPanel
                  originalSummary={item.agendaItemSummary}
                  aiSummary={item.aiSummary}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-4">
            <Link
              href={`/actions/item/${item.agendaItemNumber}`}
              target="_blank"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors bg-white dark:bg-neutral-800',
              )}
            >
              Learn more
            </Link>
          </div>
          <MotionsList motions={item.motions} />
        </CardContent>
      </Card>
    </div>
  );
});

function usePagination(
  currentPage: number,
  totalItems: number,
  contactSlug: string,
  itemsPerPage: number = 10,
) {
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      totalPages,
      totalItems,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [currentPage, itemsPerPage, totalItems]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/councillors/${contactSlug}/?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    ...paginationData,
    currentPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}) => {
  const getVisiblePages = () => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2 mt-8 mb-8">
      <Button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        variant="secondary-outline"
      >
        Previous
      </Button>

      <div className="flex space-x-1">
        {visiblePages[0] > 1 && (
          <>
            <Button onClick={() => onPageChange(1)} variant="secondary">
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={`${page === currentPage ? 'default' : 'secondary'}`}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
            <Button
              onClick={() => onPageChange(totalPages)}
              variant="secondary"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        onClick={onNextPage}
        disabled={!hasNextPage}
        variant="secondary-outline"
      >
        Next
      </Button>
    </nav>
  );
};

export default function AgendaItemResults({
  contactSlug,
  currentPage,
  //searchTerm = '',
}: {
  contactSlug: string;
  currentPage: number;
  //searchTerm?: string;
}) {
  if (currentPage <= 0) currentPage = 1;

  const pageSize = 10; // make this dynamic based on user selection

  const [pageAgendaItems, setPageAgendaItems] = useState<AgendaItem[]>([]);
  const [agendaItemCount, setAgendaItemCount] = useState(0);

  /*
  const tidySearchQuery = searchTerm.toLocaleLowerCase().trim();

  // if frontend search is re-enabled, use filteredItems in the JSX result instead of pageAgendaItems
  const filteredItems = useMemo(
    () =>
      tidySearchQuery
        ? pageAgendaItems.filter((item) =>
            item.agendaItemTitle.toLowerCase().includes(tidySearchQuery),
          )
        : pageAgendaItems,
    [pageAgendaItems, tidySearchQuery],
  );
  */
  const {
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(currentPage, agendaItemCount, contactSlug, 10);

  useEffect(() => {
    setPageAgendaItems([]);
    const res = async () => {
      const response = await fetch(
        `/api/councillor-items?contactSlug=${contactSlug}&page=${currentPage}&pageSize=${pageSize}`,
        {
          method: 'GET',
        },
      );
      const itemCount = Number(response.headers.get('agenda-item-count'));
      const newAgendaItems = (await response.json()) as AgendaItem[];
      if (!newAgendaItems || !itemCount) return;

      if (itemCount && itemCount > 0) setAgendaItemCount(itemCount);

      setPageAgendaItems(newAgendaItems);
    };
    res();
  }, [currentPage, contactSlug]);

  return (
    <div>
      {totalItems > 0 ? (
        <>
          <div className="flex justify-between items-center mt-8 mb-4">
            <div className="text-sm text-gray-500">
              {totalItems >= startIndex ? (
                <>
                  Showing {startIndex}-{endIndex} of {totalItems} results
                </>
              ) : (
                <>Invalid page.</>
              )}
            </div>
          </div>
          <div>
            {pageAgendaItems && totalItems >= startIndex ? (
              pageAgendaItems.map((item) => (
                <AgendaItemCard key={item.agendaItemNumber} item={item} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No agenda items.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-center py-8 text-gray-500">
            Loading agenda items...
          </div>
        </>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />
    </div>
  );
}
