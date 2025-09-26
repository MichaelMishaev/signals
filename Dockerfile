# Railway Dockerfile - Next.js monorepo deployment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY signals/next-saas-nextjs/package*.json ./

# Set environment to skip git hooks and dev tools
ENV NODE_ENV=production
ENV CI=true
ENV HUSKY=0

# Install all dependencies (needed for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY signals/next-saas-nextjs .

# Build the application
RUN npm run build

# Clean up dev dependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE $PORT

# Start command
CMD ["npm", "start"]