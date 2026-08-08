// src/types/index.ts
// 分类 id 由用户在 site.ts 中自由定义，此处不限制具体取值
export type PostType = string;

export interface PostTypeInfo {
  id: PostType;
  name: string;
  icon: string;
  description: string;
}

export type NavLogo =
  | { type: 'emoji'; value: string; alt?: string }
  | { type: 'image'; value: string; alt?: string }
  | { type: 'icon'; value: string; alt?: string };

export interface HeroButton {
  label: string;
  url: string;
  style?: 'primary' | 'ghost';
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  siteUrl: string;
  author: string;
  pageSize: number;
  keywords?: string[];
  favicon?: string[];
  announcement?: string;
  navLinks: Array<{ name: string; url: string }>;
  navbar?: {
    logo?: NavLogo;
  };
  hero?: {
    eyebrow?: string;
    buttons?: HeroButton[];
  };
  socialLinks?: Array<{ label: string; url: string }>;
  footer?: {
    links?: Array<{ label: string; url: string }>;
    copyright?: string;
  };
  analytics?: {
    head?: string;
    body?: string;
  };
}

export interface ArtalkConfig {
  server: string;
  locale?: string;
  visitorCount?: boolean;
}

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: string;
  strict?: string;
  reactionsEnabled?: string;
  emitMetadata?: string;
  inputPosition?: string;
  lang?: string;
  loading?: string;
}

export interface CommentConfig {
  type: 'none' | 'artalk' | 'giscus';
  artalk?: ArtalkConfig;
  giscus?: GiscusConfig;
}
