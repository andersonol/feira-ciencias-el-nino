# ==========================================
# Estágio 1: Build do Frontend (React)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ==========================================
# Estágio 2: Instalação do Backend (Node.js)
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

# ==========================================
# Estágio 3: Runtime de Produção (Debian Slim)
# ==========================================
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/bash appuser

COPY --chown=appuser:appgroup server/package*.json ./
COPY --chown=appuser:appgroup --from=backend-builder /app/server/node_modules ./node_modules
COPY --chown=appuser:appgroup server/ ./server/
COPY --chown=appuser:appgroup --from=frontend-builder /app/client/dist ./client/dist

RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite

#HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server/index.js"]