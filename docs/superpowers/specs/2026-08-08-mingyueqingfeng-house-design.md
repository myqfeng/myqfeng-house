# 明月清风的小屋 — 设计文档

> 创建日期：2026-08-08  
> 项目类型：Astro 静态学习资源聚合站  
> 参考风格：Firefly（Astro 博客主题）——仅参考其清新卡片式、响应式、配置驱动的风格，不直接套用模板源码。

---

## 1. 项目定位

一个以**暗夜明月/星空**为视觉主题的个人**学习资源聚合站**。

- 核心用途：收集和整理学习资源（原创文章 + 转载文章 + 下载链接），方便自己和他人查找。
- 内容形式：
  - **原创文章**：本地 Markdown 编写，在站内生成完整详情页。
  - **转载文章**：可配置为“外链卡片”（点击跳转原文）或“本地摘要页”（站内展示摘要并附原文链接）。
  - **资源下载**：以链接分享形式呈现（网盘、GitHub Release、直链等），不在本站存储实际文件。
- 分类维度：按**资源类型**组织，包括：教程文章、工具软件、电子书/PDF、视频课程、笔记资料、开源项目。

---

## 2. 页面结构与路由

| 路由 | 页面名称 | 说明 |
|------|----------|------|
| `/` | 首页 | 星空 Hero + 站点标题/副标题 + 搜索框 + 资源类型分类入口 + 最新推荐条目 |
| `/posts` | 文章列表 | 所有文章（原创 + 本地转载）的卡片流，支持按资源类型分类展示、标签筛选、搜索、分页 |
| `/posts/[slug]` | 文章详情 | Markdown 渲染页，原创展示全文；转载展示摘要并附“阅读原文”按钮 |
| `/categories` | 分类总览 | 按资源类型聚合，每个分类展示该类型下的文章与资源数量 |
| `/categories/[type]` | 分类详情 | 单个资源类型下的全部条目列表 |
| `/resources` | 资源下载页 | 突出下载链接的页面，适合以“链接分享”为主的资源 |
| `/about` | 关于 | 站点介绍、使用说明、转载声明、联系方式 |
| `/404` | 404 页面 | 暗夜星空主题错误页 |

### 2.1 `/posts` 分类展示说明

`/posts` 页面不仅是文章流，也是**分类展示页**：
- 顶部显示全部资源类型（教程文章、工具软件、电子书/PDF、视频课程、笔记资料、开源项目）作为筛选标签/分类入口。
- 默认展示全部文章；点击某个分类后只展示该分类下文章。
- 每个分类卡片显示该分类下的文章数量。
- 支持搜索框实时过滤（按标题、描述、标签）。
- 支持分页，每页条数可配置（默认 12 条）。

---

## 3. 技术栈

- **框架**：Astro 5（静态站点生成，内容优先）
- **样式**：Tailwind CSS 4 + 自定义 CSS 变量主题
- **语言**：TypeScript
- **内容管理**：Astro Content Collections（`src/content/`）
- **搜索**：Pagefind（静态构建后生成索引）
- **图标**：Astro Icon（Iconify）
- **部署**：静态输出（`output: 'static'`），可部署到任意静态托管平台

---

## 4. 数据模型

### 4.1 文章集合 `src/content/posts/`

```yaml
---
title: "文章标题"
description: "简短摘要"
published: 2026-08-08
updated: 2026-08-09
author: "站长"
# 来源：original（原创）、repost-local（本地转载页）、repost-external（外链卡片）
source: "original"
sourceUrl: "https://example.com/original"  # 转载时必填，用于“阅读原文”
type: "tutorial"  # 资源类型：tutorial / tool / ebook / video / note / opensource
tags: ["Astro", "前端"]
draft: false
pinned: false
---
```

### 4.2 资源集合 `src/content/resources/`

```yaml
---
title: "资源名称"
description: "资源简介"
published: 2026-08-08
type: "tool"  # 同文章 type
# 下载方式：link（外链）、pan（网盘，可配提取码）、github（GitHub Release）
downloadType: "link"
url: "https://example.com/download"
extractCode: "abcd"  # 网盘提取码，可选
source: "官方仓库"
tags: ["效率工具"]
pinned: false
---
```

### 4.3 类型枚举

统一的资源类型：

| 类型值 | 中文名称 | 图标建议 |
|--------|----------|----------|
| `tutorial` | 教程文章 | book-open / graduation-cap |
| `tool` | 工具软件 | wrench / hammer |
| `ebook` | 电子书/PDF | book / file-text |
| `video` | 视频课程 | play-circle / film |
| `note` | 笔记资料 | notebook / sticky-note |
| `opensource` | 开源项目 | code / github |

---

## 5. 视觉与交互设计

### 5.1 主题风格

- **名称**：暗夜明月风
- **主色调**：
  - 背景：深蓝到靛蓝渐变（`#0f172a` → `#1e293b`），带 subtle 星空噪点或渐变
  - 文字：银白/月白（`#f8fafc`），次要文字灰蓝（`#94a3b8`）
  - 强调色：月蓝/冰蓝（`#60a5fa` / `#93c5fd`），悬停时稍亮
  - 卡片背景：半透明深蓝玻璃态（`rgba(30, 41, 59, 0.7)`）+ 轻微模糊
- **默认模式**：暗色优先，同时提供亮/暗/跟随系统切换按钮
- **字体**：系统字体栈优先，中文使用 `"PingFang SC", "Microsoft YaHei", sans-serif`

