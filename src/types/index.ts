// src/types/index.ts
export type PostType =
  | 'tutorial'
  | 'tool'
  | 'ebook'
  | 'video'
  | 'note'
  | 'opensource';

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
    html?: string;
    links?: Array<{ label: string; url: string }>;
    copyright?: string;
  };
  analytics?: {
    head?: string;
    body?: string;
  };
}
