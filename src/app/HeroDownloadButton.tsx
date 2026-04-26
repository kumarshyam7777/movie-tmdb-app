'use client';
import { Download } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { openDownloadModal } from '@/store/slices/uiSlice';
import type { Movie } from '@/types/movie.types';

export function HeroDownloadButton({ movie }: { movie: Movie }) {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => dispatch(openDownloadModal(movie))}
      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg transition-all shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5"
    >
      <Download size={18} />
      Download 1080p
    </button>
  );
}
