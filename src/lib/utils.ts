// ─── Date & Time ─────────────────────────────────────────────────────────────

export const formatYear = (date: string): string =>
  date ? new Date(date).getFullYear().toString() : 'N/A';

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export const formatDate = (date: string): string =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBA';

// ─── Numbers ──────────────────────────────────────────────────────────────────

export const formatRating = (rating: number): string => rating.toFixed(1);

export const formatMoney = (amount: number): string =>
  amount > 0
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
    : 'N/A';

export const formatVoteCount = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

// ─── Rating color ─────────────────────────────────────────────────────────────

export const getRatingColor = (rating: number): string => {
  if (rating >= 7.5) return 'text-green-400';
  if (rating >= 6.0) return 'text-brand-400';
  if (rating >= 5.0) return 'text-yellow-400';
  return 'text-red-400';
};

export const getRatingBg = (rating: number): string => {
  if (rating >= 7.5) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (rating >= 6.0) return 'bg-brand-500/20 text-brand-400 border-brand-500/30';
  if (rating >= 5.0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

// ─── String helpers ───────────────────────────────────────────────────────────

export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// ─── Debounce ────────────────────────────────────────────────────────────────

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ─── Download quality options ─────────────────────────────────────────────────

export const getDownloadOptions = (movieId: number, title: string) => [
  {
    label: '1080p Full HD',
    resolution: '1920×1080',
    size: '~2.1 GB',
    platform: 'JioCinema',
    url: `https://www.jiocinema.com/search?q=${encodeURIComponent(title)}`,
    icon: '🎬',
  },
  {
    label: '720p HD',
    resolution: '1280×720',
    size: '~1.2 GB',
    platform: 'Prime Video',
    url: `https://www.primevideo.com/search?phrase=${encodeURIComponent(title)}`,
    icon: '📺',
  },
  {
    label: '480p SD',
    resolution: '854×480',
    size: '~600 MB',
    platform: 'Netflix',
    url: `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
    icon: '📱',
  },
];
