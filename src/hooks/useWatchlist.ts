import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  addToWatchlist,
  removeFromWatchlist,
  selectWatchlist,
  selectIsInWatchlist,
} from '@/store/slices/watchlistSlice';
import type { Movie } from '@/types/movie.types';

export const useWatchlist = () => {
  const dispatch = useAppDispatch();
  const movies = useAppSelector(selectWatchlist);

  const add = useCallback((movie: Movie) => dispatch(addToWatchlist(movie)), [dispatch]);
  const remove = useCallback((id: number) => dispatch(removeFromWatchlist(id)), [dispatch]);
  const toggle = useCallback(
    (movie: Movie) => {
      const inList = movies.some((m) => m.id === movie.id);
      inList ? dispatch(removeFromWatchlist(movie.id)) : dispatch(addToWatchlist(movie));
    },
    [dispatch, movies]
  );

  const isInWatchlist = useCallback(
    (id: number) => movies.some((m) => m.id === id),
    [movies]
  );

  return { movies, add, remove, toggle, isInWatchlist, count: movies.length };
};
