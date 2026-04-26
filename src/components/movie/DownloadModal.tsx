'use client';
import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeDownloadModal, selectDownloadModal } from '@/store/slices/uiSlice';
import { getPosterUrl } from '@/lib/tmdb';
import { getDownloadOptions } from '@/lib/utils';
import Image from 'next/image';

export function DownloadModal() {
  const dispatch = useAppDispatch();
  const { isOpen, movie } = useAppSelector(selectDownloadModal);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const options = getDownloadOptions(movie.id, movie.title);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => dispatch(closeDownloadModal())}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-40 overflow-hidden">
          {movie.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-surface-800" />
          <button
            onClick={() => dispatch(closeDownloadModal())}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 -mt-12 mb-5">
            <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-surface-700 shadow-xl">
              <Image
                src={getPosterUrl(movie.poster_path, 'w185')}
                alt={movie.title}
                width={64}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="pt-8">
              <h3 className="font-bold text-white text-lg leading-tight">{movie.title}</h3>
              <p className="text-white/40 text-sm mt-1">Select quality to stream or download</p>
            </div>
          </div>

          {/* Quality Options */}
          <div className="flex flex-col gap-3">
            {options.map((opt, i) => (
              <a
                key={i}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-surface-700 hover:bg-surface-600 border border-white/5 hover:border-brand-500/40 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-600 group-hover:bg-brand-500/20 flex items-center justify-center text-lg transition-colors">
                    {opt.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs">{opt.resolution} · {opt.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-400 font-medium">{opt.platform}</span>
                  <ExternalLink size={14} className="text-white/30 group-hover:text-brand-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>

          <p className="mt-4 text-xs text-white/25 text-center">
            Opens on official licensed streaming platform
          </p>
        </div>
      </div>
    </div>
  );
}
