import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchMovies } from '@/lib/tmdb';
import type { SearchState, Movie } from '@/types/movie.types';

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

export const performSearch = createAsyncThunk(
  'search/perform',
  async ({ query, page }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      return await searchMovies(query, page ?? 1);
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      if (!action.payload) {
        state.results = [];
        state.page = 1;
        state.totalPages = 1;
      }
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.page = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        const { results, page, total_pages } = action.payload;
        // Append for pagination, replace for new query
        state.results = page === 1 ? results : [...state.results, ...results];
        state.page = page;
        state.totalPages = total_pages;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

export const selectSearch = (state: { search: SearchState }) => state.search;
