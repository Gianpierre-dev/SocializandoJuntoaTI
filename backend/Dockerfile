# ---- Build stage ----
FROM node:22-slim AS build
RUN corepack enable && apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build

# ---- Runtime stage ----
FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
# Aplica migraciones pendientes y levanta la API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
