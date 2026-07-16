// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  // Las páginas del sitio se prerenderizan (estático); el adaptador Node solo
  // sirve las rutas del panel administrativo (/keystatic) marcadas prerender=false.
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystatic()],
  // host: true binds 0.0.0.0; port reads Railway's injected PORT at runtime.
  server: {
    host: true,
    port: Number(process.env.PORT) || 4321,
  },
  vite: {
    // El cast evita el conflicto de tipos entre el vite de Astro (v7) y el
    // que resuelve @tailwindcss/vite (v8); en runtime son compatibles.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
