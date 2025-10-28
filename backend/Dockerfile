# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Kopíruj package files
COPY package*.json ./

# Instaluj dependencies
RUN npm ci

# Kopíruj zdrojový kód
COPY . .

# Build aplikace
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instaluj pouze production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Kopíruj built aplikaci z builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start aplikace
CMD ["node", "dist/main"]

