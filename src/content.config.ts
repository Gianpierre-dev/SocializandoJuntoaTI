import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const activities = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/activities" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    cost: z.string(),
    modality: z.enum(["presencial", "online", "mixto"]),
    order: z.number(),
    status: z.enum(["active", "in-development"]),
  }),
});

const values = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/values" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const allies = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/allies" }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    url: z.string().optional(),
    order: z.number(),
  }),
});

// Banners del carrusel de portada. Con `image` se muestra la pieza gráfica
// completa (recomendado 1940x582, ratio 10:3, como los banners de SENAJU);
// sin `image` se renderiza la composición de color con los textos.
const banners = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/banners" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kicker: z.string(),
      description: z.string().optional(),
      href: z.string(),
      ctaLabel: z.string().optional(),
      variant: z.enum(["brand", "gold", "green"]).default("brand"),
      image: image().optional(),
      /** Texto alternativo obligatorio cuando el banner es una imagen. */
      alt: z.string().optional(),
      order: z.number(),
    }),
});

// Tiles del mosaico de programas. Con `image` se muestra la pieza gráfica
// (recomendado 924x616, ratio 3:2); sin `image`, tile de color con textos.
const programas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/programas" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      href: z.string(),
      variant: z
        .enum(["brand", "gold", "rose", "green", "deep", "subtle"])
        .default("brand"),
      image: image().optional(),
      alt: z.string().optional(),
      order: z.number(),
    }),
});

export const collections = {
  activities,
  values,
  team,
  allies,
  banners,
  programas,
};
