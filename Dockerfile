# ---- Build stage: compile the static site with Astro ----
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm astro build

# ---- Serve stage: serve dist/ with Caddy (binds $PORT, 0.0.0.0) ----
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
