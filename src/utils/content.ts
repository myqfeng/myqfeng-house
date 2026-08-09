import { getCollection } from 'astro:content';
import { postTypes, getPostTypeById } from '@/config/postConfig';

function sortContent<T extends { data: { pinned?: boolean; published: Date } }>(items: T[]) {
  return items.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.published.valueOf() - a.data.published.valueOf();
  });
}

// type 形如 "language-basics/C语言期末速成"，/ 前为主分类 id，后为子分类名
export function getMainType(type: string): string {
  return type.split('/')[0];
}

// 子分类显示名：主分类有子分类时返回 "主分类名 / 子分类名"，否则返回主分类名
export function getTypeName(type: string): string {
  const [mainId, subName] = type.split('/');
  const main = getPostTypeById(mainId);
  const mainName = main ? main.name : mainId;
  return subName ? `${mainName} · ${subName}` : mainName;
}

export interface SubTypeInfo {
  name: string; // 子分类名（type 第二段）
  type: string; // 完整 type：主分类id/子分类名
  count: number;
}

// 按主分类分组统计子分类（仅统计含 "/" 的 type）
export function getSubTypes(posts: Array<{ data: { type: string } }>): Record<string, SubTypeInfo[]> {
  const map: Record<string, Map<string, SubTypeInfo>> = {};
  for (const post of posts) {
    const type = post.data.type;
    const slash = type.indexOf('/');
    if (slash === -1) continue;
    const parent = type.slice(0, slash);
    const name = type.slice(slash + 1);
    map[parent] ??= new Map();
    const info = map[parent].get(name) ?? { name, type, count: 0 };
    info.count++;
    map[parent].set(name, info);
  }
  return Object.fromEntries(Object.entries(map).map(([parent, subs]) => [parent, [...subs.values()]]));
}

export async function getPosts(options: { pinnedFirst?: boolean } = {}) {
  const { pinnedFirst = true } = options;
  const posts = await getCollection('posts');
  const list = posts.filter((p) => !p.data.draft);
  if (!pinnedFirst) {
    return list.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  }
  return sortContent(list);
}

export async function getResources() {
  const resources = await getCollection('resources');
  return sortContent(resources.filter((r) => !r.data.draft));
}

export async function getPostTypeCounts() {
  const posts = await getPosts();
  const counts: Record<string, number> = {};
  for (const type of postTypes) counts[type.id] = 0;
  for (const post of posts) {
    const main = getMainType(post.data.type);
    if (main in counts) counts[main]++;
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
