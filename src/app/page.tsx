import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Download, TrendingUp, Clock, Award } from 'lucide-react';
import { fetchTrending, fetchTopRated, fetchNowPlaying, getBackdropUrl, getPosterUrl } from '@/lib/tmdb';
import { formatRating, formatYear, getRatingBg, truncate } from '@/lib/utils';
import { BOLLYWOOD_GENRES } from '@/lib/constants';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { HeroDownloadButton } from './HeroDownloadButton';

export default async function HomePage() {
  const [trending, topRated, nowPlaying] = await Promise.all([
    fetchTrending(1),
    fetchTopRated(1),
    fetchNowPlaying(1),
  ]);

  const hero = trending.results[0];
  const featuredMovies = trending.results.slice(1, 7);

  return (
    <main className="min-h-screen bg-surface-900">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] overflow-hidden">
        <Image
          src={getBackdropUrl(hero.backdrop_path, 'original')}
          alt={hero.title}
          fill
          priority
          className="object-cover"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-surface-900/20" />

        <div className="relative z-10 h-full flex items-end pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-brand-400" />
              <span className="text-brand-400 text-sm font-semibold tracking-widest uppercase">
                Trending #1
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white font-display leading-none mb-4 tracking-tight">
              {hero.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${getRatingBg(hero.vote_average)}`}>
                <Star size={12} fill="currentColor" />
                {formatRating(hero.vote_average)}
              </div>
              <span className="text-white/50 text-sm">{formatYear(hero.release_date)}</span>
              <span className="text-white/50 text-sm">Hindi</span>
            </div>

            <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl">
              {truncate(hero.overview, 180)}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <HeroDownloadButton movie={hero} />
              <Link
                href={`/movie/${hero.id}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white font-semibold transition-all"
              >
                <Play size={16} fill="currentColor" />
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Mini poster strip on right */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
          {trending.results.slice(1, 5).map((m) => (
            <Link key={m.id} href={`/movie/${m.id}`} className="group relative w-20 h-28 rounded-xl overflow-hidden border border-white/10">
              <Image src={getPosterUrl(m.poster_path, 'w185')} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
        {/* ── Genre Chips ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-white font-display mb-5">Browse by Genre</h2>
          <div className="flex flex-wrap gap-3">
            {BOLLYWOOD_GENRES.map((g) => (
              <Link
                key={g.id}
                href={`/genre/${g.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 border border-white/5 hover:border-brand-500/30 text-white/70 hover:text-white text-sm font-medium transition-all"
              >
                <span>{g.emoji}</span>
                {g.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Now Playing ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-white font-display">Now Playing</h2>
            </div>
            <Link href="/trending" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
              View all →
            </Link>
          </div>
          <MovieGrid movies={nowPlaying.results.slice(0, 10)} />
        </section>

        {/* ── Trending ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-white font-display">Trending This Week</h2>
            </div>
            <Link href="/trending" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
              View all →
            </Link>
          </div>
          <MovieGrid movies={trending.results.slice(1, 11)} />
        </section>

        {/* ── Top Rated ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} className="text-brand-400" />
            <h2 className="text-2xl font-bold text-white font-display">Top Rated All Time</h2>
          </div>
          <MovieGrid movies={topRated.results.slice(0, 10)} />
        </section>
      </div>
    </main>
  );
}
