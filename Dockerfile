# ── Stage 1: Build ────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache — só reinstala se package.json mudar)
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript → dist/
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy static dashboard
COPY public/ ./public/

# Cloud Run injects PORT automatically (default 8080)
EXPOSE 8080

CMD ["node", "dist/index.js"]
