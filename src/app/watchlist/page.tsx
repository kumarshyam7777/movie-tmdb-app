'use client';
import Link from 'next/link';
import { Bookmark, Trash2, Film } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAppDispatch } from '@/hooks/redux';
import { clearWatchlist } from '@/store/slices/watchlistSlice';
import { MovieGrid } from '@/components/movie/MovieGrid';

export default function WatchlistPage() {
  const { movies, count } = useWatchlist();
  const dispatch = useAppDispatch();

  return (
    <main className="min-h-screen bg-surface-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">My Watchlist</h1>
          <p className="text-white/40 text-sm mt-1">
            {count} {count === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>
        {count > 0 && (
          <button
            onClick={() => dispatch(clearWatchlist())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-700 hover:bg-red-500/20 border border-white/5 hover:border-red-500/30 text-white/60 hover:text-red-400 text-sm transition-all"
          >
            <Trash2 size={15} />
            Clear all
          </button>
        )}
      </div>

      {count > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        <div className="text-center py-32">
          <div className="w-20 h-20 rounded-2xl bg-surface-700 flex items-center justify-center mx-auto mb-6">
            <Bookmark size={32} className="text-white/20" />
          </div>
          <h2 className="text-xl font-semibold text-white/60 mb-2">No movies saved yet</h2>
          <p className="text-white/30 text-sm mb-8">Browse movies and click the bookmark to save them here</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors"
          >
            <Film size={16} />
            Browse Movies
          </Link>
        </div>
      )}
    </main>
  );
}
