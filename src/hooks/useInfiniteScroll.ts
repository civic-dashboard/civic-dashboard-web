import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

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
  // use a stable ref to track loading state without adding isLoadingMore to a dependency array
  // (circumventing infinite loops)
  const loadingStateRef = useRef({
    isLoading: false,
  });

  // keep the ref synced to the actual state value
  useEffect(() => {
    loadingStateRef.current.isLoading = isLoadingMore;
  }, [isLoadingMore]);

  // get intersection observer ref and inView
  const { ref, inView } = useInView({
    threshold,
  });

  // trigger the loading of more items when sentinel div comes into view
  useEffect(() => {
    if (inView && !loadingStateRef.current.isLoading && hasMoreSearchResults) {
      onLoadMore();
    }
  }, [inView, hasMoreSearchResults, onLoadMore]);

  return {
    sentinelRef: ref,
    isInView: inView,
  };
}
