'use client';
import { useEffect, useRef, useCallback } from 'react';

interface Options {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading, threshold = 0.1 }: Options) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return sentinelRef;
};
