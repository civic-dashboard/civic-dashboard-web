import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { useMemo, memo, useState, useEffect } from 'react';
import { Link2Icon } from 'lucide-react';
import { SummaryPanel } from '@/app/councillors/[contactSlug]/components/SummaryPanel';
import { MotionsList } from '@/app/councillors/[contactSlug]/components/MotionsList';
import { AgendaItemLink } from '@/components/AgendaItemLink';
import { buttonVariants, Button } from '@/components/ui/button';

const AgendaItemCard = memo(function AgendaItemCard({
  item,
}: {
  item: AgendaItem;
}) {
  return (
    <div className="flex flex-row mb-8">
      <div className="border rounded-xl w-full">
        <div className="flex justify-between border-b px-4 py-3">
          <div className="border rounded-lg px-4 py-[10px] text-xs text-black font-semibold bg-[#a5f2d4]">
            {formatDateString(item.motions[0].dateTime)}
          </div>
          <AgendaItemLink
            className={buttonVariants({ variant: 'default' })}
            agendaItemNumber={item.agendaItemNumber}
          >
            <Link2Icon className="w-[14px] h-[14px] mr-2" />
            {item.agendaItemNumber}
          </AgendaItemLink>
        </div>
        <div className="px-4 pt-3">
          <h3 className="font-semibold text-sm">{item.agendaItemTitle}</h3>
          {item.agendaItemSummary && (
            <SummaryPanel
              originalSummary={item.agendaItemSummary}
              aiSummary={item.aiSummary}
            />
          )}
        </div>
        <MotionsList motions={item.motions} />
      </div>
    </div>
  );
});

function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      currentItems,
      totalPages,
      totalItems,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

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
    <nav className="flex items-center justify-center space-x-2 mt-8">
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
  agendaItems,
  searchTerm = '',
}: {
  agendaItems: AgendaItem[];
  searchTerm?: string;
}) {
  const tidySearchQuery = searchTerm.toLocaleLowerCase().trim();

  const filteredItems = useMemo(
    () =>
      tidySearchQuery
        ? agendaItems.filter((item) =>
            item.agendaItemTitle.toLowerCase().includes(tidySearchQuery),
          )
        : agendaItems,
    [agendaItems, tidySearchQuery],
  );

  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredItems, 10);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-gray-600">
          {totalItems > 0 ? (
            <>
              Showing {startIndex}-{endIndex} of {totalItems} results
            </>
          ) : (
            'No results found'
          )}
        </div>
        <div className="font-medium">{totalItems} results</div>
      </div>

      <div>
        {currentItems.map((item) => (
          <AgendaItemCard key={item.agendaItemNumber} item={item} />
        ))}

        {currentItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No agenda items to display.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}

const formatDateString = (dateString: string) => {
  if (!dateString) return dateString;
  const date = new Date(dateString.substring(0, 10));
  if (!date.getTime()) return dateString;
  date.setMinutes(date.getTimezoneOffset());
  return dateFormatter.format(date);
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
