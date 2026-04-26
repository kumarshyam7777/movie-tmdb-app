import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/components/ui/ReduxProvider';
import { Navbar } from '@/components/layout/Navbar';
import { DownloadModal } from '@/components/movie/DownloadModal';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { default: SITE_CONFIG.name, template: `%s | ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
  keywords: ['Bollywood', 'Hindi movies', 'HD download', 'Indian cinema'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-900 text-white antialiased">
        <ReduxProvider>
          <Navbar />
          {children}
          <DownloadModal />
          <footer className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.name} — {SITE_CONFIG.tagline}</p>
            <p className="mt-1 text-xs">Powered by TMDB API · For educational purposes only</p>
          </footer>
        </ReduxProvider>
      </body>
    </html>
  );
}
