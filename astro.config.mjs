// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://socializando-junto-a-ti-production.up.railway.app",
  // SSR con adaptador Node: las páginas leen su contenido de la API del
  // backend en cada request (editable desde /admin sin redesplegar).
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
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
