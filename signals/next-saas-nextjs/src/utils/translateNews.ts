/**
 * News Translation Service using GPT-4o-mini
 * Translates English news articles to Urdu with intelligent caching
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for translations (expires after 6 hours)
interface TranslationCache {
  translation: string;
  timestamp: number;
  expiresAt: number;
}

const translationCache = new Map<string, TranslationCache>();
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Generate cache key from content
 */
function getCacheKey(content: string, field: string): string {
  // Use first 100 chars + field name as key
  return `${field}-${content.slice(0, 100).replace(/\s+/g, '-')}`;
}

/**
 * Check if cached translation is still valid
 */
function getCachedTranslation(key: string): string | null {
  const cached = translationCache.get(key);

  if (!cached) return null;

  // Check if expired
  if (Date.now() > cached.expiresAt) {
    translationCache.delete(key);
    return null;
  }

  return cached.translation;
}

/**
 * Store translation in cache
 */
function setCachedTranslation(key: string, translation: string): void {
  translationCache.set(key, {
    translation,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_DURATION,
  });
}

/**
 * Translate a single text field to Urdu using GPT-4o-mini
 */
export async function translateToUrdu(
  text: string,
  context: 'title' | 'description' | 'category' = 'description'
): Promise<string> {
  if (!text) return text;

  // Check cache first
  const cacheKey = getCacheKey(text, context);
  const cached = getCachedTranslation(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit for ${context}: ${text.slice(0, 50)}...`);
    return cached;
  }

  try {
    const systemPrompt = getSystemPrompt(context);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
      max_tokens: context === 'title' ? 100 : 500,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || text;

    // Cache the translation
    setCachedTranslation(cacheKey, translation);

    console.log(`🌐 Translated ${context}: "${text.slice(0, 50)}..." → "${translation.slice(0, 50)}..."`);

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Get appropriate system prompt based on context
 */
function getSystemPrompt(context: 'title' | 'description' | 'category'): string {
  const basePrompt = `You are a professional translator specializing in financial and cryptocurrency news.
Translate the following English text to Urdu (اردو) while maintaining:
- Technical accuracy for financial terms
- Natural Urdu language flow
- Professional tone suitable for Pakistani traders
`;

  switch (context) {
    case 'title':
      return `${basePrompt}
- Keep it concise and compelling
- Translate news headlines accurately
- Use proper Urdu script (اردو)
- Maintain the urgency and importance of the headline
- Do NOT add extra commentary

Only return the translated headline, nothing else.`;

    case 'description':
      return `${basePrompt}
- Provide clear and accurate translation
- Keep technical terms recognizable (e.g., Bitcoin = بٹ کوائن)
- Maintain paragraph structure
- Use proper Urdu punctuation
- Do NOT add extra information

Only return the translated text, nothing else.`;

    case 'category':
      return `${basePrompt}
- Translate category names consistently
- Keep it short (1-3 words)
- Use title case in Urdu

Only return the translated category name, nothing else.`;

    default:
      return basePrompt;
  }
}

/**
 * Translate an entire news article to Urdu
 */
export async function translateNewsArticle(article: {
  title: string;
  description: string;
  category: string;
}): Promise<{
  title: string;
  description: string;
  category: string;
}> {
  try {
    // Translate all fields in parallel for speed
    const [titleUrdu, descriptionUrdu, categoryUrdu] = await Promise.all([
      translateToUrdu(article.title, 'title'),
      translateToUrdu(article.description, 'description'),
      translateToUrdu(article.category, 'category'),
    ]);

    return {
      title: titleUrdu,
      description: descriptionUrdu,
      category: categoryUrdu,
    };
  } catch (error) {
    console.error('Error translating article:', error);
    // Return original content if translation fails
    return {
      title: article.title,
      description: article.description,
      category: article.category,
    };
  }
}

/**
 * Batch translate multiple news articles
 * Processes in chunks to avoid rate limits
 */
export async function translateNewsArticlesBatch(
  articles: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
  }>,
  chunkSize: number = 5
): Promise<Array<{
  id: string;
  title: string;
  description: string;
  category: string;
}>> {
  const translatedArticles = [];

  // Process in chunks to avoid overwhelming the API
  for (let i = 0; i < articles.length; i += chunkSize) {
    const chunk = articles.slice(i, i + chunkSize);

    console.log(`📦 Translating batch ${Math.floor(i / chunkSize) + 1}/${Math.ceil(articles.length / chunkSize)}`);

    const translatedChunk = await Promise.all(
      chunk.map(async (article) => {
        const translated = await translateNewsArticle({
          title: article.title,
          description: article.description,
          category: article.category,
        });

        return {
          id: article.id,
          ...translated,
        };
      })
    );

    translatedArticles.push(...translatedChunk);

    // Small delay between chunks to respect rate limits
    if (i + chunkSize < articles.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    }
  }

  return translatedArticles;
}

/**
 * Clear expired cache entries (for cleanup)
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  let cleared = 0;

  for (const [key, value] of translationCache.entries()) {
    if (now > value.expiresAt) {
      translationCache.delete(key);
      cleared++;
    }
  }

  if (cleared > 0) {
    console.log(`🧹 Cleared ${cleared} expired translations from cache`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
  if (translationCache.size === 0) {
    return { size: 0, oldestEntry: null, newestEntry: null };
  }

  let oldest = Infinity;
  let newest = 0;

  for (const value of translationCache.values()) {
    if (value.timestamp < oldest) oldest = value.timestamp;
    if (value.timestamp > newest) newest = value.timestamp;
  }

  return {
    size: translationCache.size,
    oldestEntry: oldest === Infinity ? null : new Date(oldest),
    newestEntry: newest === 0 ? null : new Date(newest),
  };
}

// Auto-cleanup expired cache every 30 minutes
setInterval(() => {
  clearExpiredCache();
}, 30 * 60 * 1000);
