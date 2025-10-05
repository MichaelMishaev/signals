# Railway Dockerfile - Next.js monorepo deployment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY signals/next-saas-nextjs/package*.json ./

# Set environment to skip git hooks
ENV CI=true
ENV HUSKY=0

# Install ALL dependencies including devDependencies (needed for TypeScript & build)
RUN npm ci --ignore-scripts

# Copy source code and Prisma schema
COPY signals/next-saas-nextjs .

# Generate Prisma client (required for build)
RUN npx prisma generate

# Accept build arguments from Railway
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG RESEND_API_KEY
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG EMAIL_FROM

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV EMAIL_FROM=$EMAIL_FROM
ENV NODE_ENV=production

# Build the application (needs TypeScript and other dev deps)
RUN npm run build

# Clean up dev dependencies AFTER build
RUN npm prune --production

# Expose port
EXPOSE $PORT

# Start command
CMD ["npm", "start"]