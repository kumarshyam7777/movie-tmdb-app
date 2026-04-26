import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// During SSR localStorage doesn't exist — use a noop storage to silence the warning.
// On the client, use the real localStorage-backed storage.
const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve<string | null>(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage();
import watchlistReducer from './slices/watchlistSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';

// Persist config — only watchlist and ui theme survive page reload
const persistConfig = {
  key: 'bollywood-app',
  version: 1,
  storage,
  whitelist: ['watchlist', 'ui'],
};

const rootReducer = combineReducers({
  watchlist: watchlistReducer,
  search: searchReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
