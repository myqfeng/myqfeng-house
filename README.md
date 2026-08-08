# 明月清风的小屋

一个以「暗夜明月」为视觉主题的个人学习资源聚合站，基于 **Astro 5 + Tailwind CSS 3 + TypeScript + Pagefind** 构建，纯静态输出。

- **原创/转载文章**：Markdown 编写，支持站内渲染或外链跳转
- **资源下载**：以链接形式分享（直链 / 网盘 / GitHub），本站不存储文件
- **分类体系**：文章按 6 类分类；资源不分类，只使用 tag 标签
- **全文搜索**：构建时生成 Pagefind 索引，支持中文搜索
- **主题**：暗夜明月风格，固定暗色

---

## 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [站点页面](#站点页面)
- [添加文章](#添加文章)
- [添加资源](#添加资源)
- [修改站点信息配置](#修改站点信息配置)
- [项目结构](#项目结构)
- [构建与部署](#构建与部署)

---

## 环境要求

- Node.js ≥ 22
- pnpm ≥ 9

```bash
pnpm install
```

## 本地开发

```bash
pnpm dev
```

启动后访问 `http://localhost:4321`。

常用命令：

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器（热更新） |
| `pnpm build` | 构建静态站点（含 Pagefind 搜索索引） |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | Astro 类型检查 |
| `pnpm new-post` | 交互式创建一篇新文章（自动填充日期、作者等） |
| `pnpm new-resource` | 交互式创建一个新资源（自动填充日期等） |

> 交互命令会依次询问标题、分类、标签、文件名等信息，日期与作者自动按当前时间/站点配置填充。生成的文件默认为草稿（`draft: true`），完成后将 `draft` 改为 `false` 再构建即可发布。

## 站点页面

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 | 全屏星空 Hero（粒子/流星动画）+ 站点标语 + 搜索入口 + 最新文章/资源 |
| `/posts` | 文章 | 顶部分类卡片（点击筛选）+ 搜索 + 文章列表 + 分页 |
| `/posts/文章名/` | 文章详情 | Markdown 正文渲染，原创/转载模式（含「阅读原文」按钮） |
| `/resources` | 资源 | 标签筛选（自动聚合）+ 搜索 + 下载链接卡片 |
| `/about` | 关于 | 站点介绍与免责声明 |
| 任意错误地址 | 404 | 暗夜星空主题 404 页 |

搜索框在导航栏右侧（🔍），基于 Pagefind 全文索引，支持中文。

---

## 添加文章

文章存放在 `src/content/posts/` 目录，每个文件是一篇 Markdown 文章（文件名即文章的 URL 标识，建议用英文小写连字符，如 `my-first-post.md`，访问路径为 `/posts/my-first-post/`）。

新建文件 `src/content/posts/my-first-post.md`：

```markdown
---
title: "我的第一篇文章"
description: "一段简短的摘要，会显示在文章卡片和详情页上。"
published: 2026-08-08
updated: 2026-08-09
author: "站长"
source: original
sourceUrl: ""
type: note
tags: ["学习", "笔记"]
draft: false
pinned: false
---

这里是文章正文，支持完整的 Markdown 语法：

## 标题

**加粗**、*斜体*、`行内代码`、[链接](https://example.com)

```js
console.log('代码块');
```
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题 |
| `description` | 推荐 | 摘要，不填则卡片显示为空 |
| `published` | ✅ | 发布日期（`YYYY-MM-DD`），用于排序 |
| `updated` | 可选 | 更新日期 |
| `author` | 可选 | 作者，默认「站长」 |
| `source` | ✅ | 来源：`original`（原创）/ `repost-local`（转载并在本站生成页面）/ `repost-external`（转载仅外链跳转） |
| `sourceUrl` | 转载必填 | 原文链接；`source` 为 `original` 时可留空 |
| `type` | ✅ | 分类，可选：`tutorial`（教程文章）/ `tool`（工具软件）/ `ebook`（电子书/PDF）/ `video`（视频课程）/ `note`（笔记资料）/ `opensource`（开源项目） |
| `tags` | 可选 | 标签数组，用于搜索与筛选 |
| `draft` | 可选 | `true` 时不生成页面 |
| `pinned` | 可选 | `true` 时置顶优先展示 |

### 三种来源模式

- **原创**（`source: original`）：正文在本站渲染，无原文链接。
- **本地转载**（`source: repost-local`）：正文在本站渲染，详情页顶部显示转载提示和「阅读原文」按钮。
- **外链转载**（`source: repost-external`）：正文可省略，卡片直接跳转到 `sourceUrl` 打开原文。

---

## 添加资源

资源存放在 `src/content/resources/` 目录，每个文件是一篇带下载链接的 Markdown。资源**不分类**，只使用 `tags` 标签。

新建文件 `src/content/resources/example-tool.md`：

```markdown
---
title: "示例工具"
description: "这个工具用来做什么，解决什么问题。"
published: 2026-08-08
downloadType: pan
url: "https://pan.example.com/s/abc123"
extractCode: "abcd"
source: "官方仓库"
tags: ["效率", "免费"]
draft: false
pinned: false
---
```

> 说明：资源只有 frontmatter 被使用（卡片展示、标签筛选、下载链接），Markdown 正文不会在站内渲染，可写可不写。

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 资源名称 |
| `description` | 推荐 | 简介，显示在资源卡片上 |
| `published` | ✅ | 发布日期，用于排序 |
| `downloadType` | ✅ | 下载方式：`link`（直链）/ `pan`（网盘）/ `github`（GitHub 仓库或 Release） |
| `url` | ✅ | 下载或项目链接 |
| `extractCode` | 可选 | 网盘提取码，有则在卡片上展示 |
| `source` | 可选 | 资源来源或作者 |
| `tags` | 推荐 | 标签数组。`/resources` 页面顶部的标签筛选会自动聚合所有资源的标签 |
| `draft` | 可选 | `true` 时不展示 |
| `pinned` | 可选 | `true` 时置顶优先展示 |

---

## 修改站点信息配置

站点级配置集中在 **`src/config/site.ts`**，修改后保存即可，无需改动其他代码。以下按区块说明可自定义项：

### 站点基本信息

```typescript
export const siteConfig: SiteConfig = {
  title: '明月清风的小屋',          // 站点标题（导航栏、页面标题、页脚）
  subtitle: '收集星光，分享知识',    // 首页 Hero 副标题
  description: '一个专注于学习资源收集与分享的个人站点……', // 站点描述（SEO）
  siteUrl: 'https://example.com',  // ⚠️ 部署前必须替换为你自己的域名
  author: '站长',
  pageSize: 12,                    // 文章/资源每页显示条数
  keywords: ['明月清风', '学习资源'], // SEO 关键词（<meta name="keywords">）
  favicon: ['/favicon.svg'],       // 网站图标，可放多个（多尺寸/多格式）
  announcement: '本站持续收录优质学习资源，欢迎收藏！', // 首页 Hero 顶部公告，留空不显示
};
```

### 导航栏 Logo（Header 图标）

```typescript
navbar: {
  logo: {
    type: 'icon',                  // 三种类型：icon（内联 SVG）/ emoji / image（图片路径）
    value: '<svg viewBox="0 0 24 24" ...>...</svg>',
    alt: '站点 Logo',
  },
},
```

- `emoji`：`{ type: 'emoji', value: '🌙' }`
- `image`：`{ type: 'image', value: '/logo.png', alt: 'Logo' }`（图片放在 `public/` 下）
- `icon`：`{ type: 'icon', value: '<svg>...</svg>' }`（内联 SVG 源码）

### 首页 Hero

```typescript
hero: {
  eyebrow: 'MYQFENG · LEARNING HUB', // Hero 眉题（小字标签），留空不显示
  buttons: [
    { label: '开始探索', url: '/posts', style: 'primary' }, // 主按钮（高亮发光）
    { label: '资源下载', url: '/resources', style: 'ghost' }, // 次按钮（描边）
  ],
},
```

### 社交链接（页脚）

```typescript
socialLinks: [
  { label: 'GitHub', url: 'https://github.com/' },
  { label: '邮箱', url: 'mailto:hello@example.com' },
],
```

### 页脚

```typescript
footer: {
  links: [{ label: '关于本站', url: '/about' }],  // 页脚链接组
  copyright: '明月清风，静谧求知。',              // 版权文案（自动拼上 © 年份 站点名）
},
```

页脚的自定义 HTML（备案号等）直接编辑 **`src/config/footer.html`** 文件，内容会原样注入页脚，支持完整 HTML 标签；文件仅含注释或空白时不显示。示例：

```html
<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">京ICP备XXXXXXXX号</a>
```

### 统计代码（可选）

```typescript
analytics: {
  head: '<script>...百度统计/谷歌分析代码...</script>', // 注入 <head>
  body: '',                                            // 注入 <body> 开头
},
```

### 导航菜单

增删 `navLinks` 数组中的项即可，例如添加「友链」：

```typescript
navLinks: [
  { name: '首页', url: '/' },
  { name: '文章', url: '/posts' },
  { name: '资源', url: '/resources' },
  { name: '友链', url: '/friends' },  // 需要你自己创建对应的页面
  { name: '关于', url: '/about' },
],
```

### 修改分类体系

`postTypes` 数组定义了文章的全部分类（`id` 与文章 frontmatter 中的 `type` 对应）。**资源不参与分类，仅通过 `tags` 标签组织。** 增删文章分类后请同步修改 `src/content.config.ts` 中 posts 集合的 `type` 枚举，并重新运行 `pnpm dev` / `pnpm build`。

### 关于页内容

「关于」页面内容在 **`src/content/spec/about.md`** 中，站点介绍、免责声明等文案直接编辑该 Markdown 文件（支持标题、列表、加粗、链接等完整 Markdown 语法），保存后重新构建即可生效。

### 评论系统（Artalk / Giscus）

评论系统在 **`src/config/commentConfig.ts`** 中配置，支持 Artalk 与 Giscus（GitHub Discussions）两种，`type` 改为 `'none'` 可关闭。

**Artalk**（默认启用，需自建后端）：
1. 按官方文档部署 Artalk 服务端（Docker：`docker run -d -p 8080:23366 -v ~/.artalk-data:/data artalk/artalk-go`）
2. 将 `artalk.server` 改为你的后端地址，例如 `'https://artalk.example.com/'`（注意结尾 `/`）

**Giscus**（基于 GitHub Discussions，无需后端）：
1. 在 GitHub 仓库开启 Discussions 功能
2. 打开 https://giscus.app ，填入仓库名生成配置
3. 将生成的 `repo`、`repoId`、`category`、`categoryId` 填入 `giscus` 段，并把 `type` 改为 `'giscus'`

评论展示范围：全部文章详情页底部 + 留言板页（`/guestbook`，内容在 `src/content/spec/guestbook.md`）。

### 修改主题色 / 样式

- 主题色板（moon 蓝灰、sky 月光蓝）：`tailwind.config.mjs`
- 全局主题变量（背景、卡片、文字、强调色）：`src/styles/global.css`

---

## 项目结构

```
├── scripts/                # pnpm new-post / new-resource 脚手架脚本
├── src/
│   ├── components/         # 组件
│   │   ├── layout/         #   布局类（Navbar、Footer、Hero、卡片、BaseLayout）
│   │   ├── comment/        #   评论系统（Comment 入口、Artalk、Giscus）
│   │   ├── ui/             #   基础组件（SearchBox、Pagination、PagefindSearch）
│   │   └── widgets/        #   组合组件（CategoryGrid、PostList）
│   ├── config/
│   │   ├── site.ts         # ⭐ 站点配置（标题、导航、文章分类）——日常改这里
│   │   └── commentConfig.ts# 评论系统配置（Artalk / Giscus）
│   ├── content/
│   │   ├── posts/          # ⭐ 文章 Markdown（每天发文章写这里）
│   │   ├── resources/      # ⭐ 资源 Markdown（每天发资源写这里）
│   │   └── spec/           # 页面内容（about.md、guestbook.md）
│   ├── content.config.ts   # 内容 schema 校验（文章分类 type 枚举也在这里）
│   ├── pages/              # 路由页面（index / posts / resources / about / guestbook / 404）
│   ├── styles/             # 全局样式与主题变量
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 内容获取与格式化工具
├── astro.config.mjs        # Astro 配置（静态输出、站点 URL、Pagefind）
├── tailwind.config.mjs     # Tailwind 主题色板
└── package.json
```

带 ⭐ 的是日常使用最多的文件。

---

## 构建与部署

```bash
pnpm build
```

产物输出到 `dist/` 目录，包含 `dist/pagefind/` 搜索索引。这是一个纯静态站点，可部署到任意静态托管平台（GitHub Pages、Vercel、Cloudflare Pages、Nginx 等）。

部署前请确认：

1. **`src/config/site.ts` 中的 `siteUrl` 已替换为你的真实域名**（影响 SEO 与 Pagefind 索引）。
2. `pnpm build` 构建成功且 `dist/pagefind/` 目录已生成。
3. 若部署在子路径下（如 GitHub Pages 的 `https://user.github.io/repo/`），需要在 `astro.config.mjs` 中设置 `base` 配置。
