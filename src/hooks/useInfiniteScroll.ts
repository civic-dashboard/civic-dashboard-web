import { useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
interface UseInfiniteScrollProps {
  isLoadingMore: boolean;
  hasMoreSearchResults: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  isLoadingMore,
  hasMoreSearchResults,
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollProps) {
  // get intersection observer ref and inView
  const { ref, inView } = useIntersectionObserver({
    threshold,
  });

  // trigger the loading of more items when sentinel div comes into view
  useEffect(() => {
    if (inView && !isLoadingMore && hasMoreSearchResults) {
      onLoadMore();
    }
  }, [inView, isLoadingMore, hasMoreSearchResults, onLoadMore]);

  return {
    sentinelRef: ref,
    isInView: inView,
  };
}
