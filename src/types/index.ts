// src/types/index.ts
export type ResourceType =
  | 'tutorial'
  | 'tool'
  | 'ebook'
  | 'video'
  | 'note'
  | 'opensource';

export interface ResourceTypeInfo {
  id: ResourceType;
  name: string;
  icon: string;
  description: string;
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  siteUrl: string;
  author: string;
  pageSize: number;
  navLinks: Array<{ name: string; url: string }>;
}
