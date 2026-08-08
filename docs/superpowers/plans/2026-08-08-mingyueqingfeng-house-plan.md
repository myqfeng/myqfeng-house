# 明月清风的小屋 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 5 + Tailwind CSS 3 + TypeScript 从零搭建一个名为“明月清风的小屋”的静态学习资源聚合站，支持原创/转载文章、资源下载链接分享、分类筛选与搜索。

**Architecture:** 采用 Astro Content Collections 管理本地 Markdown 内容（文章与资源），Astro 静态渲染生成页面，客户端仅保留主题切换、分类筛选、搜索弹窗等必要交互；暗夜明月风主题通过 Tailwind CSS 自定义色板与 CSS 变量实现。

**Tech Stack:** Astro 5, Tailwind CSS 3, TypeScript, Pagefind, Astro Icon (Iconify), pnpm

## Global Constraints

- Node.js ≥ 22，pnpm ≥ 9（推荐）。
- 输出模式：`output: 'static'`（完全静态）。
- 不使用 Firefly 模板源码，仅参考其清新卡片式、响应式、配置驱动的风格。
- 所有站点配置集中在 `src/data/site.ts`。
- 内容 frontmatter 必须通过 `src/content/config.ts` 校验。
- 资源下载以链接分享为主，不存储实际文件。
- 默认暗色模式，支持亮/暗/跟随系统切换。
- 每完成一个任务后必须运行 `astro build` 验证无构建错误。

---

## 文件结构总览

```
myqfeng-house/
├── public/
│   ├── favicon.svg
│   └── images/               # 示例封面/图标（可选）
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Hero.astro
│   │   │   ├── BaseLayout.astro
│   │   │   ├── PostCard.astro
│   │   │   └── ResourceCard.astro
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Tag.astro
│   │   │   ├── SearchBox.astro
│   │   │   └── ThemeToggle.astro
│   │   └── widgets/
│   │       ├── CategoryGrid.astro
│   │       ├── Pagination.astro
│   │       └── PostList.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── posts/
│   │   │   ├── hello-world.md
│   │   │   └── astro-guide.md
│   │   └── resources/
│   │       ├── vscode.md
│   │       └── react-course.md
│   ├── data/
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── posts.astro
│   │   ├── posts/[slug].astro
│   │   ├── categories.astro
│   │   ├── categories/[type].astro
│   │   ├── resources.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── content.ts
│       └── format.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Task 1: 初始化 Astro 项目与依赖

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `postcss.config.cjs`, `README.md`
- Create: `src/env.d.ts`

**Interfaces:**
- Consumes: 无。
- Produces: 可运行的 Astro 5 项目骨架，支持 TypeScript 和 Tailwind CSS 3。

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "mingyueqingfeng-house",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.7.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "astro-icon": "^1.1.0",
    "pagefind": "^1.3.0"
  },
  "engines": {
    "node": ">=22"
  }
}
```

