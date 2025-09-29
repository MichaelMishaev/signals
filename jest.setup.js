// Mock Redis for tests
jest.mock('./src/lib/redis', () => {
  const mockCache = new Map();

  return {
    default: {
      on: jest.fn(),
      setex: jest.fn((key, ttl, value) => {
        mockCache.set(key, value);
        setTimeout(() => mockCache.delete(key), ttl * 1000);
        return Promise.resolve('OK');
      }),
      get: jest.fn((key) => Promise.resolve(mockCache.get(key) || null)),
      del: jest.fn((key) => {
        mockCache.delete(key);
        return Promise.resolve(1);
      }),
      expire: jest.fn(() => Promise.resolve(1)),
    },
    sessionCache: {
      set: jest.fn(async (key, value, ttl) => {
        mockCache.set(`session:${key}`, JSON.stringify(value));
        setTimeout(() => mockCache.delete(`session:${key}`), ttl * 1000);
        return true;
      }),
      get: jest.fn(async (key) => {
        const data = mockCache.get(`session:${key}`);
        return data ? JSON.parse(data) : null;
      }),
      delete: jest.fn(async (key) => {
        mockCache.delete(`session:${key}`);
        return true;
      }),
      extend: jest.fn(async () => true),
    },
    verificationCache: {
      set: jest.fn(async (key, value, ttl) => {
        mockCache.set(`verify:${key}`, value);
        setTimeout(() => mockCache.delete(`verify:${key}`), ttl * 1000);
        return true;
      }),
      get: jest.fn(async (key) => mockCache.get(`verify:${key}`) || null),
      delete: jest.fn(async (key) => {
        mockCache.delete(`verify:${key}`);
        return true;
      }),
    },
    magicLinkCache: {
      set: jest.fn(async (key, value, ttl) => {
        mockCache.set(`magic:${key}`, value);
        setTimeout(() => mockCache.delete(`magic:${key}`), ttl * 1000);
        return true;
      }),
      get: jest.fn(async (key) => mockCache.get(`magic:${key}`) || null),
      delete: jest.fn(async (key) => {
        mockCache.delete(`magic:${key}`);
        return true;
      }),
    },
  };
});