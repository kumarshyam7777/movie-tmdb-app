import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Movie, WatchlistState } from '@/types/movie.types';

const initialState: WatchlistState = {
  movies: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist(state, action: PayloadAction<Movie>) {
      const exists = state.movies.find((m) => m.id === action.payload.id);
      if (!exists) {
        state.movies.unshift(action.payload);
      }
    },
    removeFromWatchlist(state, action: PayloadAction<number>) {
      state.movies = state.movies.filter((m) => m.id !== action.payload);
    },
    clearWatchlist(state) {
      state.movies = [];
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

// Selectors
export const selectWatchlist = (state: { watchlist: WatchlistState }) => state.watchlist.movies;
export const selectIsInWatchlist = (movieId: number) => (state: { watchlist: WatchlistState }) =>
  state.watchlist.movies.some((m) => m.id === movieId);
