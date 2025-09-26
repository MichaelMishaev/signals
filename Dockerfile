# Railway Dockerfile for Next.js monorepo deployment
FROM node:20-alpine AS base

# Set working directory to the Next.js app
WORKDIR /app

# Copy package files
COPY signals/next-saas-nextjs/package*.json ./

# Set environment variables to skip git hooks and dev tools
ENV HUSKY=0
ENV CI=true
ENV NODE_ENV=production

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy application code
COPY signals/next-saas-nextjs .

# Build the Next.js application
RUN npm run build

# Remove devDependencies after build
RUN npm prune --omit=dev

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]