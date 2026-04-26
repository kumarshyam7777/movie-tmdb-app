'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { setQuery, clearSearch, performSearch, selectSearch } from '@/store/slices/searchSlice';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleQueryChange = useCallback(
    (value: string) => {
      dispatch(setQuery(value));
      clearTimeout(timerRef.current);
      if (value.trim().length >= 2) {
        timerRef.current = setTimeout(() => {
          dispatch(performSearch({ query: value, page: 1 }));
        }, 400);
      }
    },
    [dispatch]
  );

  const loadMore = useCallback(() => {
    if (search.query && search.page < search.totalPages && !search.isLoading) {
      dispatch(performSearch({ query: search.query, page: search.page + 1 }));
    }
  }, [dispatch, search]);

  const clear = useCallback(() => dispatch(clearSearch()), [dispatch]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { ...search, handleQueryChange, loadMore, clear };
};
