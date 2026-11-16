import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const properties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/properties' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      city: z.enum(['Cedar Rapids', 'Marion', 'Hiawatha']),
      type: z.enum(['Apartment', 'Townhouse', 'House', 'Commercial']),
      beds: z.number(),
      baths: z.number(),
      garage: z.boolean().default(false),
      price: z.string().default('Call for Pricing'),
      available: z.boolean().default(false),
      featured: z.boolean().default(false),
      summary: z.string(),
      features: z.array(z.string()).default([]),
      schools: z
        .object({ high: z.string(), middle: z.string(), elementary: z.string() })
        .optional(),
      address: z.string().optional(),
      location: z
        .object({ lat: z.number(), lng: z.number(), exact: z.boolean().default(false) })
        .optional(),
      images: z.array(image()).min(1),
      legacyUrl: z.string().optional(),
    }),
});

export const collections = { properties };
