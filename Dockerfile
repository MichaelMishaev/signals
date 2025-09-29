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

# Set production environment for build
ENV NODE_ENV=production

# Set placeholder environment variables for build (will be overridden at runtime)
ENV NEXT_PUBLIC_SUPABASE_URL=placeholder_url
ENV SUPABASE_SERVICE_ROLE_KEY=placeholder_key

# Build the application (needs TypeScript and other dev deps)
RUN npm run build

# Clean up dev dependencies AFTER build
RUN npm prune --production

# Expose port
EXPOSE $PORT

# Start command
CMD ["npm", "start"]