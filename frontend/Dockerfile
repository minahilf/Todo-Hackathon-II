FROM node:20-alpine AS base

# 1. Install Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# PostCSS aur dependencies install hongi
RUN npm ci

# 2. Build Code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# Build chalayein
RUN npm run build

# 3. Production Server (Standard Mode)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# --- MAGIC PART: Sab kuch copy karein ---
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

# Standalone ki bajaye simple start command
CMD ["npm", "start"]