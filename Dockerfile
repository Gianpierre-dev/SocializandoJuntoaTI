# ---- Build stage: compile the site with Astro (static pages + admin panel) ----
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm astro build

# ---- Serve stage: Node standalone server (serves dist/client + /keystatic) ----
FROM node:22-slim
ENV NODE_ENV=production
ENV HOST=0.0.0.0
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
# Railway injects PORT; the Astro Node adapter reads HOST/PORT at runtime.
CMD ["node", "./dist/server/entry.mjs"]
