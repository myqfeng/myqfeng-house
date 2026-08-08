# 全站动效丰富化设计

- 日期：2026-08-08
- 项目：myqfeng-house（Astro 5 静态站，暗色星空主题）
- 状态：已确认

## 背景

首页已具备丰富动效（星空粒子、Hero 逐字标题、滚动进度条、卡片悬停发光、噪声纹理），但其余页面（文章列表、文章详情、资源、关于、404）除全局 ScrollProgress 与 glass-card 悬停外几乎没有动画。本设计将首页动效体系扩展到全站，并保持内页安静、不干扰阅读。

## 目标

1. 全站统一星空背景，内页淡化（数量减半、更暗、无流星）
2. 所有内页标题改用公共 `PageHeader` 组件，带入场渐入动画
3. 列表页内容区块滚动进入视口时淡入显现（reveal）
4. 启用 Astro View Transitions，页面切换淡入淡出
5. 文章详情页头部信息（meta/标题/描述/tags）渐入

## 设计

### 1. 全站星空背景（内页淡化）

- `Starfield.astro` 增加 `dimmed?: boolean` prop：
  - `dimmed=false`（默认，首页 `full`）：现状不变——约 140 星、15% 大星光晕、25% 慢闪烁、多点流星（burst 1-3 / 2200ms）
  - `dimmed=true`（内页）：星星数量减半（按面积等比系数减半）、所有星星颜色整体调暗（亮度约 60%）、**不生成流星**
- 星空容器定位由 `absolute`（依赖 Hero 的 relative 祖先）改为 **`fixed` 全屏、z-index 0**，位于内容层之下、body 渐变背景之上；`pointer-events: none`；`prefers-reduced-motion` 仍静态画一帧
- `BaseLayout.astro` 新增 `starfield?: 'full' | 'dim'` prop（默认 `'dim'`），在 body 开头渲染 `<Starfield dimmed={starfield === 'dim'} />`；`index.astro` 传 `starfield="full"`
- `Hero.astro` 移除内部 `<Starfield />`（全站星空由 BaseLayout 统一提供，Hero 区域同样可见）

### 2. 公共 PageHeader 组件

- 新组件 `src/components/layout/PageHeader.astro`
- Props：
  - `title: string`（必填）
  - `eyebrow?: string`（小字标签，如「文章」上方的分类说明）
  - `description?: string`
  - `meta?: string`（如「教程文章 · 2026-08-01」）
  - `tags?: string[]`
  - `center?: boolean`（404 页居中变体）
- 动画：逐项 fade-up 渐入，时间序列 0.1s / 0.2s / 0.35s / 0.45s；完整支持 `prefers-reduced-motion`
- keyframes 公共化：`hero-fade-up`、`hero-char-up`、`hero-wire` 从 `Hero.astro` 迁移到 `src/styles/global.css`（Hero 与 PageHeader 共用，Hero 现有类名不变）
- 替换手写标题：
  - `posts.astro`：`<h1>文章</h1>` → `<PageHeader title="文章" />`
  - `resources.astro`：`<PageHeader title="资源下载" />`
  - `about.astro`：`<PageHeader title="关于" />`
  - `[slug].astro`：`<PageHeader title={...} description={...} meta={`${typeName} · ${date}`} tags={...} />`
  - `404.astro`：`<PageHeader title="页面未找到" center />`（保留 🌙 emoji，居中排版）

### 3. 内容滚动显现 reveal

- `global.css` 新增：
  - `.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s ease; transition-delay: var(--reveal-delay, 0ms); }`
  - `.reveal.visible { opacity: 1; transform: none; }`
  - `prefers-reduced-motion` 下 `.reveal { opacity: 1; transform: none; transition: none; }`
- `BaseLayout` 注入全局脚本（`<script is:inline>`）：IntersectionObserver 监听所有 `.reveal` 元素，进入视口（threshold 0.1，rootMargin 底部 40px）加 `.visible`；元素直接可见时不等待；观察器在脚本执行后自动处理已存在的元素
- 应用与 stagger：
  - `posts.astro`：分类卡片网格、文章条目容器加 `.reveal`，`style="--reveal-delay: {index * 60}ms"`
  - `resources.astro`：tag 按钮组、资源卡片网格加 `.reveal`（卡片 stagger 60ms）
  - 首页区块不加（用户未选择）
  - 列表页有客户端搜索/分页/筛选脚本：**筛选/搜索/翻页时新出现的条目需重新触发 reveal** —— 实现为：筛选/翻页后对网格内容做一次「重新观察」，或对隐藏项强制移除 `.visible` 再重新观察；简化方案：筛选/翻页操作时给网格容器临时移除并重加 `.reveal` 类，让 IntersectionObserver 重新触发（若页面顶部可见则立即显现）

### 4. 页面切换过渡（View Transitions，fade）

- `BaseLayout` head 引入 `<ViewTransitions />`
- 全局样式：`::view-transition-old(root)` / `::view-transition-new(root)` 动画约 0.3s 淡入淡出（覆盖 Astro 默认），沿用页面现有缓动
- 兼容性确认：
  - ScrollProgress：fixed 全局，VT 后新文档脚本重跑，正常
  - PagefindSearch：Navbar 内脚本随新文档重执行，`window.__openPagefindSearch` 重新绑定，正常
  - Starfield canvas：每页独立渲染，fade 过渡中旧层短暂保留可接受
  - 暗色固定主题（`html class="dark"`），无主题闪烁问题

### 5. 文章详情页增强

- `[slug].astro` 头部（meta 行 + h1 + description + tags 胶囊）整体替换为 `<PageHeader>`，随渐入序列依次显现
- 正文、返回按钮动效不在本次范围

## 改动文件清单

| 文件 | 改动 |
|---|---|
| `src/components/features/Starfield.astro` | 加 `dimmed` prop；定位改 fixed z-0 |
| `src/components/layout/BaseLayout.astro` | `starfield` prop；渲染 Starfield；`<ViewTransitions />`；reveal 脚本 |
| `src/components/layout/Hero.astro` | 移除 `<Starfield />` |
| `src/components/layout/PageHeader.astro` | 新建 |
| `src/styles/global.css` | keyframes 公共化；`.reveal`；View Transition 样式 |
| `src/pages/index.astro` | BaseLayout 传 `starfield="full"` |
| `src/pages/posts.astro` | PageHeader + reveal |
| `src/pages/posts/[slug].astro` | PageHeader |
| `src/pages/resources.astro` | PageHeader + reveal |
| `src/pages/about.astro` | PageHeader |
| `src/pages/404.astro` | PageHeader（center） |

## 验证

- `pnpm build`（7 页全部通过，Pagefind 索引正常）
- `pnpm check`（0 错误，9 条已知 hints 不变）
- 产物检查：dist 中星空 canvas 存在、`::view-transition` 样式存在、PageHeader 渐入类存在
