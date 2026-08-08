import { getCollection } from 'astro:content';
import type { ResourceType } from '@/types';

function sortContent<T extends { data: { pinned?: boolean; published: Date } }>(items: T[]) {
  return items.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.published.valueOf() - a.data.published.valueOf();
  });
}

export async function getPosts() {
  const posts = await getCollection('posts');
  return sortContent(posts.filter((p) => !p.data.draft));
}

export async function getResources() {
  const resources = await getCollection('resources');
  return sortContent(resources.filter((r) => !r.data.draft));
}

export async function getPostsByType(type: ResourceType) {
  const posts = await getPosts();
  return posts.filter((p) => p.data.type === type);
}

export async function getResourcesByType(type: ResourceType) {
  const resources = await getResources();
  return resources.filter((r) => r.data.type === type);
}

export async function getResourceTypeCounts() {
  const posts = await getPosts();
  const resources = await getResources();
  const counts: Record<ResourceType, number> = {
    tutorial: 0,
    tool: 0,
    ebook: 0,
    video: 0,
    note: 0,
    opensource: 0,
  };

  for (const post of posts) {
    counts[post.data.type as ResourceType]++;
  }

  for (const resource of resources) {
    counts[resource.data.type as ResourceType]++;
  }

  return counts;
}
