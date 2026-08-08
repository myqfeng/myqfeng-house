import { getCollection } from 'astro:content';
import type { PostType } from '@/types';

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

export async function getPostTypeCounts() {
  const posts = await getPosts();
  const counts: Record<PostType, number> = {
    tutorial: 0,
    tool: 0,
    ebook: 0,
    video: 0,
    note: 0,
    opensource: 0,
  };

  for (const post of posts) {
    counts[post.data.type as PostType]++;
  }

  return counts;
}

export async function getResourceTags() {
  const resources = await getResources();
  const counts: Record<string, number> = {};

  for (const resource of resources) {
    for (const tag of resource.data.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }

  return counts;
}
