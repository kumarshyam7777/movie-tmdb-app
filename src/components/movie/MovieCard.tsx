'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Download, Star } from 'lucide-react';
import { getPosterUrl } from '@/lib/tmdb';
import { formatYear, formatRating, getRatingBg } from '@/lib/utils';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAppDispatch } from '@/hooks/redux';
import { openDownloadModal } from '@/store/slices/uiSlice';
import type { MovieCardProps } from '@/types/movie.types';

export function MovieCard({ movie, index = 0, variant = 'default' }: MovieCardProps) {
  const { toggle, isInWatchlist } = useWatchlist();
  const dispatch = useAppDispatch();
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div
      className="group relative flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Poster */}
      <Link href={`/movie/${movie.id}`} className="relative overflow-hidden rounded-xl block">
        <div className="aspect-[2/3] relative bg-surface-700 overflow-hidden rounded-xl">
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${getRatingBg(movie.vote_average)}`}>
            <Star size={10} fill="currentColor" />
            {formatRating(movie.vote_average)}
          </div>

          {/* Hover actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(openDownloadModal(movie));
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors"
            >
              <Download size={14} />
              Download HD
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/movie/${movie.id}`}
            className="text-sm font-semibold text-white/90 hover:text-brand-400 transition-colors line-clamp-2 leading-tight"
          >
            {movie.title}
          </Link>
          <button
            onClick={() => toggle(movie)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-surface-600 transition-colors mt-0.5"
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? (
              <BookmarkCheck size={16} className="text-brand-400" />
            ) : (
              <Bookmark size={16} className="text-white/40 hover:text-white/70" />
            )}
          </button>
        </div>
        <p className="text-xs text-white/40">{formatYear(movie.release_date)}</p>
      </div>
    </div>
  );
}
