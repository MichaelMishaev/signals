'use client';

import { useState, useMemo } from 'react';
import { INewsArticle } from '@/interface';
import NewsCard from './NewsCard';
import RevealAnimation from '../animation/RevealAnimation';
import AdBanner from '../shared/banners/AdBanner';

const NEWS_CATEGORIES = [
  'All News',
  'Market Analysis',
  'SECP Updates',
  'Trading Education',
  'Platform News',
  'Crypto News',
  'Forex News',
] as const;

interface NewsPageClientProps {
  newsArticles: INewsArticle[];
}

const NewsPageClient = ({ newsArticles }: NewsPageClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All News');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use news articles passed from server component
  const allNews: INewsArticle[] = newsArticles;

  // Filter news based on category and search
  const filteredNews = useMemo(() => {
    let filtered = allNews;

    // Filter by category
    if (selectedCategory !== 'All News') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [allNews, selectedCategory, searchQuery]);

  // Get featured news
  const featuredNews = useMemo(() => {
    return allNews.filter((article) => article.featured);
  }, [allNews]);

  return (
    <div className="py-16 md:py-24">
      <div className="main-container">
        {/* Header Section */}
        <div className="mb-12">
          <RevealAnimation delay={0.1}>
            <h1 className="text-heading-2 md:text-heading-1 font-bold text-center mb-4">
              Trading News & Market Analysis
            </h1>
          </RevealAnimation>
          <RevealAnimation delay={0.2}>
            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 text-center max-w-2xl mx-auto">
              Stay updated with the latest market insights, SECP regulations, and trading education for Pakistani
              traders
            </p>
          </RevealAnimation>
        </div>

        {/* Search Bar */}
        <RevealAnimation delay={0.3}>
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-stroke-2 dark:border-stroke-6 bg-white dark:bg-background-7 text-secondary dark:text-accent focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-colors pl-14"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60 dark:text-accent/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </RevealAnimation>

        {/* Category Filter - Horizontal Scroll on Mobile */}
        <RevealAnimation delay={0.4}>
          <div className="mb-12">
            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-3 min-w-max md:justify-center">
                {NEWS_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-white dark:bg-background-7 text-secondary dark:text-accent hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-stroke-2 dark:border-stroke-6'
                    }`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealAnimation>

        {/* Featured News Section (if All News is selected) */}
        {selectedCategory === 'All News' && featuredNews.length > 0 && (
          <div className="mb-16">
            <RevealAnimation delay={0.5}>
              <h2 className="text-heading-4 font-bold mb-6">Featured Articles</h2>
            </RevealAnimation>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews.map((article, index) => (
                <RevealAnimation key={article.id} delay={0.6 + index * 0.1}>
                  <NewsCard article={article} />
                </RevealAnimation>
              ))}
            </div>
          </div>
        )}

        {/* Main News Grid */}
        <div className="mb-8">
          <RevealAnimation delay={0.7}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-5 font-bold">
                {selectedCategory === 'All News' ? 'All Articles' : selectedCategory}
              </h2>
              <span className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
              </span>
            </div>
          </RevealAnimation>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article, index) => (
              <>
                <RevealAnimation key={article.id} delay={0.8 + index * 0.05}>
                  <NewsCard article={article} />
                </RevealAnimation>

                {/* Insert banner every 4 news articles (after 4th, 8th, 12th, etc.) */}
                {(index + 1) % 4 === 0 && (index + 1) < filteredNews.length && (
                  <RevealAnimation key={`banner-${index}`} delay={0.85 + index * 0.05}>
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center my-4">
                      <AdBanner position="between-signals" />
                    </div>
                  </RevealAnimation>
                )}
              </>
            ))}
          </div>
        ) : (
          <RevealAnimation delay={0.8}>
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto w-16 h-16 text-secondary/30 dark:text-accent/30 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-heading-6 font-medium mb-2">No articles found</h3>
              <p className="text-tagline-1 text-secondary/60 dark:text-accent/60">
                Try adjusting your filters or search query
              </p>
            </div>
          </RevealAnimation>
        )}

        {/* CTA Section */}
        <RevealAnimation delay={1}>
          <div className="mt-16 text-center bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-3xl p-12 border border-primary-500/20">
            <h3 className="text-heading-4 font-bold mb-4">Want to receive news updates?</h3>
            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 mb-6 max-w-xl mx-auto">
              Subscribe to our newsletter and get the latest trading news, SECP updates, and market analysis delivered
              to your inbox.
            </p>
            <button className="btn btn-lg btn-primary">Subscribe to Newsletter</button>
          </div>
        </RevealAnimation>
      </div>
    </div>
  );
};

export default NewsPageClient;
