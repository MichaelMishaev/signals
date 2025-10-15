import { NextRequest, NextResponse } from 'next/server';
import { aggregateAllNews, convertToNewsArticle } from '@/utils/newsAggregator';

export const dynamic = 'force-dynamic'; // Disable static generation
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Fetch aggregated news from all sources
    const aggregatedNews = await aggregateAllNews();

    // Filter by category if specified
    let filteredNews = aggregatedNews;
    if (category && category !== 'All News') {
      filteredNews = aggregatedNews.filter((article) => article.category === category);
    }

    // Limit results
    const limitedNews = filteredNews.slice(0, limit);

    // Convert to INewsArticle format
    const newsArticles = limitedNews.map(convertToNewsArticle);

    return NextResponse.json({
      success: true,
      count: newsArticles.length,
      articles: newsArticles,
      sources: {
        fmp: process.env.FMP_API_KEY ? 'active' : 'inactive',
        cryptopanic: process.env.CRYPTOPANIC_API_KEY ? 'active' : 'inactive',
        newsapi: process.env.NEWSAPI_KEY ? 'active' : 'inactive',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        articles: [],
      },
      { status: 500 }
    );
  }
}
