import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Calendar, Globe, ArrowLeft, Play, Youtube } from 'lucide-react';
import {
  fetchMovieDetail,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  getYouTubeFreeLink,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from '@/lib/tmdb';
import { formatRating, formatRuntime, formatDate, getRatingBg, truncate } from '@/lib/utils';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { DownloadButtonClient } from './DownloadButtonClient';

interface Props {
  params: { id: string };
}

export default async function MovieDetailPage({ params }: Props) {
  const id = parseInt(params.id);
  const [movie, credits, videos, similar, youtubeLink] = await Promise.all([
    fetchMovieDetail(id),
    fetchMovieCredits(id),
    fetchMovieVideos(id),
    fetchSimilarMovies(id),
    getYouTubeFreeLink(id),
  ]);

  const trailer = videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.results.find((v) => v.site === 'YouTube');

  const director = credits.crew.find((c) => c.job === 'Director');
  const topCast = credits.cast.slice(0, 8);

  return (
    <main className="min-h-screen bg-surface-900">
      {/* Hero backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-surface-900/30" />

        {/* Back button */}
        <div className="absolute top-20 left-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white/80 hover:text-white text-sm transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-72 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-64 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <Image
                src={getPosterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                width={256}
                height={384}
                className="object-cover w-full"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-20">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 rounded-full text-xs font-medium bg-surface-600 text-white/60 border border-white/5">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white font-display leading-tight mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-brand-400 italic text-lg mb-4">{movie.tagline}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${getRatingBg(movie.vote_average)}`}>
                <Star size={13} fill="currentColor" />
                {formatRating(movie.vote_average)}
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Clock size={14} />
                {formatRuntime(movie.runtime)}
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Calendar size={14} />
                {formatDate(movie.release_date)}
              </div>
              {director && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Globe size={14} />
                  Dir. {director.name}
                </div>
              )}
            </div>

            <p className="text-white/70 leading-relaxed max-w-2xl mb-8">{movie.overview}</p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Show YouTube button ONLY when movie is confirmed free */}
              {youtubeLink && (
                <a
                  href={youtubeLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-lg shadow-red-600/20 hover:shadow-red-500/30"
                >
                  <Youtube size={18} />
                  Watch Free on YouTube
                </a>
              )}
              <DownloadButtonClient movie={movie as unknown as import('@/types/movie.types').Movie} />
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-600 hover:bg-surface-500 border border-white/10 text-white font-semibold transition-colors"
                >
                  <Play size={16} fill="currentColor" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Trailer embed */}
        {trailer && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white font-display mb-6">Official Trailer</h2>
            <div className="relative aspect-video max-w-4xl rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {topCast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white font-display mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {topCast.map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-700 border-2 border-white/5">
                    <Image
                      src={getProfileUrl(member.profile_path)}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{member.name}</p>
                    <p className="text-white/40 text-xs">{truncate(member.character, 20)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        {similar.results.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white font-display mb-6">You May Also Like</h2>
            <MovieGrid
              movies={similar.results.slice(0, 10)}
              columns="grid-cols-2 sm:grid-cols-4 md:grid-cols-5"
            />
          </div>
        )}
      </div>
    </main>
  );
}
