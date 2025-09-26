# Railway Dockerfile for Next.js monorepo deployment
FROM node:20-alpine AS base

# Set working directory to the Next.js app
WORKDIR /app

# Copy package files
COPY signals/next-saas-nextjs/package*.json ./

# Install dependencies WITHOUT running scripts (bypass Husky)
RUN npm ci --ignore-scripts

# Copy application code
COPY signals/next-saas-nextjs .

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV HUSKY=0

# Build the Next.js application
RUN npm run build

# Remove devDependencies after build
RUN npm prune --omit=dev

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]