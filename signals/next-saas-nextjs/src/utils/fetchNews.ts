/**
 * Server-side utility to fetch aggregated news from multiple sources
 * Uses: CryptoPanic and NewsAPI
 * Supports English and Urdu translation via GPT-4o-mini
 * Can be used in Server Components
 */

import { INewsArticle } from '@/interface';
import { getNewsAggregator } from './multiSourceNewsAggregator';
import { translateNewsArticlesBatch } from './translateNews';

export async function fetchAggregatedNews(
  category?: string,
  limit: number = 50,
  locale: string = 'en'
): Promise<INewsArticle[]> {
  try {
    console.log(`📍 fetchAggregatedNews called with locale: "${locale}" (type: ${typeof locale})`);

    const aggregator = getNewsAggregator();

    // Map category names to aggregator categories
    const categoryMap: Record<string, 'forex' | 'crypto' | 'financial'> = {
      'Forex News': 'forex',
      'Crypto News': 'crypto',
      'Market Analysis': 'financial',
    };

    // Fetch news based on category
    let articles;
    if (category && category !== 'All News' && categoryMap[category]) {
      articles = await aggregator.aggregateNews({
        categories: [categoryMap[category]],
        limit,
        minRelevanceScore: 0.3,
      });
    } else {
      // Get all categories
      articles = await aggregator.aggregateNews({
        limit,
        minRelevanceScore: 0.3,
      });
    }

    // Convert to INewsArticle format
    let newsArticles: INewsArticle[] = articles.map((article, index) => ({
      id: article.id,
      title: article.title,
      excerpt: article.description,
      content: article.description, // Full content would require additional fetching
      category: getCategoryLabel(article.category),
      image: article.image || '/images/news/default-news.jpg',
      author: 'TradeSignal PK',
      date: new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      link: article.url,
      source: article.source,
      tags: [article.category, article.sentiment || 'neutral'],
      relevanceScore: article.relevanceScore,
      slug: `${article.id}-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      thumbnail: article.image || '/images/news/default-news.jpg',
      publishDate: new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      readTime: '5 min read',
      relatedSymbols: extractSymbols(article.title, article.description),
    }));

    // Translate to Urdu if requested
    if (locale === 'ur') {
      console.log(`🌐 Translating ${newsArticles.length} articles to Urdu...`);

      const articlesToTranslate = newsArticles.map((article) => ({
        id: article.id,
        title: article.title,
        description: article.excerpt,
        category: article.category,
      }));

      const translated = await translateNewsArticlesBatch(articlesToTranslate, 5);

      // Merge translated content back
      newsArticles = newsArticles.map((article) => {
        const translatedArticle = translated.find((t) => t.id === article.id);
        if (translatedArticle) {
          return {
            ...article,
            title: translatedArticle.title,
            excerpt: translatedArticle.description,
            content: translatedArticle.description,
            category: translatedArticle.category,
          };
        }
        return article;
      });

      console.log(`✅ Translation complete: ${newsArticles.length} articles`);
    }

    return newsArticles;
  } catch (error) {
    console.error('Error fetching aggregated news:', error);
    return [];
  }
}

// Helper function to convert category to display label
function getCategoryLabel(category: 'forex' | 'crypto' | 'financial'): string {
  const labels: Record<string, string> = {
    forex: 'Forex News',
    crypto: 'Crypto News',
    financial: 'Market Analysis',
  };
  return labels[category] || 'Market Analysis';
}

// Helper function to extract trading symbols from text
function extractSymbols(title: string, description: string): string[] {
  const text = `${title} ${description}`.toUpperCase();
  const symbols = new Set<string>();

  // Common crypto symbols
  const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE', 'MATIC', 'DOT', 'AVAX', 'SHIB'];
  // Common forex pairs
  const forexPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'];
  // Commodities
  const commodities = ['GOLD', 'SILVER', 'OIL', 'XAU/USD'];

  // Extract crypto symbols
  cryptoSymbols.forEach((symbol) => {
    if (text.includes(symbol) || text.includes(`${symbol}/USD`)) {
      symbols.add(symbol);
    }
  });

  // Extract forex pairs
  forexPairs.forEach((pair) => {
    if (text.includes(pair.replace('/', ''))) {
      symbols.add(pair);
    }
  });

  // Extract commodities
  commodities.forEach((commodity) => {
    if (text.includes(commodity)) {
      symbols.add(commodity);
    }
  });

  return Array.from(symbols).slice(0, 5); // Limit to 5 symbols
}
