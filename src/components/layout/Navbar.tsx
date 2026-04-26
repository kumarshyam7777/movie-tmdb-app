'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bookmark, Film, TrendingUp, Menu, X, Clapperboard, Star, Loader2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { searchMovies } from '@/lib/tmdb';
import { getPosterUrl } from '@/lib/tmdb';
import { formatYear, formatRating, getRatingBg } from '@/lib/utils';
import type { Movie } from '@/types/movie.types';

const NAV_LINKS = [
  { href: '/',          label: 'Home',     icon: Film },
  { href: '/trending',  label: 'Trending', icon: TrendingUp },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
];

export function Navbar() {
  const { count } = useWatchlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions on typing
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const data = await searchMovies(query, 1);
      setSuggestions(data.results.slice(0, 6));
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
    setSearchValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Clapperboard size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight font-display">
            Bollywood<span className="text-brand-400">HD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? 'text-white bg-surface-700'
                  : 'text-white/50 hover:text-white hover:bg-surface-700/50'
              }`}
            >
              {label}
              {href === '/watchlist' && count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Search bar with suggestions */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-sm relative">
          <form
            onSubmit={handleSearch}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-700 border transition-all ${
              showSuggestions && suggestions.length > 0
                ? 'border-brand-500/50 rounded-b-none'
                : 'border-white/5 hover:border-white/10 focus-within:border-brand-500/50'
            }`}
          >
            {suggestionsLoading ? (
              <Loader2 size={15} className="text-brand-400 animate-spin flex-shrink-0" />
            ) : (
              <Search size={15} className="text-white/30 flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search movies..."
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => { setSearchValue(''); setSuggestions([]); setShowSuggestions(false); }}
                className="p-0.5 rounded hover:bg-surface-600 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full bg-surface-700 border border-t-0 border-brand-500/50 rounded-b-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
              {suggestions.map((movie, i) => (
                <button
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    activeIndex === i ? 'bg-surface-600' : 'hover:bg-surface-600/50'
                  }`}
                >
                  {/* Tiny poster */}
                  <div className="w-8 h-12 rounded overflow-hidden flex-shrink-0 bg-surface-800">
                    <Image
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      width={32}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Title & meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-white/40">{formatYear(movie.release_date)}</span>
                      <div className={`flex items-center gap-0.5 text-[10px] font-bold ${getRatingBg(movie.vote_average)} px-1.5 py-0.5 rounded border`}>
                        <Star size={8} fill="currentColor" />
                        {formatRating(movie.vote_average)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* "See all results" link at the bottom */}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                  setSearchValue('');
                  setShowSuggestions(false);
                }}
                className="w-full px-3 py-3 text-center text-xs font-semibold text-brand-400 hover:text-brand-300 hover:bg-surface-600/50 border-t border-white/5 transition-colors"
              >
                See all results for &ldquo;{searchValue}&rdquo; →
              </button>
            </div>
          )}

          {/* No results state */}
          {showSuggestions && suggestions.length === 0 && !suggestionsLoading && searchValue.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full bg-surface-700 border border-t-0 border-brand-500/50 rounded-b-xl shadow-2xl shadow-black/60 overflow-hidden z-50 px-4 py-6 text-center">
              <p className="text-white/40 text-sm">No movies found for &ldquo;{searchValue}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/search" className="p-2 rounded-lg hover:bg-surface-700 text-white/60">
            <Search size={20} />
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-surface-700 text-white/60"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-900/98 backdrop-blur-xl border-t border-white/5 px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === href ? 'bg-surface-700 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
              {href === '/watchlist' && count > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-brand-500 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
