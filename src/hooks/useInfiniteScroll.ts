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
  // ref and inView will be passed to the consuming component that calls this hook
  const { ref, inView } = useIntersectionObserver({
    threshold,
  });

  // trigger the loading of more items when sentinel element (e.g. div) comes into viewport
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
