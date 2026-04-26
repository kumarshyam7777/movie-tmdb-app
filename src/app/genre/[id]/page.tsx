import { fetchByGenre } from '@/lib/tmdb';
import { BOLLYWOOD_GENRES } from '@/lib/constants';
import { MovieGrid } from '@/components/movie/MovieGrid';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default async function GenrePage({ params }: Props) {
  const genreId = parseInt(params.id);
  const genre = BOLLYWOOD_GENRES.find((g) => g.id === genreId);
  const movies = await fetchByGenre(genreId);

  return (
    <main className="min-h-screen bg-surface-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={15} />
        Back to Home
      </Link>

      <div className="mb-10">
        {genre && <p className="text-4xl mb-3">{genre.emoji}</p>}
        <h1 className="text-4xl font-bold text-white font-display">
          {genre?.name ?? 'Genre'} Movies
        </h1>
        <p className="text-white/40 mt-2">{movies.total_results.toLocaleString()} movies</p>
      </div>

      <MovieGrid movies={movies.results} />
    </main>
  );
}