- [ ] **Step 2: 创建 astro.config.mjs**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://example.com',
});
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/data/*": ["src/data/*"],
      "@/utils/*": ["src/utils/*"],
      "@/styles/*": ["src/styles/*"]
    }
  }
}
```

- [ ] **Step 4: 创建 postcss.config.cjs**

```javascript
// @ts-check
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: 创建 tailwind.config.mjs**

```javascript
import typography from '@tailwindcss/typography';

// @ts-check
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        moon: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        sky: {
          glow: '#93c5fd',
          bright: '#60a5fa',
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [typography]
};
```

- [ ] **Step 6: 创建 src/env.d.ts**

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 7: 安装依赖并验证**

Run: `pnpm install`  
Expected: 依赖安装成功，无报错。

- [ ] **Step 8: 运行开发服务器验证**

Run: `pnpm dev`  
Expected: 服务器启动，访问 `http://localhost:4321` 显示 Astro 默认欢迎页。

- [ ] **Step 9: 创建 README.md**

```markdown
# 明月清风的小屋

个人学习资源聚合站，基于 Astro 5 + Tailwind CSS 3 构建。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```
```

- [ ] **Step 10: 初始化 Git 仓库（如尚未初始化）**

Run:
```bash
git init
git add .
git commit -m "chore: initialize Astro project with Tailwind CSS"
```

Expected: 项目被初始化为 git 仓库，提交成功。如果仓库已存在，此步骤可跳过。

---

## Task 2: 全局样式与站点配置

**Files:**
- Create: `src/styles/global.css`, `src/data/site.ts`, `src/types/index.ts`
- Modify: `astro.config.mjs`（更新 site URL）

**Interfaces:**
- Consumes: 无。
- Produces: `siteConfig` 对象导出；`ResourceType` 联合类型；全局 CSS 变量定义。

- [ ] **Step 1: 创建全局样式文件**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #0f172a;
    --color-card: rgba(30, 41, 59, 0.7);
    --color-text: #f8fafc;
    --color-text-muted: #94a3b8;
    --color-accent: #60a5fa;
    --color-accent-hover: #93c5fd;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-moon-900 text-moon-50 antialiased;
    background: radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%);
    min-height: 100vh;
  }
}

@layer components {
  .glass-card {
    @apply rounded-2xl border border-moon-700/50 bg-moon-800/70 backdrop-blur-md shadow-lg;
  }
}
```

- [ ] **Step 2: 创建类型定义**

```typescript
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
```

- [ ] **Step 3: 创建站点配置**

```typescript
// src/data/site.ts
import type { SiteConfig, ResourceTypeInfo } from '@/types';

export const siteConfig: SiteConfig = {
  title: '明月清风的小屋',
  subtitle: '收集星光，分享知识',
  description: '一个专注于学习资源收集与分享的个人站点，包含原创文章、转载文章与各类资源下载链接。',
  siteUrl: 'https://example.com',
  author: '站长',
  pageSize: 12,
  navLinks: [
    { name: '首页', url: '/' },
    { name: '文章', url: '/posts' },
    { name: '分类', url: '/categories' },
    { name: '资源', url: '/resources' },
    { name: '关于', url: '/about' },
  ],
};

export const resourceTypes: ResourceTypeInfo[] = [
  { id: 'tutorial', name: '教程文章', icon: 'lucide:book-open', description: '系统化的学习教程与文章' },
  { id: 'tool', name: '工具软件', icon: 'lucide:wrench', description: '提升效率的软件与工具' },
  { id: 'ebook', name: '电子书/PDF', icon: 'lucide:book', description: '电子书籍与 PDF 文档' },
  { id: 'video', name: '视频课程', icon: 'lucide:play-circle', description: '优质视频教程' },
  { id: 'note', name: '笔记资料', icon: 'lucide:notebook', description: '学习笔记与资料整理' },
  { id: 'opensource', name: '开源项目', icon: 'lucide:code', description: '值得学习的开源项目' },
];

export function getResourceTypeById(id: string): ResourceTypeInfo | undefined {
  return resourceTypes.find((t) => t.id === id);
}
```

- [ ] **Step 4: 更新 astro.config.mjs 的 site URL**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 5: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，无 TypeScript 或 CSS 错误。

- [ ] **Step 6: Commit**

```bash
git add src/styles src/data src/types astro.config.mjs
git commit -m "feat: add global styles, site config and resource type definitions"
```

---

## Task 3: 定义 Content Collections 与示例数据

**Files:**
- Create: `src/content/config.ts`, `src/utils/content.ts`, `src/utils/format.ts`
- Create: 示例 Markdown 文件（`src/content/posts/hello-world.md`, `src/content/posts/astro-guide.md`, `src/content/resources/vscode.md`, `src/content/resources/react-course.md`）

**Interfaces:**
- Consumes: `ResourceType` 类型（Task 2）。
- Produces: `getPosts()`, `getResources()`, `getPostsByType()`, `getResourceTypeCounts()` 等工具函数。

- [ ] **Step 1: 创建 Content Collections 配置**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { resourceTypes } from '@/data/site';

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
    type: z.enum(resourceTypeIds).default('tool'),
    downloadType: z.enum(['link', 'pan', 'github']).default('link'),
    url: z.string(),
    extractCode: z.string().optional(),
    source: z.string().default(''),
    tags: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
  }),
});

export const collections = { posts, resources };
```

- [ ] **Step 2: 创建示例文章**

```markdown
---
title: "欢迎来到明月清风的小屋"
description: "这是站点的第一篇示例文章，用于测试布局和展示效果。"
published: 2026-08-08
source: original
type: note
tags: ["开始", "说明"]
pinned: true
---

欢迎来到明月清风的小屋！这里是一个收集学习资源、分享知识的地方。

## 站点内容

- 原创文章
- 转载文章
- 资源下载链接

希望这里能帮你找到需要的学习资料。
```

```markdown
---
title: "Astro 5 快速上手"
description: "一篇关于 Astro 5 静态站点生成器的入门教程。"
published: 2026-08-07
source: repost-external
sourceUrl: "https://docs.astro.build"
type: tutorial
tags: ["Astro", "前端", "静态站点"]
---

Astro 是一个现代化的静态站点生成器，专注于内容驱动的网站。
```

- [ ] **Step 3: 创建示例资源**

```markdown
---
title: "Visual Studio Code"
description: "微软出品的免费代码编辑器，插件生态丰富。"
published: 2026-08-08
type: tool
downloadType: link
url: "https://code.visualstudio.com/"
source: "Microsoft"
tags: ["编辑器", "开发工具"]
---

VS Code 是目前最流行的代码编辑器之一，支持多种编程语言和丰富的插件。
```

```markdown
---
title: "React 入门视频课程"
description: "一套适合初学者的 React 视频教程。"
published: 2026-08-06
type: video
downloadType: pan
url: "https://example.com/pan/react-course"
extractCode: "abcd"
source: "某在线教育平台"
tags: ["React", "前端", "视频"]
---

本课程从 React 基础概念讲起，逐步深入到 Hooks、组件化等核心知识。
```

- [ ] **Step 4: 创建内容工具函数**

```typescript
// src/utils/content.ts
import { getCollection } from 'astro:content';
import type { ResourceType } from '@/types';

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return b.data.published.valueOf() - a.data.published.valueOf();
    });
}

export async function getResources() {
  const resources = await getCollection('resources');
  return resources
    .filter((r) => !r.data.draft)
    .sort((a, b) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return b.data.published.valueOf() - a.data.published.valueOf();
    });
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
```

- [ ] **Step 5: 创建格式化工具函数**

```typescript
// src/utils/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
```

- [ ] **Step 6: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，内容集合被正确解析。

- [ ] **Step 7: Commit**

```bash
git add src/content src/utils src/content.config.ts
git commit -m "feat: add content collections and sample data"
```

---

## Task 4: 基础布局组件（BaseLayout / Navbar / Footer / ThemeToggle）

**Files:**
- Create: `src/components/layout/BaseLayout.astro`, `src/components/layout/Navbar.astro`, `src/components/layout/Footer.astro`, `src/components/ui/ThemeToggle.astro`
- Modify: `src/styles/global.css`（添加主题切换相关样式）

**Interfaces:**
- Consumes: `siteConfig`（Task 2）。
- Produces: `BaseLayout` 组件，接收 `title`、`description` 参数；`ThemeToggle` 客户端组件。

- [ ] **Step 1: 创建 BaseLayout**

```astro
---
import '@/styles/global.css';
import Navbar from '@/components/layout/Navbar.astro';
import Footer from '@/components/layout/Footer.astro';
import { siteConfig } from '@/data/site';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
const pageDescription = description || siteConfig.description;
---

<!DOCTYPE html>
<html lang="zh-CN" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={pageDescription} />
    <title>{pageTitle}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <script is:inline>
      // 初始化主题
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme);
    </script>
  </head>
  <body class="flex min-h-screen flex-col">
    <Navbar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: 创建 Navbar**

```astro
---
import { Icon } from 'astro-icon/components';
import { siteConfig } from '@/data/site';
import ThemeToggle from '@/components/ui/ThemeToggle.astro';
---

<header class="sticky top-0 z-50 border-b border-moon-700/50 bg-moon-900/80 backdrop-blur-md">
  <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <a href="/" class="flex items-center gap-2 text-xl font-bold text-moon-50 hover:text-sky-glow">
      <Icon name="lucide:moon" class="h-6 w-6" />
      <span>{siteConfig.title}</span>
    </a>

    <div class="hidden items-center gap-8 md:flex">
      {siteConfig.navLinks.map((link) => (
        <a href={link.url} class="text-sm font-medium text-moon-200 transition hover:text-sky-glow">
          {link.name}
        </a>
      ))}
      <ThemeToggle />
    </div>

    <button class="text-moon-200 md:hidden" aria-label="菜单" id="mobile-menu-btn">
      <Icon name="lucide:menu" class="h-6 w-6" />
    </button>
  </nav>

  <div id="mobile-menu" class="hidden border-t border-moon-700/50 px-4 py-4 md:hidden">
    {siteConfig.navLinks.map((link) => (
      <a href={link.url} class="block py-2 text-moon-200 hover:text-sky-glow">
        {link.name}
      </a>
    ))}
    <div class="pt-2">
      <ThemeToggle />
    </div>
  </div>
</header>

<script is:inline>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
</script>
```

- [ ] **Step 3: 创建 Footer**

```astro
---
import { siteConfig } from '@/data/site';
---

<footer class="border-t border-moon-700/50 bg-moon-900/50 py-8">
  <div class="mx-auto max-w-7xl px-4 text-center">
    <p class="text-sm text-moon-300">
      © {new Date().getFullYear()} {siteConfig.title}. 明月清风，静谧求知。
    </p>
  </div>
</footer>
```

- [ ] **Step 4: 创建 ThemeToggle**

```astro
<button id="theme-toggle" class="rounded-lg p-2 text-moon-200 transition hover:bg-moon-700/50 hover:text-sky-glow" aria-label="切换主题">
  <span class="dark-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></span>
  <span class="light-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></span>
</button>

<script is:inline>
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      html.classList.remove('light', 'dark');
      html.classList.add(next);
      localStorage.setItem('theme', next);
    });
  }
</script>

<style>
  .dark .dark-hidden { display: none; }
  html:not(.dark) .light-hidden { display: none; }
</style>
```

- [ ] **Step 5: 创建 favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#1e293b" />
  <circle cx="50" cy="50" r="35" fill="none" stroke="#60a5fa" stroke-width="3" />
  <circle cx="50" cy="50" r="12" fill="#f8fafc" />
</svg>
```

- [ ] **Step 6: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，所有页面包含统一布局。

- [ ] **Step 7: Commit**

```bash
git add src/components src/styles public/favicon.svg
git commit -m "feat: add base layout, navbar, footer and theme toggle"
```

---

## Task 5: 首页 Hero + 分类入口 + 最新推荐

**Files:**
- Create: `src/components/layout/Hero.astro`, `src/components/widgets/CategoryGrid.astro`, `src/components/layout/PostCard.astro`, `src/components/layout/ResourceCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteConfig`, `resourceTypes`, `getPosts()`, `getResources()`, `getResourceTypeCounts()`（Task 3）。
- Produces: 首页布局，包含 Hero、分类入口、最新推荐。

- [ ] **Step 1: 创建 Hero 组件**

```astro
---
import { siteConfig } from '@/data/site';
---

<section class="relative flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-bright/20 blur-3xl"></div>
    <div class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
  </div>
  <div class="relative z-10">
    <h1 class="mb-4 text-4xl font-bold tracking-tight text-moon-50 md:text-6xl">
      {siteConfig.title}
    </h1>
    <p class="mb-8 text-lg text-moon-300 md:text-xl">
      {siteConfig.subtitle}
    </p>
    <a href="/posts" class="inline-flex items-center gap-2 rounded-full bg-sky-bright px-6 py-3 font-medium text-moon-900 transition hover:bg-sky-glow">
      开始探索
    </a>
  </div>
</section>
```

- [ ] **Step 2: 创建 CategoryGrid 组件**

```astro
---
import { Icon } from 'astro-icon/components';
import { resourceTypes } from '@/data/site';

interface Props {
  counts: Record<string, number>;
}

const { counts } = Astro.props;
---

<section class="mx-auto max-w-7xl px-4 py-16">
  <h2 class="mb-8 text-center text-2xl font-bold text-moon-50">资源分类</h2>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {resourceTypes.map((type) => (
      <a href={`/categories/${type.id}`} class="glass-card group flex items-center gap-4 p-6 transition hover:-translate-y-1 hover:border-sky-bright/50">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-bright/10 text-sky-glow">
          <Icon name={type.icon} class="h-6 w-6" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-moon-50 group-hover:text-sky-glow">{type.name}</h3>
          <p class="text-sm text-moon-300">{counts[type.id] || 0} 个条目</p>
        </div>
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 3: 创建 PostCard 组件**

```astro
---
import { Icon } from 'astro-icon/components';
import type { CollectionEntry } from 'astro:content';
import { getResourceTypeById } from '@/data/site';
import { formatDate } from '@/utils/format';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const typeInfo = getResourceTypeById(post.data.type);
const href = post.data.source === 'repost-external' && post.data.sourceUrl
  ? post.data.sourceUrl
  : `/posts/${post.id}`;
const isExternal = post.data.source === 'repost-external' && post.data.sourceUrl;
---

<article class="glass-card flex flex-col p-6 transition hover:-translate-y-1 hover:border-sky-bright/50">
  <div class="mb-3 flex items-center gap-2">
    {typeInfo && <Icon name={typeInfo.icon} class="h-4 w-4 text-sky-glow" />}
    <span class="text-xs font-medium text-sky-glow">{typeInfo?.name}</span>
    {isExternal && <span class="ml-auto text-xs text-moon-400">外部链接</span>}
  </div>
  <h3 class="mb-2 text-xl font-semibold text-moon-50">
    <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} class="hover:text-sky-glow">
      {post.data.title}
    </a>
  </h3>
  <p class="mb-4 flex-1 text-sm text-moon-300 line-clamp-2">{post.data.description}</p>
  <div class="flex items-center justify-between text-xs text-moon-400">
    <span>{formatDate(post.data.published)}</span>
    <span class="flex items-center gap-1">
      {post.data.tags.slice(0, 3).map((tag) => (
        <span class="rounded-full bg-moon-700/50 px-2 py-1">{tag}</span>
      ))}
    </span>
  </div>
</article>
```

- [ ] **Step 4: 创建 ResourceCard 组件**

```astro
---
import { Icon } from 'astro-icon/components';
import type { CollectionEntry } from 'astro:content';
import { getResourceTypeById } from '@/data/site';
import { formatDate } from '@/utils/format';

interface Props {
  resource: CollectionEntry<'resources'>;
}

const { resource } = Astro.props;
const typeInfo = getResourceTypeById(resource.data.type);
const downloadLabel = {
  link: '前往下载',
  pan: '网盘下载',
  github: 'GitHub',
}[resource.data.downloadType];
---

<article class="glass-card flex flex-col p-6 transition hover:-translate-y-1 hover:border-sky-bright/50">
  <div class="mb-3 flex items-center gap-2">
    {typeInfo && <Icon name={typeInfo.icon} class="h-4 w-4 text-sky-glow" />}
    <span class="text-xs font-medium text-sky-glow">{typeInfo?.name}</span>
  </div>
  <h3 class="mb-2 text-xl font-semibold text-moon-50">{resource.data.title}</h3>
  <p class="mb-4 flex-1 text-sm text-moon-300 line-clamp-2">{resource.data.description}</p>
  <div class="mb-4 flex flex-wrap gap-2">
    {resource.data.tags.slice(0, 3).map((tag) => (
      <span class="rounded-full bg-moon-700/50 px-2 py-1 text-xs text-moon-300">{tag}</span>
    ))}
  </div>
  <div class="flex items-center justify-between">
    <span class="text-xs text-moon-400">{formatDate(resource.data.published)}</span>
    <a href={resource.data.url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded-lg bg-sky-bright/10 px-3 py-1.5 text-sm font-medium text-sky-glow transition hover:bg-sky-bright/20">
      {downloadLabel}
      <Icon name="lucide:external-link" class="h-3.5 w-3.5" />
    </a>
  </div>
  {resource.data.extractCode && (
    <div class="mt-3 flex items-center gap-2 text-xs text-moon-300">
      <span>提取码：</span>
      <code class="rounded bg-moon-700/50 px-2 py-1">{resource.data.extractCode}</code>
    </div>
  )}
</article>
```

- [ ] **Step 5: 创建首页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import Hero from '@/components/layout/Hero.astro';
import CategoryGrid from '@/components/widgets/CategoryGrid.astro';
import PostCard from '@/components/layout/PostCard.astro';
import ResourceCard from '@/components/layout/ResourceCard.astro';
import { getPosts, getResources, getResourceTypeCounts } from '@/utils/content';

const counts = await getResourceTypeCounts();
const posts = await getPosts();
const resources = await getResources();
const latestPosts = posts.slice(0, 3);
const latestResources = resources.slice(0, 3);
---

<BaseLayout>
  <Hero />
  <CategoryGrid counts={counts} />
  
  <section class="mx-auto max-w-7xl px-4 py-16">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-moon-50">最新文章</h2>
      <a href="/posts" class="text-sm text-sky-glow hover:underline">查看全部</a>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {latestPosts.map((post) => <PostCard post={post} />)}
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-moon-50">最新资源</h2>
      <a href="/resources" class="text-sm text-sky-glow hover:underline">查看全部</a>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {latestResources.map((resource) => <ResourceCard resource={resource} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，首页输出正确。

- [ ] **Step 7: Commit**

```bash
git add src/pages src/components
git commit -m "feat: add homepage with hero, category grid and latest posts/resources"
```

---

## Task 6: /posts 文章列表页（分类筛选 + 搜索 + 分页）

**Files:**
- Create: `src/components/widgets/PostList.astro`, `src/components/ui/SearchBox.astro`, `src/components/ui/Pagination.astro`
- Modify: `src/pages/posts.astro`

**Interfaces:**
- Consumes: `getPosts()`, `getResourceTypeCounts()`, `siteConfig.pageSize`（Task 3）。
- Produces: 可筛选、可搜索、可分页的文章列表页。

- [ ] **Step 1: 创建 SearchBox 组件**

```astro
---
interface Props {
  id?: string;
  placeholder?: string;
}

const { id = 'search', placeholder = '搜索文章...' } = Astro.props;
---

<div class="relative">
  <input
    id={id}
    type="text"
    placeholder={placeholder}
    class="w-full rounded-xl border border-moon-700/50 bg-moon-800/50 px-4 py-3 pl-10 text-moon-50 placeholder-moon-400 focus:border-sky-bright focus:outline-none"
  />
  <svg class="absolute left-3 top-3.5 h-5 w-5 text-moon-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
</div>

<script is:inline define:vars={{ id }}>
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.toLowerCase();
      const cards = document.querySelectorAll('[data-searchable]');
      cards.forEach((card) => {
        const text = card.getAttribute('data-searchable')?.toLowerCase() || '';
        card.classList.toggle('hidden', !text.includes(value));
      });
    });
  }
</script>
```

- [ ] **Step 2: 创建 Pagination 组件**

```astro
---
interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const { currentPage, totalPages, baseUrl } = Astro.props;
---

{totalPages > 1 && (
  <nav class="flex justify-center gap-2 py-8">
    {currentPage > 1 && (
      <a href={`${baseUrl}?page=${currentPage - 1}`} class="rounded-lg bg-moon-800 px-4 py-2 text-moon-200 hover:bg-moon-700 hover:text-sky-glow">
        上一页
      </a>
    )}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <a href={`${baseUrl}?page=${page}`} class={`rounded-lg px-4 py-2 ${page === currentPage ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700 hover:text-sky-glow'}`}>
        {page}
      </a>
    ))}
    {currentPage < totalPages && (
      <a href={`${baseUrl}?page=${currentPage + 1}`} class="rounded-lg bg-moon-800 px-4 py-2 text-moon-200 hover:bg-moon-700 hover:text-sky-glow">
        下一页
      </a>
    )}
  </nav>
)}
```

- [ ] **Step 3: 创建 PostList 组件**

```astro
---
import type { CollectionEntry } from 'astro:content';
import PostCard from '@/components/layout/PostCard.astro';

interface Props {
  posts: CollectionEntry<'posts'>[];
}

const { posts } = Astro.props;
---

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post) => (
    <div data-searchable={`${post.data.title} ${post.data.description} ${post.data.tags.join(' ')}`}>
      <PostCard post={post} />
    </div>
  ))}
</div>
```

- [ ] **Step 4: 创建 /posts 页面**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import SearchBox from '@/components/ui/SearchBox.astro';
import PostList from '@/components/widgets/PostList.astro';
import Pagination from '@/components/ui/Pagination.astro';
import { getPosts, getResourceTypeCounts } from '@/utils/content';
import { resourceTypes } from '@/data/site';
import { siteConfig } from '@/data/site';

const posts = await getPosts();
const counts = await getResourceTypeCounts();

const url = new URL(Astro.request.url);
const currentType = url.searchParams.get('type') || 'all';
const currentPage = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));

const filteredPosts = currentType === 'all'
  ? posts
  : posts.filter((p) => p.data.type === currentType);

const totalPages = Math.ceil(filteredPosts.length / siteConfig.pageSize);
const paginatedPosts = filteredPosts.slice(
  (currentPage - 1) * siteConfig.pageSize,
  currentPage * siteConfig.pageSize
);
---

<BaseLayout title="文章" description="浏览所有原创文章和转载文章">
  <section class="mx-auto max-w-7xl px-4 py-12">
    <h1 class="mb-8 text-3xl font-bold text-moon-50">文章列表</h1>

    <div class="mb-6 flex flex-wrap gap-2">
      <a href="/posts" class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${currentType === 'all' ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700'}`}>
        全部 ({posts.length})
      </a>
      {resourceTypes.map((type) => (
        <a href={`/posts?type=${type.id}`} class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${currentType === type.id ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700'}`}>
          {type.name} ({counts[type.id] || 0})
        </a>
      ))}
    </div>

    <div class="mb-8">
      <SearchBox placeholder="搜索文章标题、描述或标签..." />
    </div>

    <PostList posts={paginatedPosts} />

    <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/posts?type=${currentType}`} />
  </section>
</BaseLayout>
```

- [ ] **Step 5: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，`/posts` 页面生成正确。

- [ ] **Step 6: Commit**

```bash
git add src/pages/posts.astro src/components/ui src/components/widgets
git commit -m "feat: add posts list page with filtering, search and pagination"
```

---

## Task 7: 文章详情页 /posts/[slug]

**Files:**
- Create: `src/pages/posts/[slug].astro`

**Interfaces:**
- Consumes: `getPosts()`（Task 3），Astro `render()` 函数。
- Produces: 文章详情页面，支持 Markdown 渲染和转载链接。

- [ ] **Step 1: 创建详情页**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@/components/layout/BaseLayout.astro';
import { getResourceTypeById } from '@/data/site';
import { formatDate } from '@/utils/format';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const typeInfo = getResourceTypeById(post.data.type);
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="mx-auto max-w-3xl px-4 py-12">
    <header class="mb-8">
      <div class="mb-4 flex items-center gap-2 text-sm text-sky-glow">
        {typeInfo && <span>{typeInfo.name}</span>}
        <span>·</span>
        <span>{formatDate(post.data.published)}</span>
      </div>
      <h1 class="mb-4 text-3xl font-bold text-moon-50 md:text-4xl">{post.data.title}</h1>
      {post.data.description && (
        <p class="text-lg text-moon-300">{post.data.description}</p>
      )}
      {post.data.tags.length > 0 && (
        <div class="mt-4 flex flex-wrap gap-2">
          {post.data.tags.map((tag) => (
            <span class="rounded-full bg-moon-800 px-3 py-1 text-xs text-moon-300">{tag}</span>
          ))}
        </div>
      )}
    </header>

    {post.data.source !== 'original' && (
      <div class="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
        <p class="mb-2">本文为转载内容，版权归原作者所有。</p>
        {post.data.sourceUrl && (
          <a href={post.data.sourceUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-medium text-sky-glow hover:underline">
            阅读原文
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>
    )}

    <div class="prose prose-invert prose-lg max-w-none prose-headings:text-moon-50 prose-p:text-moon-200 prose-a:text-sky-glow prose-strong:text-moon-100">
      <Content />
    </div>

    <footer class="mt-12 border-t border-moon-700/50 pt-6">
      <a href="/posts" class="text-sm text-sky-glow hover:underline">← 返回文章列表</a>
    </footer>
  </article>
</BaseLayout>
```

- [ ] **Step 2: 安装 Tailwind  Typography 插件（可选）**

`@tailwindcss/typography` 已包含在初始依赖中，无需重复安装。`tailwind.config.mjs` 中已配置 `plugins: [typography]`。若文章渲染后样式异常，可在 `src/styles/global.css` 中补充针对 `article` 选择器的手动样式。

- [ ] **Step 3: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，每篇文章生成静态页面。

- [ ] **Step 4: Commit**

```bash
git add src/pages/posts/[slug].astro
git commit -m "feat: add post detail page with markdown rendering"
```

---

## Task 8: 分类总览页 /categories 与分类详情页 /categories/[type]

**Files:**
- Create: `src/pages/categories.astro`, `src/pages/categories/[type].astro`

**Interfaces:**
- Consumes: `resourceTypes`, `getResourceTypeCounts()`, `getPostsByType()`, `getResourcesByType()`（Task 3）。
- Produces: 分类总览和分类详情页面。

- [ ] **Step 1: 创建分类总览页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import { Icon } from 'astro-icon/components';
import { resourceTypes } from '@/data/site';
import { getResourceTypeCounts } from '@/utils/content';

const counts = await getResourceTypeCounts();
---

<BaseLayout title="分类" description="按资源类型浏览文章和下载">
  <section class="mx-auto max-w-7xl px-4 py-12">
    <h1 class="mb-8 text-3xl font-bold text-moon-50">分类浏览</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resourceTypes.map((type) => (
        <a href={`/categories/${type.id}`} class="glass-card group p-6 transition hover:-translate-y-1 hover:border-sky-bright/50">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-bright/10 text-sky-glow">
            <Icon name={type.icon} class="h-7 w-7" />
          </div>
          <h2 class="mb-2 text-xl font-semibold text-moon-50 group-hover:text-sky-glow">{type.name}</h2>
          <p class="mb-4 text-sm text-moon-300">{type.description}</p>
          <p class="text-sm text-moon-400">{counts[type.id] || 0} 个条目</p>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 创建分类详情页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import { Icon } from 'astro-icon/components';
import { resourceTypes, getResourceTypeById } from '@/data/site';
import { getPostsByType, getResourcesByType } from '@/utils/content';
import PostCard from '@/components/layout/PostCard.astro';
import ResourceCard from '@/components/layout/ResourceCard.astro';
import type { ResourceType } from '@/types';

export async function getStaticPaths() {
  return resourceTypes.map((type) => ({
    params: { type: type.id },
    props: { typeId: type.id },
  }));
}

const { typeId } = Astro.props;
const typeInfo = getResourceTypeById(typeId);
if (!typeInfo) {
  throw new Error(`Unknown resource type: ${typeId}`);
}

const posts = await getPostsByType(typeId as ResourceType);
const resources = await getResourcesByType(typeId as ResourceType);
---

<BaseLayout title={typeInfo.name} description={typeInfo.description}>
  <section class="mx-auto max-w-7xl px-4 py-12">
    <div class="mb-8 flex items-center gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-bright/10 text-sky-glow">
        <Icon name={typeInfo.icon} class="h-6 w-6" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-moon-50">{typeInfo.name}</h1>
        <p class="text-moon-300">{typeInfo.description}</p>
      </div>
    </div>

    {posts.length > 0 && (
      <div class="mb-12">
        <h2 class="mb-6 text-xl font-semibold text-moon-50">文章</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard post={post} />)}
        </div>
      </div>
    )}

    {resources.length > 0 && (
      <div>
        <h2 class="mb-6 text-xl font-semibold text-moon-50">资源</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => <ResourceCard resource={resource} />)}
        </div>
      </div>
    )}

    {posts.length === 0 && resources.length === 0 && (
      <p class="text-moon-300">该分类下暂无内容。</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 3: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，每个分类生成静态页面。

- [ ] **Step 4: Commit**

```bash
git add src/pages/categories.astro src/pages/categories/[type].astro
git commit -m "feat: add category overview and category detail pages"
```

---

## Task 9: 资源下载页 /resources

**Files:**
- Create: `src/pages/resources.astro`

**Interfaces:**
- Consumes: `getResources()`, `getResourceTypeCounts()`（Task 3），`ResourceCard`（Task 5）。
- Produces: 资源下载页。

- [ ] **Step 1: 创建资源页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import SearchBox from '@/components/ui/SearchBox.astro';
import ResourceCard from '@/components/layout/ResourceCard.astro';
import Pagination from '@/components/ui/Pagination.astro';
import { getResources, getResourceTypeCounts } from '@/utils/content';
import { resourceTypes, siteConfig } from '@/data/site';

const resources = await getResources();
const counts = await getResourceTypeCounts();

const url = new URL(Astro.request.url);
const currentType = url.searchParams.get('type') || 'all';
const currentPage = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));

const filteredResources = currentType === 'all'
  ? resources
  : resources.filter((r) => r.data.type === currentType);

const totalPages = Math.ceil(filteredResources.length / siteConfig.pageSize);
const paginatedResources = filteredResources.slice(
  (currentPage - 1) * siteConfig.pageSize,
  currentPage * siteConfig.pageSize
);
---

<BaseLayout title="资源下载" description="精选学习资源下载链接">
  <section class="mx-auto max-w-7xl px-4 py-12">
    <h1 class="mb-8 text-3xl font-bold text-moon-50">资源下载</h1>

    <div class="mb-6 flex flex-wrap gap-2">
      <a href="/resources" class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${currentType === 'all' ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700'}`}>
        全部 ({resources.length})
      </a>
      {resourceTypes.map((type) => (
        <a href={`/resources?type=${type.id}`} class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${currentType === type.id ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700'}`}>
          {type.name} ({counts[type.id] || 0})
        </a>
      ))}
    </div>

    <div class="mb-8">
      <SearchBox id="resource-search" placeholder="搜索资源标题、描述或标签..." />
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" id="resource-grid">
      {paginatedResources.map((resource) => (
        <div data-searchable={`${resource.data.title} ${resource.data.description} ${resource.data.tags.join(' ')}`}>
          <ResourceCard resource={resource} />
        </div>
      ))}
    </div>

    <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/resources?type=${currentType}`} />
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，资源页面生成正确。

- [ ] **Step 3: Commit**

```bash
git add src/pages/resources.astro
git commit -m "feat: add resources download page with filtering and pagination"
```

---

## Task 10: 关于页 /about 与 404 页

**Files:**
- Create: `src/pages/about.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `siteConfig`（Task 2）。
- Produces: 静态关于页和 404 页。

- [ ] **Step 1: 创建关于页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import { siteConfig } from '@/data/site';
---

<BaseLayout title="关于" description={`关于 ${siteConfig.title}`}>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-8 text-3xl font-bold text-moon-50">关于</h1>
    <div class="glass-card p-8 prose prose-invert max-w-none">
      <p>欢迎来到 <strong>{siteConfig.title}</strong>。</p>
      <p>这是一个个人学习资源聚合站，用于收集、整理和分享学习过程中遇到的有价值内容。</p>
      <h2 class="text-moon-50">站点内容</h2>
      <ul>
        <li><strong>原创文章：</strong> 个人学习笔记、技术总结与经验分享。</li>
        <li><strong>转载文章：</strong> 收集自网络优质内容，版权归原作者所有，点击阅读原文可查看出处。</li>
        <li><strong>资源下载：</strong> 提供软件、电子书、视频课程等下载链接，所有资源均托管在第三方平台。</li>
      </ul>
      <h2 class="text-moon-50">免责声明</h2>
      <p>本站所有转载内容与资源链接均来自互联网，仅供学习交流使用。如有侵权，请联系删除。</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 创建 404 页**

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
---

<BaseLayout title="页面未找到" description="404 Not Found">
  <section class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <div class="mb-6 text-8xl">🌙</div>
    <h1 class="mb-4 text-4xl font-bold text-moon-50">404</h1>
    <p class="mb-8 text-lg text-moon-300">这片星空下没有找到你要的页面。</p>
    <a href="/" class="rounded-full bg-sky-bright px-6 py-3 font-medium text-moon-900 transition hover:bg-sky-glow">
      返回首页
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 验证构建**

Run: `pnpm build`  
Expected: 构建成功，404 页面输出到 `dist/404.html`。

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro
git commit -m "feat: add about and 404 pages"
```

---

## Task 11: 集成 Pagefind 搜索

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/components/ui/PagefindSearch.astro`
- Modify: `src/components/layout/Navbar.astro`（添加搜索按钮）

**Interfaces:**
- Consumes: Pagefind 构建产物。
- Produces: 搜索弹窗/组件，可在任何页面调用。

- [ ] **Step 1: 安装 Pagefind 并更新配置**

Run: `pnpm add -D pagefind`  

修改 `astro.config.mjs`：

```javascript
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://example.com',
  build: {
    format: 'file',
  },
});
```

- [ ] **Step 2: 创建 PagefindSearch 组件**

```astro
<div class="relative">
  <button id="search-trigger" class="rounded-lg p-2 text-moon-200 transition hover:bg-moon-700/50 hover:text-sky-glow" aria-label="搜索">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  </button>
</div>

<dialog id="search-dialog" class="rounded-2xl bg-moon-800 p-0 text-moon-50 shadow-2xl backdrop:bg-black/50">
  <div class="w-[min(90vw,600px)] p-4">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">搜索</h2>
      <button id="search-close" class="rounded-lg p-1 text-moon-400 hover:text-moon-50">✕</button>
    </div>
    <div id="pagefind-search"></div>
  </div>
</dialog>

<script>
  import { PagefindUI } from '@pagefind/default-ui';

  const trigger = document.getElementById('search-trigger');
  const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null;
  const close = document.getElementById('search-close');

  if (trigger && dialog) {
    trigger.addEventListener('click', () => {
      dialog.showModal();
      if (!document.getElementById('pagefind-search')?.hasChildNodes()) {
        new PagefindUI({
          element: '#pagefind-search',
          showSubResults: true,
          showImages: false,
          translations: {
            placeholder: '搜索关键词...',
            zero_results: '没有找到结果',
            many_results: '找到 #count 个结果',
            one_result: '找到 1 个结果',
          },
        });
      }
    });
  }

  close?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
</script>

<style is:global>
  #pagefind-search .pagefind-ui__search-input {
    border-radius: 0.5rem;
    border: 1px solid #334155;
    background-color: #0f172a;
    padding: 0.5rem 1rem;
    color: #f8fafc;
  }
  #pagefind-search .pagefind-ui__search-input::placeholder {
    color: #94a3b8;
  }
  #pagefind-search .pagefind-ui__search-input:focus {
    border-color: #60a5fa;
    outline: none;
  }
  #pagefind-search .pagefind-ui__search-clear {
    color: #94a3b8;
  }
  #pagefind-search .pagefind-ui__result-link {
    color: #93c5fd;
  }
  #pagefind-search .pagefind-ui__result-excerpt {
    color: #94a3b8;
  }
</style>
```

- [ ] **Step 3: 安装 Pagefind 默认 UI**

Run: `pnpm add @pagefind/default-ui`  

- [ ] **Step 4: 更新构建脚本以索引 Pagefind**

修改 `package.json`：

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pnpm pagefind",
    "preview": "astro preview",
    "check": "astro check",
    "pagefind": "pagefind --site dist"
  }
}
```

- [ ] **Step 5: 在 Navbar 中加入搜索按钮**

修改 `src/components/layout/Navbar.astro`，在桌面端导航中加入：

```astro
import PagefindSearch from '@/components/ui/PagefindSearch.astro';

// ...
<div class="hidden items-center gap-8 md:flex">
  {siteConfig.navLinks.map((link) => (
    <a href={link.url} class="text-sm font-medium text-moon-200 transition hover:text-sky-glow">
      {link.name}
    </a>
  ))}
  <PagefindSearch />
  <ThemeToggle />
</div>
```

- [ ] **Step 6: 验证构建与搜索索引**

Run: `pnpm build`  
Expected: 构建成功，`dist/pagefind/` 目录生成搜索索引文件。

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs src/components src/pages
git commit -m "feat: integrate Pagefind search"
```

---

## Task 12: 最终验证、移动端优化与交付

**Files:**
- Modify: 根据验证结果微调样式与布局（如需）。

**Interfaces:**
- Consumes: 所有前面任务产物。
- Produces: 可部署的静态站点。

- [ ] **Step 1: 运行完整构建**

Run: `pnpm build`  
Expected: 构建成功，输出到 `dist/` 目录。

- [ ] **Step 2: 检查 dist 目录结构**

Run: `ls -R dist | head -100`  
Expected: 包含 `index.html`, `posts/`, `categories/`, `resources/`, `about/`, `404.html`, `pagefind/` 等。

- [ ] **Step 3: 运行预览服务器验证**

Run: `pnpm preview`  
Expected: 服务器启动，访问首页、文章列表、详情页、分类页、资源页、404 页均正常。

- [ ] **Step 4: 移动端检查**

- 在浏览器开发者工具中切换到移动端视图。
- 检查导航菜单可展开、卡片布局正常、搜索按钮可点击。
- 验证文字可读性和按钮可点击。

- [ ] **Step 5: 修复发现的问题**

如果存在布局问题、链接错误或构建警告，逐项修复并重新构建验证。

- [ ] **Step 6: 最终提交**

```bash
git add .
git commit -m "feat: complete mingyueqingfeng-house static site"
```

- [ ] **Step 7: 交付说明**

向用户报告：
- 项目已搭建完成，位置：`/home/myqfeng/Documents/Programs/前端/myqfeng-house/`。
- 运行 `pnpm dev` 启动开发服务器，`pnpm build` 构建静态站点。
- 构建产物在 `dist/` 目录，可部署到任意静态托管平台。
- 示例内容已放在 `src/content/posts/` 和 `src/content/resources/`，可替换为真实内容。

---

## 自我审查

### Spec 覆盖检查

| 设计文档需求 | 对应任务 |
|---|---|
| 暗夜明月风主题 | Task 2（全局样式 + 主题色） |
| Hero 横幅 + 分类入口 | Task 5 |
| 原创文章本地 Markdown | Task 3 + Task 7 |
| 转载文章可配置外链/本地页 | Task 3（schema） + Task 5/7（PostCard 与详情页） |
| 资源下载链接分享 | Task 3 + Task 5 + Task 9 |
| /posts 分类展示 + 搜索 + 分页 | Task 6 |
| /categories 与 /categories/[type] | Task 8 |
| Pagefind 搜索 | Task 11 |
| 响应式 + 移动端菜单 | Task 4 + Task 12 |
| 关于页 + 404 | Task 10 |

### Placeholder 扫描

- 无 TBD/TODO。
- 无 “implement later” 等模糊描述。
- 所有组件代码已给出完整实现示例。

### 类型一致性检查

- `ResourceType` 在 `src/types/index.ts` 中定义，并在 `src/content/config.ts` 与 `src/utils/content.ts` 中使用。
- `siteConfig.pageSize` 用于分页计算。
- `getResourceTypeById` 返回 `ResourceTypeInfo | undefined`。

### 风险说明

- Tailwind CSS 4 语法与 Tailwind CSS 3 不同，若某些插件（如 typography）不兼容，需回退到手动样式或安装对应版本。
- Pagefind 默认 UI 需要在构建后生成，开发模式下可能无法直接测试搜索功能，需运行 `pnpm build` 后再验证。
