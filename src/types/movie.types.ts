// ─── Movie Types ──────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection: Collection | null;
  imdb_id: string | null;
  homepage: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Videos {
  results: Video[];
}

// ─── Watch Provider Types ─────────────────────────────────────────────────────

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, WatchProviderCountry>;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MoviesResponse = PaginatedResponse<Movie>;

// ─── Redux State Types ────────────────────────────────────────────────────────

export interface WatchlistState {
  movies: Movie[];
}

export interface SearchState {
  query: string;
  results: Movie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

export interface UIState {
  theme: 'dark' | 'light';
  activeGenre: number | null;
  downloadModal: {
    isOpen: boolean;
    movie: Movie | null;
  };
}

// ─── Component Prop Types ─────────────────────────────────────────────────────

export interface MovieCardProps {
  movie: Movie;
  index?: number;
  variant?: 'default' | 'wide' | 'compact';
}

export interface DownloadQuality {
  label: string;
  resolution: string;
  size: string;
  platform: string;
  url: string;
  icon: string;
}
