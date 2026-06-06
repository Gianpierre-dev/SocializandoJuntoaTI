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

export const collections = { activities, values, team, allies };
