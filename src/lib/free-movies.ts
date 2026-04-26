// ─── Free YouTube Movies ──────────────────────────────────────────────────────
// Manually curated list of Bollywood movies available on YouTube.
// Each entry has:
//   - tmdbId: The TMDB movie ID (used to fetch poster, title, rating, etc.)
//   - youtubeUrl: The direct YouTube link to the full movie
//
// To add a new movie:
//   1. Search for the movie on https://www.themoviedb.org to get its TMDB ID
//   2. Copy the YouTube URL of the full movie
//   3. Add a new entry below

export interface FreeMovie {
  tmdbId: number;
  youtubeUrl: string;
}

export const FREE_YOUTUBE_MOVIES: FreeMovie[] = [
  // ── Action / Thriller ────────────────────
  { tmdbId: 17478,  youtubeUrl: 'https://www.youtube.com/watch?v=CC2ik2GZ2SY' },  // Dhoom (2004)
  { tmdbId: 17501,  youtubeUrl: 'https://www.youtube.com/watch?v=UMoug8olx3Y' },  // Don (2006)
  { tmdbId: 32740,  youtubeUrl: 'https://www.youtube.com/watch?v=yj4bnTrqwvA' },  // Krrish (2006)
  { tmdbId: 161218, youtubeUrl: 'https://www.youtube.com/watch?v=zPccVnkqAKE' },  // Yeh Hai Jalwa (2002)

  // ── Romance / Drama ──────────────────────
  { tmdbId: 4251,   youtubeUrl: 'https://www.youtube.com/watch?v=njme22bk0S4' },  // Veer-Zaara (2004)
  { tmdbId: 10757,  youtubeUrl: 'https://www.youtube.com/watch?v=uFIy9vgicKs' },  // Kabhi Khushi Kabhie Gham (2001)
  { tmdbId: 19404,  youtubeUrl: 'https://www.youtube.com/watch?v=txJiJniONjI' },  // Dilwale Dulhania Le Jayenge (1995)
  { tmdbId: 79464,  youtubeUrl: 'https://www.youtube.com/watch?v=F-3msnf5m04' },  // Rockstar (2011)

  // ── Comedy ───────────────────────────────
  { tmdbId: 21614,  youtubeUrl: 'https://www.youtube.com/watch?v=zBUpMo4kFJA' },  // Hera Pheri (2000)
  { tmdbId: 19637,  youtubeUrl: 'https://www.youtube.com/watch?v=IbyBvRplX1w' },  // Chup Chup Ke (2006)
  { tmdbId: 21184,  youtubeUrl: 'https://www.youtube.com/watch?v=3K-A8hVFmdg' },  // Hungama (2003)

  // ── Classic / Iconic ─────────────────────
  { tmdbId: 19666,  youtubeUrl: 'https://www.youtube.com/watch?v=RPmh-UBiB9k' },  // Lagaan (2001)
  { tmdbId: 15774,  youtubeUrl: 'https://www.youtube.com/watch?v=RU6Lgbbeqg0' },  // Swades (2004)
  { tmdbId: 7913,   youtubeUrl: 'https://www.youtube.com/watch?v=MxZrKkvZXiQ' },  // Rang De Basanti (2006)
];
