import { Suspense } from 'react';
import { Youtube, Film, Sparkles } from 'lucide-react';
import { FREE_YOUTUBE_MOVIES } from '@/lib/free-movies';
import { FreeMoviesGrid } from '@/components/movie/FreeMoviesGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watch Free Movies',
  description: 'Watch full Bollywood movies for free on YouTube — curated collection of Hindi movies streaming free.',
};

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 animate-pulse">
          <div className="aspect-[2/3] rounded-xl bg-surface-700" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-surface-700" />
            <div className="h-3 w-1/2 rounded bg-surface-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FreeMoviesPage() {
  return (
    <main className="min-h-screen bg-surface-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30">
              <Youtube size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-semibold tracking-wider uppercase">
                YouTube
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
              <Sparkles size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
                Free to Watch
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white font-display leading-tight mb-3">
            Watch Free on <span className="text-red-400">YouTube</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Handpicked Bollywood movies you can watch completely free on YouTube. 
            Click any movie to start watching instantly.
          </p>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Film size={16} />
              <span><strong className="text-white/70">{FREE_YOUTUBE_MOVIES.length}</strong> movies available</span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Youtube size={16} className="text-red-400/60" />
              <span>Streaming on YouTube</span>
            </div>
          </div>
        </div>

        {/* Movies grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          <FreeMoviesGrid movies={FREE_YOUTUBE_MOVIES} />
        </Suspense>
      </div>
    </main>
  );
}
