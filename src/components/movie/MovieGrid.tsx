'use client';
import { Loader2 } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Movie } from '@/types/movie.types';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  columns?: string;
}

export function MovieGrid({
  movies,
  isLoading = false,
  hasMore = false,
  onLoadMore = () => {},
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
}: MovieGridProps) {
  const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore, isLoading });

  if (isLoading && movies.length === 0) {
    return (
      <div className={`grid ${columns} gap-4`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={`grid ${columns} gap-4`}>
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading more indicator */}
      {isLoading && movies.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-brand-400" size={28} />
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <p className="text-center text-white/20 text-sm py-8">— End of results —</p>
      )}
    </div>
  );
}
