# IntegridAI HackAI 2025 - Docker Configuration
# Multi-stage build for production-ready container

# Stage 1: Base Node.js image for frontend and mock APIs
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    sqlite \
    git

WORKDIR /app

# Stage 2: Install dependencies
FROM base AS dependencies

# Copy package files
COPY package*.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Stage 3: Development environment
FROM dependencies AS development

# Install development dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Create data directory for SQLite databases
RUN mkdir -p /app/data && chmod 755 /app/data

# Generate demo data
RUN npm run seed:demo

# Expose ports
EXPOSE 3000 3001 8000

# Development command
CMD ["npm", "run", "dev"]

# Stage 4: Production build
FROM dependencies AS production

# Set environment
ENV NODE_ENV=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S integridai -u 1001

# Create and set permissions for data directory
RUN mkdir -p /app/data && \
    chown -R integridai:nodejs /app/data && \
    chmod 755 /app/data

# Switch to non-root user
USER integridai

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Production command
CMD ["npm", "start"]