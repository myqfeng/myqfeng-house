import { defineCollection, z } from 'astro:content';
import { resourceTypes } from '@/config/site';

const resourceTypeIds = resourceTypes.map((t) => t.id) as [string, ...string[]];

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    published: z.date(),
    updated: z.date().optional(),
    author: z.string().default('站长'),
    source: z.enum(['original', 'repost-local', 'repost-external']).default('original'),
    sourceUrl: z.string().optional(),
    type: z.enum(resourceTypeIds).default('tutorial'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
  }),
});

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    published: z.date(),
    downloadType: z.enum(['link', 'pan', 'github']).default('link'),
    url: z.string(),
    extractCode: z.string().optional(),
    source: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
  }),
});

export const collections = { posts, resources };
