# Railway Dockerfile for Next.js monorepo deployment
FROM node:20-alpine AS base

# Set working directory to the Next.js app
WORKDIR /app

# Copy package files
COPY signals/next-saas-nextjs/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY signals/next-saas-nextjs .

# Build the Next.js application
RUN npm run build

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]