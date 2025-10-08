import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sessionCache } from "./redis";
import { getPrisma } from "./prisma";

// Use safe Prisma client that handles missing DATABASE_URL gracefully
const prismaInstance = getPrisma();

// Fallback for adapter - only used if DATABASE_URL is configured
const prisma = prismaInstance || new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Email Magic Link Provider
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@signals.com",
      maxAge: 10 * 60, // Magic links are valid for 10 minutes
    }),

    // Google OAuth Provider (optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // Cache session in Redis for fast access
        await sessionCache.set(token.id as string, {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }, 900); // 15 minutes cache
      }

      // Return previous token if the user is already signed in
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;

        // Try to get cached session first
        const cachedUser = await sessionCache.get(token.id as string);

        if (cachedUser) {
          session.user = { ...session.user, ...cachedUser };
          // Extend cache TTL
          await sessionCache.extend(token.id as string, 900);
        } else {
          // Cache miss - fetch from database
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              emailVerified: true,
            },
          });

          if (dbUser) {
            session.user = { ...session.user, ...dbUser };
            // Update cache
            await sessionCache.set(token.id as string, dbUser, 900);
          }
        }
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // Allow OAuth without email verification
      if (account?.provider === "google") {
        return true;
      }

      // For credentials, check if email is verified
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser?.emailVerified) {
          // Optionally, you can allow sign in but limit features
          // For now, we'll allow it but you can track this in session
          return true;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to drill page after sign in
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/drill`;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`);
    },
    async signOut({ session, token }) {
      // Clear Redis cache on sign out
      if (token?.id) {
        await sessionCache.delete(token.id as string);
      }
      console.log(`User signed out`);
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
    },
    async updateUser({ user }) {
      // Clear cache to force refresh on next request
      if (user.id) {
        await sessionCache.delete(user.id);
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
};