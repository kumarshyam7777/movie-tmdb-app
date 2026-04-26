'use client';
import { Download } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { openDownloadModal } from '@/store/slices/uiSlice';
import type { Movie } from '@/types/movie.types';

export function DownloadButtonClient({ movie }: { movie: Movie }) {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => dispatch(openDownloadModal(movie))}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors shadow-lg shadow-brand-500/20"
    >
      <Download size={16} />
      Download HD
    </button>
  );
}
