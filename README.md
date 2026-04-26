# 🎬 BollywoodHD — Next.js Movie App

A cinematic, fully responsive Bollywood movie discovery and download platform built with **Next.js 14**, **Redux Toolkit**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- 🔍 **Live Search** — Debounced search with instant results
- 🎥 **Movie Detail Pages** — Full info, trailers, cast, similar movies
- ⬇️ **HD Download Modal** — Quality selector linking to licensed platforms
- 🔖 **Watchlist** — Persistent across sessions via redux-persist
- 📱 **Fully Responsive** — Mobile-first design
- ♾️ **Infinite Scroll** — Load more movies automatically
- 🌑 **Cinematic Dark Theme** — Elegant gold-accented UI
- 🎭 **Genre Browsing** — Filter by Action, Romance, Thriller, etc.

---

## 🚀 Quick Start

### 1. Clone or unzip the project

```bash
cd bollywood-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and add your TMDB API key:

```
NEXT_PUBLIC_TMDB_API_KEY=your_actual_key_here
```

**Get a free TMDB API key:**
1. Go to https://www.themoviedb.org/signup
2. Verify your email
3. Go to Settings → API → Create → Developer
4. Copy your API key (v3 auth)

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page (hero + movie sections)
│   ├── layout.tsx          # Root layout with providers
│   ├── search/             # Search page
│   ├── movie/[id]/         # Movie detail page
│   ├── genre/[id]/         # Genre filter page
│   ├── watchlist/          # Saved movies page
│   └── trending/           # Trending page
├── components/
│   ├── layout/Navbar.tsx   # Sticky navigation
│   ├── movie/              # MovieCard, MovieGrid, DownloadModal
│   └── ui/                 # Skeleton, ReduxProvider
├── store/
│   ├── store.ts            # Redux store + persist config
│   └── slices/             # watchlist, search, ui slices
├── hooks/                  # useSearch, useWatchlist, useInfiniteScroll
├── lib/
│   ├── tmdb.ts             # All TMDB API functions
│   ├── utils.ts            # Formatters, helpers
│   └── constants.ts        # Genres, config
└── types/
    └── movie.types.ts      # All TypeScript interfaces
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework (App Router, SSR, SSG) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| redux-persist | Persist watchlist to localStorage |
| Framer Motion | Animations |
| Axios | HTTP client |
| TMDB API | Movie data source |
| Lucide React | Icons |

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

---

## ⚠️ About Downloads

This app links users to **official licensed platforms** (JioCinema, Prime Video, Netflix) for downloads. No copyrighted movie files are hosted or distributed. This is intentional and legally compliant.

---

## 🔑 TMDB API Notes

- Base URL: `https://api.themoviedb.org/3`
- Free tier: unlimited requests
- All Bollywood movies filtered with `with_original_language=hi`
- Image CDN: `https://image.tmdb.org/t/p/{size}{path}`
