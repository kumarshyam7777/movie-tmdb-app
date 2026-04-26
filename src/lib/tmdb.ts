import axios from 'axios';
import type { MovieDetail, MoviesResponse, Credits, Videos, WatchProvidersResponse } from '@/types/movie.types';

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
export const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// ─── Axios instance ───────────────────────────────────────────────────────────
export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
  timeout: 15000, // 15s timeout
});

// ─── Retry wrapper for transient network errors (ECONNRESET, timeout, etc.) ──
const RETRYABLE_CODES = ['ECONNRESET', 'ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK'];
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1s

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await tmdb.get<T>(url, params ? { params } : undefined);
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { code?: string; response?: { status?: number; data?: { status_message?: string } }; message?: string };
      const isRetryable =
        !axiosErr.response && RETRYABLE_CODES.includes(axiosErr.code || '');

      const status = axiosErr.response?.status;
      const tmdbMsg = axiosErr.response?.data?.status_message;
      const msg = tmdbMsg
        ? `TMDB API error (${status}): ${tmdbMsg}`
        : `TMDB API request failed: ${axiosErr.message || 'Unknown error'}`;

      lastError = new Error(msg);

      if (isRetryable && attempt < MAX_RETRIES) {
        console.warn(`[TMDB] Attempt ${attempt}/${MAX_RETRIES} failed (${axiosErr.code}), retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * attempt); // Progressive delay
        continue;
      }

      console.error(`[TMDB] Request failed after ${attempt} attempt(s): ${msg}`);
      throw lastError;
    }
  }

  throw lastError || new Error('TMDB API request failed');
}

// ─── Image helpers ────────────────────────────────────────────────────────────
export const getPosterUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-poster.png';

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-backdrop.png';

export const getProfileUrl = (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-profile.png';

// ─── Bollywood-specific params ────────────────────────────────────────────────
const HINDI_PARAMS = {
  with_original_language: 'hi',
  region: 'IN',
};

// ─── API Functions ────────────────────────────────────────────────────────────

/** Trending Bollywood movies this week */
export const fetchTrending = async (page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/discover/movie', { ...HINDI_PARAMS, sort_by: 'popularity.desc', page });

/** Now playing Bollywood movies */
export const fetchNowPlaying = async (page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/movie/now_playing', { ...HINDI_PARAMS, page });

/** Top rated Bollywood movies */
export const fetchTopRated = async (page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/movie/top_rated', { ...HINDI_PARAMS, page });

/** Upcoming Bollywood movies */
export const fetchUpcoming = async (page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/movie/upcoming', { ...HINDI_PARAMS, page });

/** Search Bollywood movies */
export const searchMovies = async (query: string, page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/search/movie', { query, ...HINDI_PARAMS, page });

/** Get full movie details */
export const fetchMovieDetail = async (id: number): Promise<MovieDetail> =>
  fetchWithRetry<MovieDetail>(`/movie/${id}`);

/** Get cast and crew */
export const fetchMovieCredits = async (id: number): Promise<Credits> =>
  fetchWithRetry<Credits>(`/movie/${id}/credits`);

/** Get trailers and videos */
export const fetchMovieVideos = async (id: number): Promise<Videos> =>
  fetchWithRetry<Videos>(`/movie/${id}/videos`);

/** Get similar movies */
export const fetchSimilarMovies = async (id: number, page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>(`/movie/${id}/similar`, { page });

/** Discover by genre */
export const fetchByGenre = async (genreId: number, page = 1): Promise<MoviesResponse> =>
  fetchWithRetry<MoviesResponse>('/discover/movie', { ...HINDI_PARAMS, with_genres: genreId, sort_by: 'popularity.desc', page });

/** Get watch providers (which platforms have this movie) */
export const fetchWatchProviders = async (id: number): Promise<WatchProvidersResponse> =>
  fetchWithRetry<WatchProvidersResponse>(`/movie/${id}/watch/providers`);

/**
 * Check if a movie is available for free on YouTube in India.
 * Returns the TMDB link to the provider page, or null if not available.
 * YouTube's TMDB provider_id is 192 (YouTube) and 235 (YouTube Premium).
 */
export const getYouTubeFreeLink = async (
  movieId: number
): Promise<{ link: string; providerName: string } | null> => {
  try {
    const providers = await fetchWatchProviders(movieId);
    // Check India (IN) first, then US as fallback
    const countryData = providers.results?.IN || providers.results?.US;
    if (!countryData) return null;

    // YouTube provider IDs on TMDB: 192 = YouTube, 235 = YouTube Premium
    const YOUTUBE_IDS = [192, 235];

    // Check free, ads-supported, and flatrate (subscription) categories
    const freeProviders = [
      ...(countryData.free || []),
      ...(countryData.ads || []),
      ...(countryData.flatrate || []),
    ];

    const youtubeProvider = freeProviders.find((p) =>
      YOUTUBE_IDS.includes(p.provider_id)
    );

    if (youtubeProvider) {
      return {
        link: countryData.link,
        providerName: youtubeProvider.provider_name,
      };
    }

    return null;
  } catch {
    return null;
  }
};
