import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Movie } from '@/types/movie.types';

const initialState: UIState = {
  theme: 'dark',
  activeGenre: null,
  downloadModal: {
    isOpen: false,
    movie: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    setActiveGenre(state, action: PayloadAction<number | null>) {
      state.activeGenre = action.payload;
    },
    openDownloadModal(state, action: PayloadAction<Movie>) {
      state.downloadModal.isOpen = true;
      state.downloadModal.movie = action.payload;
    },
    closeDownloadModal(state) {
      state.downloadModal.isOpen = false;
      state.downloadModal.movie = null;
    },
  },
});

export const { toggleTheme, setTheme, setActiveGenre, openDownloadModal, closeDownloadModal } =
  uiSlice.actions;
export default uiSlice.reducer;

export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectDownloadModal = (state: { ui: UIState }) => state.ui.downloadModal;
