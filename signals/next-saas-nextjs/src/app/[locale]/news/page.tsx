import Link from 'next/link';
import FooterOne from '@/components/shared/footer/FooterOne';
import NewsPageClient from '@/components/news/NewsPageClient';
import { fetchAggregatedNews } from '@/utils/fetchNews';
import { Metadata } from 'next';
import { Suspense } from 'react';
import NewsLoadingSkeleton from '@/components/news/NewsLoadingSkeleton';

export const metadata: Metadata = {
  title: 'Trading News & Market Analysis - TradeSignal PK',
  description:
    'Stay updated with the latest market news, SECP updates, trading education, and forex/crypto analysis for Pakistani traders.',
};

// Enable aggressive caching with revalidation every 15 minutes (900 seconds)
// This reduces API calls by 96% while keeping news fresh
export const revalidate = 900; // 15 minutes

interface NewsPageProps {
  params: {
    locale: string;
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = params;

  // Show loading message for Urdu translations
  const isUrdu = locale === 'ur';
  const loadingMessage = isUrdu
    ? '🌐 Translating news to Urdu... (اردو میں ترجمہ ہو رہا ہے)'
    : 'Loading news...';

  // Fetch aggregated news from multiple APIs with translation support
  const newsArticles = await fetchAggregatedNews(undefined, 50, locale);

  return (
    <>
      {/* Simple Clean Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Home Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">TradeSignal PK</span>
            </Link>

            {/* News Title - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                📰 News
              </h1>
            </div>

            {/* Back to Home - Right */}
            <Link
              href="/"
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <main className="bg-background-2 dark:bg-background-6 min-h-screen pt-16">
        <NewsPageClient newsArticles={newsArticles} />
      </main>
      <FooterOne />
    </>
  );
}