### 5.2 布局参考

参考 Firefly 的以下特点，但自行实现：
- 顶部固定导航栏，左侧 Logo + 站点名，右侧导航链接 + 主题切换
- 圆角卡片（`rounded-2xl`）、柔和阴影、hover 时轻微上浮
- 分类入口卡片使用大图标 + 类型名称 + 数量
- 文章卡片包含：封面图（可选）、标题、摘要、类型标签、发布日期、标签
- 响应式：移动端汉堡菜单、单列卡片、底部导航简化

### 5.3 动效

- Hero 区：静态星空渐变背景，可选 subtle 的微光/粒子动画（CSS 或轻量 Canvas，避免性能开销）
- 卡片 hover：上浮 + 边框高亮
- 页面切换：Astro 原生导航，暂不做复杂 Swup 过渡
- 搜索：输入时即时过滤，Pagefind 提供全文搜索弹窗/页面

---

## 6. 功能模块

### 6.1 首页
- 全屏或半屏 Hero，展示站点名“明月清风的小屋” + 副标题
- 搜索框（快速跳转到 `/posts` 或触发 Pagefind）
- 6 个资源类型分类入口卡片（每个显示图标、名称、条目数量）
- 最新/置顶文章/资源卡片列表（取 6 条）

### 6.2 文章列表 `/posts`
- 分类筛选栏（全部 + 6 个类型）
- 搜索框
- 标签云（可选）
- 卡片流 + 分页
- 支持按时间倒序、按置顶优先

### 6.3 文章详情 `/posts/[slug]`
- 渲染 Markdown 正文
- 顶部：标题、日期、类型标签、标签、作者/来源
- 转载文章：醒目提示“本文为转载”，显示“阅读原文”按钮
- 底部：返回列表、上一篇/下一篇导航

### 6.4 资源下载 `/resources`
- 资源卡片列表，突出显示下载按钮
- 根据 `downloadType` 显示不同按钮文案：
  - `link`：外部下载
  - `pan`：网盘链接 + 提取码（可复制）
  - `github`：GitHub 仓库/Release
- 点击下载按钮直接跳转，复制提取码功能

### 6.5 分类总览 `/categories`
- 展示 6 个资源类型卡片
- 每个卡片显示该类型下文章数 + 资源数 + 最近更新条目

### 6.6 搜索
- 集成 Pagefind：构建时自动索引所有页面
- 提供搜索输入框和结果弹窗
- 搜索结果按标题、摘要高亮匹配内容

### 6.7 主题切换
- 导航栏右侧提供亮/暗/跟随系统切换
- 使用 Tailwind CSS `dark:` 前缀 + CSS 变量实现
- 用户偏好持久化到 `localStorage`

---

## 7. 项目目录结构

```
myqfeng-house/
├── public/
│   ├── favicon.svg
│   └── fonts/              # 可选本地字体
├── src/
│   ├── components/         # 可复用组件
│   │   ├── layout/         # 布局组件（Navbar, Footer, Hero, PostCard, ResourceCard）
│   │   ├── ui/             # 基础 UI（Button, Badge, Tag, SearchBox）
│   │   └── widgets/        # 复杂组件（ThemeToggle, CategoryGrid, Pagination）
│   ├── content/
│   │   ├── config.ts       # Content Collections 定义
│   │   ├── posts/          # 文章 Markdown
│   │   └── resources/      # 资源 Markdown
│   ├── data/
│   │   └── site.ts         # 站点配置（标题、副标题、导航、主题色等）
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
│       ├── content.ts      # 内容获取/过滤工具
│       └── format.ts       # 日期格式化等
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 8. 非功能性要求

- **静态为主**：`output: 'static'`，所有页面构建时生成。
- **SEO**：每页设置 `<title>`、`<meta description>`、Open Graph 基础标签。
- **性能**：图片懒加载、代码分割、尽量减少客户端 JS。
- **可维护性**：所有站点配置集中在 `src/data/site.ts`，内容元数据通过 `src/content/config.ts` 校验。
- **可访问性**：键盘可导航、语义化标签、 adequate 颜色对比度。

---

## 9. 后续实现顺序

1. 初始化 Astro 项目 + Tailwind CSS + TypeScript + Pagefind。
2. 搭建基础布局（BaseLayout、Navbar、Footer、ThemeToggle）。
3. 定义 Content Collections（posts + resources）和示例数据。
4. 实现首页 Hero + 分类入口 + 最新推荐。
5. 实现 `/posts` 列表页（分类筛选、搜索、分页）。
6. 实现 `/posts/[slug]` 文章详情页（原创 + 转载）。
7. 实现 `/categories` 和 `/categories/[type]` 分类页。
8. 实现 `/resources` 资源下载页。
9. 实现 `/about` 和 `/404`。
10. 集成 Pagefind 搜索并优化移动端。
11. 构建、验证、交付。

---

## 10. 关键决策记录

- **分类维度**：按资源类型（教程/工具/电子书/视频/笔记/开源）统一文章和资源的分类，避免两套分类体系复杂化。
- **转载模式**：通过 `source` 字段支持 `original`、`repost-local`、`repost-external`，单篇可配置，灵活可控。
- **下载方式**：资源以 YAML frontmatter 描述 + 外部链接跳转，不存储文件，符合“静态为主”和版权/容量要求。
- **视觉风格**：暗夜明月风，默认暗色，参考 Firefly 的卡片式与玻璃态，但不复制其复杂配置和特效。
