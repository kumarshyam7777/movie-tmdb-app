import { fetchTrending } from '@/lib/tmdb';
import { TrendingUp } from 'lucide-react';
import { MovieGrid } from '@/components/movie/MovieGrid';

export default async function TrendingPage() {
  const movies = await fetchTrending(1);

  return (
    <main className="min-h-screen bg-surface-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/20">
          <TrendingUp size={22} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Trending Bollywood</h1>
          <p className="text-white/40 text-sm mt-0.5">Most popular Hindi films this week</p>
        </div>
      </div>
      <MovieGrid movies={movies.results} />
    </main>
  );
}
