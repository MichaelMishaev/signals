import Redis from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  // Fallback to localhost for development
  return 'redis://localhost:6379';
};

// Create Redis client only if not in build mode or if Redis URL is provided
const shouldCreateRedis = () => {
  // During build (NODE_ENV=production and no real Redis URL), don't create client
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    return false;
  }
  return true;
};

let redis: Redis | null = null;

if (shouldCreateRedis()) {
  redis = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately
    retryStrategy: (times) => {
      if (times > 3) {
        // Stop retrying after 3 attempts
        return null;
      }
      // Reconnect after 2 seconds
      return Math.min(times * 200, 2000);
    },
    reconnectOnError: (err) => {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ECONNREFUSED'];
      return targetErrors.some(targetError => err.message.includes(targetError));
    }
  });
}

if (redis) {
  redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis Client Connected');
  });
}

// Session cache functions
export const sessionCache = {
  set: async (key: string, value: any, expirySeconds = 900) => {
    if (!redis) return false;
    try {
      await redis.setex(`session:${key}`, expirySeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  get: async (key: string) => {
    if (!redis) return null;
    try {
      const data = await redis.get(`session:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  delete: async (key: string) => {
    if (!redis) return false;
    try {
      await redis.del(`session:${key}`);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  },

  extend: async (key: string, expirySeconds = 900) => {
    if (!redis) return false;
    try {
      await redis.expire(`session:${key}`, expirySeconds);
      return true;
    } catch (error) {
      console.error('Redis expire error:', error);
      return false;
    }
  }
};

// Verification code cache
export const verificationCache = {
  set: async (email: string, code: string, expirySeconds = 600) => {
    if (!redis) return false;
    try {
      await redis.setex(`verify:${email}`, expirySeconds, code);
      return true;
    } catch (error) {
      console.error('Redis verification set error:', error);
      return false;
    }
  },

  get: async (email: string) => {
    if (!redis) return null;
    try {
      return await redis.get(`verify:${email}`);
    } catch (error) {
      console.error('Redis verification get error:', error);
      return null;
    }
  },

  delete: async (email: string) => {
    if (!redis) return false;
    try {
      await redis.del(`verify:${email}`);
      return true;
    } catch (error) {
      console.error('Redis verification delete error:', error);
      return false;
    }
  }
};

// Magic link token cache
export const magicLinkCache = {
  set: async (token: string, email: string, expirySeconds = 600) => {
    if (!redis) return false;
    try {
      await redis.setex(`magic:${token}`, expirySeconds, email);
      return true;
    } catch (error) {
      console.error('Redis magic link set error:', error);
      return false;
    }
  },

  get: async (token: string) => {
    if (!redis) return null;
    try {
      return await redis.get(`magic:${token}`);
    } catch (error) {
      console.error('Redis magic link get error:', error);
      return null;
    }
  },

  delete: async (token: string) => {
    if (!redis) return false;
    try {
      await redis.del(`magic:${token}`);
      return true;
    } catch (error) {
      console.error('Redis magic link delete error:', error);
      return false;
    }
  }
};

export default redis;