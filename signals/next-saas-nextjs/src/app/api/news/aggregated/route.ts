import { NextRequest, NextResponse } from 'next/server';
import { fetchAggregatedNews } from '@/utils/fetchNews';

// Enable aggressive caching to minimize API calls
export const revalidate = 900; // Cache for 15 minutes (matches page cache)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const locale = searchParams.get('locale') || 'en';

    // Fetch aggregated and translated news
    const articles = await fetchAggregatedNews(category || undefined, limit, locale);

    return NextResponse.json({
      success: true,
      locale,
      category: category || 'all',
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('News aggregation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}
