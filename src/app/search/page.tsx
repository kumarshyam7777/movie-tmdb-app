'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { MovieGrid } from '@/components/movie/MovieGrid';

function SearchContent() {
  const searchParams = useSearchParams();
  const { query, results, isLoading, totalPages, page, handleQueryChange, loadMore, clear } = useSearch();
  const urlQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (urlQuery && urlQuery !== query) handleQueryChange(urlQuery);
  }, [urlQuery, handleQueryChange]);

  return (
    <main className="min-h-screen bg-surface-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Input */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white font-display mb-6">Search Movies</h1>
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-700 border border-white/10 focus-within:border-brand-500/60 transition-all max-w-2xl">
          <Search size={20} className="text-white/40 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search Bollywood movies, actors, directors..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="flex-1 bg-transparent text-white text-lg placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={clear} className="p-1 rounded-full hover:bg-surface-600 text-white/40 hover:text-white transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {query.length >= 2 ? (
        <>
          {!isLoading && results.length > 0 && (
            <p className="text-white/40 text-sm mb-6">
              Found <span className="text-white font-medium">{results.length}</span> results for &ldquo;{query}&rdquo;
            </p>
          )}
          <MovieGrid
            movies={results}
            isLoading={isLoading}
            hasMore={page < totalPages}
            onLoadMore={loadMore}
          />
          {!isLoading && results.length === 0 && query && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🎬</p>
              <p className="text-white/60 text-lg">No movies found for &ldquo;{query}&rdquo;</p>
              <p className="text-white/30 text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <p className="text-6xl mb-5">🔍</p>
          <p className="text-white/50 text-lg">Type at least 2 characters to search</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
