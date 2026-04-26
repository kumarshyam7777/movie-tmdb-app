import Image from 'next/image';
import Link from 'next/link';
import { Youtube, Star, Play, Popcorn, Sparkles } from 'lucide-react';
import { fetchMovieDetail, getPosterUrl } from '@/lib/tmdb';
import { formatRating, formatYear, getRatingBg, truncate } from '@/lib/utils';
import type { FreeMovie } from '@/lib/free-movies';
import type { MovieDetail } from '@/types/movie.types';

interface FreeMovieCardData extends MovieDetail {
  youtubeUrl: string;
}

async function fetchFreeMovieData(entries: FreeMovie[]): Promise<FreeMovieCardData[]> {
  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const movie = await fetchMovieDetail(entry.tmdbId);
      return { ...movie, youtubeUrl: entry.youtubeUrl };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<FreeMovieCardData> => r.status === 'fulfilled')
    .map((r) => r.value);
}

interface FreeMoviesGridProps {
  movies: FreeMovie[];
}

export async function FreeMoviesGrid({ movies: entries }: FreeMoviesGridProps) {
  const movies = await fetchFreeMovieData(entries);

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <Popcorn size={48} className="mx-auto text-white/20 mb-4" />
        <p className="text-white/40 text-lg">No free movies available right now.</p>
        <p className="text-white/25 text-sm mt-2">Check back soon for updates!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="group relative flex flex-col animate-fade-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Card */}
          <div className="relative overflow-hidden rounded-xl">
            <div className="aspect-[2/3] relative bg-surface-700 overflow-hidden rounded-xl">
              <Image
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* FREE badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-green-500/90 text-white border border-green-400/30 shadow-lg shadow-green-500/20">
                <Sparkles size={10} />
                FREE
              </div>

              {/* Rating badge */}
              <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${getRatingBg(movie.vote_average)}`}>
                <Star size={10} fill="currentColor" />
                {formatRating(movie.vote_average)}
              </div>

              {/* Hover CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 space-y-2">
                <a
                  href={movie.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-600/30"
                >
                  <Youtube size={15} />
                  Watch on YouTube
                </a>
                <Link
                  href={`/movie/${movie.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium transition-colors"
                >
                  <Play size={12} fill="currentColor" />
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Movie info */}
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/movie/${movie.id}`}
                className="text-sm font-semibold text-white/90 hover:text-brand-400 transition-colors line-clamp-2 leading-tight"
              >
                {movie.title}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/40">{formatYear(movie.release_date)}</p>
              {movie.genres.length > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <p className="text-xs text-white/40 truncate">
                    {movie.genres.slice(0, 2).map((g) => g.name).join(', ')}
                  </p>
                </>
              )}
            </div>
            {/* YouTube link always visible on mobile */}
            <a
              href={movie.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center gap-1.5 mt-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              <Youtube size={12} />
              Watch Free
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
