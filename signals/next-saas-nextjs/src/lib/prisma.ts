import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
  var prismaInitialized: boolean | undefined;
}

// Lazy initialization to prevent crashes when DATABASE_URL is missing
let prismaClient: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  // Return null if DATABASE_URL is not configured
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
    console.warn('DATABASE_URL not configured - Prisma features disabled');
    return null;
  }

  // Return existing instance
  if (prismaClient) {
    return prismaClient;
  }

  // Try to initialize
  try {
    prismaClient = global.prisma || new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      global.prisma = prismaClient;
    }

    return prismaClient;
  } catch (error) {
    console.error('Failed to initialize Prisma:', error);
    return null;
  }
}

// For backward compatibility - but this will throw if DATABASE_URL is missing
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrisma();
    if (!client) {
      throw new Error('Prisma client not initialized - DATABASE_URL not configured');
    }
    return client[prop as keyof PrismaClient];
  }
});