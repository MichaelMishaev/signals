/**
 * Redis-based Translation Cache
 *
 * Stores translated news articles in Redis with persistent storage
 * Only caches translations that are actually used/requested
 * Survives server restarts and is shared across instances
 */

import redis from './redis';

const TRANSLATION_PREFIX = 'translation:';
const TRANSLATION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Generate a stable cache key from article content
 * Uses hash of first 200 chars to ensure uniqueness while keeping key size manageable
 */
function generateCacheKey(text: string, context: 'title' | 'description' | 'category'): string {
  // Simple hash function for cache key
  const hash = text
    .slice(0, 200)
    .split('')
    .reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

  return `${TRANSLATION_PREFIX}${context}:${Math.abs(hash)}`;
}

/**
 * Get cached translation from Redis
 */
export async function getCachedTranslation(
  text: string,
  context: 'title' | 'description' | 'category'
): Promise<string | null> {
  if (!redis) {
    console.warn('⚠️ Redis not available - translation cache disabled');
    return null;
  }

  try {
    const key = generateCacheKey(text, context);
    const cached = await redis.get(key);

    if (cached) {
      console.log(`✅ Redis cache hit for ${context}: ${text.slice(0, 50)}...`);
      // Extend TTL on access (LRU-style)
      await redis.expire(key, TRANSLATION_TTL);
      return cached;
    }

    return null;
  } catch (error) {
    console.error('Redis get translation error:', error);
    return null;
  }
}

/**
 * Store translation in Redis
 */
export async function setCachedTranslation(
  text: string,
  translation: string,
  context: 'title' | 'description' | 'category'
): Promise<boolean> {
  if (!redis) {
    console.warn('⚠️ Redis not available - translation cache disabled');
    return false;
  }

  try {
    const key = generateCacheKey(text, context);
    await redis.setex(key, TRANSLATION_TTL, translation);
    console.log(`💾 Cached translation for ${context}: ${text.slice(0, 50)}...`);
    return true;
  } catch (error) {
    console.error('Redis set translation error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getTranslationCacheStats(): Promise<{
  totalKeys: number;
  memoryUsage: string;
}> {
  if (!redis) {
    return { totalKeys: 0, memoryUsage: '0 KB' };
  }

  try {
    // Count keys with translation prefix
    const keys = await redis.keys(`${TRANSLATION_PREFIX}*`);

    // Get memory info
    const info = await redis.info('memory');
    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';

    return {
      totalKeys: keys.length,
      memoryUsage,
    };
  } catch (error) {
    console.error('Redis stats error:', error);
    return { totalKeys: 0, memoryUsage: '0 KB' };
  }
}

/**
 * Clear all translation cache (for maintenance)
 */
export async function clearTranslationCache(): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const keys = await redis.keys(`${TRANSLATION_PREFIX}*`);
    if (keys.length === 0) return 0;

    await redis.del(...keys);
    console.log(`🧹 Cleared ${keys.length} translations from Redis cache`);
    return keys.length;
  } catch (error) {
    console.error('Redis clear cache error:', error);
    return 0;
  }
}

/**
 * Remove expired translations (automatic cleanup)
 * Redis handles this automatically with TTL, but this can be used for manual cleanup
 */
export async function cleanupExpiredTranslations(): Promise<number> {
  // Redis automatically removes expired keys, so this is mostly for logging
  if (!redis) {
    return 0;
  }

  try {
    const stats = await getTranslationCacheStats();
    console.log(`📊 Translation cache: ${stats.totalKeys} keys, ${stats.memoryUsage} memory`);
    return stats.totalKeys;
  } catch (error) {
    console.error('Redis cleanup error:', error);
    return 0;
  }
}
