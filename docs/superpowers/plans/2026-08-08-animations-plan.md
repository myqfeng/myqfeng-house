# 全站动效丰富化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页动效体系（星空、标题入场、滚动显现、页面过渡）扩展到其余页面，内页星空淡化。

**Architecture:** Starfield 从 Hero 提升到 BaseLayout 全站背景层（fixed z-0，内容之下）；公共 keyframes 与 `.reveal` 样式落入 global.css；新增公共 PageHeader 组件统一内页标题；启用 Astro View Transitions 淡入淡出。

**Tech Stack:** Astro 5（astro:transitions 内置）、Tailwind CSS 3、原生 Canvas + IntersectionObserver

## Global Constraints

- 项目无测试框架，验证手段为 `pnpm build`（期望 7 page(s) built、无 error）与 `pnpm check`（期望 0 error、9 条已知 hints 不变）
- 不新增依赖；不改动已提交的 site.ts 配置结构与 types
- `prefers-reduced-motion: reduce` 必须完整覆盖所有新动画
- 中文文案与现有风格一致；不添加代码注释（保持项目惯例）
- 所有路径使用 `@/` 别名或相对路径（与现有文件一致）
- 提交信息风格：`feat: ...` / `refactor: ...`

---

### Task 1: global.css 公共 keyframes、reveal 样式、View Transition 样式

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: 全局 keyframes `fade-up`（opacity 0 + translateY(16px) → 1/0）、`char-up`（translateY(110%) → 0）、`wire`（top: -40% → 110%）；类 `.reveal` / `.reveal-visible`；`::view-transition-old(root)` / `new(root)` 动画；reduced-motion 覆盖。Task 2 的 Hero.astro 将引用同名 keyframes，Task 3 的 BaseLayout 注入 reveal 脚本，Task 6 使用 `.reveal` 类。

- [ ] **Step 1: 在 global.css 追加公共动画样式**

在 `src/styles/global.css` 文件末尾（现有 `@media (prefers-reduced-motion: reduce)` 块之后）追加：

```css
@layer base {
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes char-up {
    to { transform: translateY(0); }
  }

  @keyframes wire {
    to { top: 110%; }
  }

  ::view-transition-old(root) {
    animation: view-fade-out 0.3s ease forwards;
  }

  ::view-transition-new(root) {
    animation: view-fade-in 0.3s ease forwards;
  }

  @keyframes view-fade-out {
    to { opacity: 0; }
  }

  @keyframes view-fade-in {
    from { opacity: 0; }
  }

  .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
    transition-delay: var(--reveal-delay, 0ms);
  }

  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }

  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: 构建验证**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error 行，`7 page(s) built`、`Complete!`

- [ ] **Step 3: 提交**

```bash
git add src/styles/global.css
git commit -m "feat: add shared animation keyframes and reveal styles"
```

---

### Task 2: Starfield dimmed 模式与全屏 fixed 定位

**Files:**
- Modify: `src/components/features/Starfield.astro`

**Interfaces:**
- Consumes: 无（自包含组件）
- Produces: `Starfield` 组件新增 prop `dimmed?: boolean`（默认 false）。`dimmed=true` 时：星星数量减半、亮度调暗、不生成流星。容器 CSS 改为 `position: fixed; z-index: 0`（全屏背景层，内容之下）。Task 3 的 BaseLayout 将以 `<Starfield dimmed={starfield === 'dim'} />` 方式使用。

- [ ] **Step 1: 修改 Props 与组件内部逻辑**

在 `src/components/features/Starfield.astro` frontmatter 中修改（第 1-8 行）：

```astro
---
interface Props {
  starCount?: number;
  meteorInterval?: number;
  meteorBurst?: number;
  dimmed?: boolean;
}

const { starCount = 140, meteorInterval = 2200, meteorBurst = 3, dimmed = false } = Astro.props;
---
```

将 `<script is:inline define:vars={{ starCount, meteorInterval, meteorBurst }}>` 改为：

```html
<script is:inline define:vars={{ starCount, meteorInterval, meteorBurst, dimmed }}>
```

在脚本中 `const rand = (min, max) => min + Math.random() * (max - min);` 行之后新增一行：

```js
    const dimFactor = dimmed ? 0.5 : 1;
```

将 `initStars()` 中星星数量公式（第 46 行）改为：

```js
      const count = Math.floor((starCount * dimFactor * width * height) / (1920 * 1080)) + 80;
```

将 `initStars()` 中 `opacity` 行（第 58 行）改为：

```js
        opacity: dimmed ? rand(0.25, 0.5) : rand(0.55, 1),
```

将 `drawStars()` 中两处 glow 光晕 alpha（第 91、93 行）改为：

```js
          glow.addColorStop(0, `hsla(${star.hue}, 90%, 82%, ${0.18 * alpha})`);
```

```js
          glow.addColorStop(0, `rgba(248, 250, 252, ${0.18 * alpha})`);
```

（即光晕 alpha 由 0.35 改为 0.18，dimmed 与 full 模式统一减半，保证内页更安静）

将 `frame()` 函数（第 133-144 行）改为：

```js
    function frame(t) {
      ctx.clearRect(0, 0, width, height);
      drawStars(t);
      if (!reducedMotion && !dimmed) {
        if (t - lastMeteorAt > meteorInterval) {
          lastMeteorAt = t;
          spawnMeteors();
        }
        drawMeteors(16.7);
      }
      raf = requestAnimationFrame(frame);
    }
```

- [ ] **Step 2: 修改容器 CSS 为 fixed 全屏**

将 `<style is:global>` 中 `.starfield` 规则（第 162-167 行）改为：

```css
  .starfield {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .starfield canvas {
    display: block;
  }
```

- [ ] **Step 3: 构建验证**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，7 页构建成功。

- [ ] **Step 4: 提交**

```bash
git add src/components/features/Starfield.astro
git commit -m "feat: add dimmed mode and fixed positioning to starfield"
```

---

### Task 3: BaseLayout 集成（starfield prop、ViewTransitions、reveal 脚本）+ Hero 清理 + 首页传参

**Files:**
- Modify: `src/components/layout/BaseLayout.astro`
- Modify: `src/components/layout/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Task 2 的 `<Starfield dimmed />`；Task 1 的 `.reveal` / `::view-transition` 样式；`astro:transitions` 的 `<ViewTransitions />`
- Produces: `BaseLayout` 新增 prop `starfield?: 'full' | 'dim'`（默认 `'dim'`）。Hero.astro 移除 Starfield 引用、keyframes 改引公共名 `fade-up` / `char-up` / `wire`。index.astro 传 `starfield="full"`。

- [ ] **Step 1: BaseLayout 增加 starfield prop 与 Starfield 渲染**

修改 `src/components/layout/BaseLayout.astro` frontmatter（第 1-20 行）：

```astro
---
import '@/styles/global.css';
import { ViewTransitions } from 'astro:transitions';
import Navbar from '@/components/layout/Navbar.astro';
import Footer from '@/components/layout/Footer.astro';
import ScrollProgress from '@/components/features/ScrollProgress.astro';
import Starfield from '@/components/features/Starfield.astro';
import { siteConfig } from '@/config/site';

interface Props {
  title?: string;
  description?: string;
  pagefindIgnore?: boolean;
  starfield?: 'full' | 'dim';
}

const { title, description, pagefindIgnore = false, starfield = 'dim' } = Astro.props;
```

- [ ] **Step 2: BaseLayout head 加 ViewTransitions、body 加 Starfield 与 reveal 脚本**

head 中 `<meta name="keywords" ...>` 行之后插入：

```html
    <ViewTransitions />
```

body 中 `<ScrollProgress />` 之前插入：

```html
    <Starfield dimmed={starfield === 'dim'} />
```

body 中 `</body>` 之前（`<Footer />` 之后）插入：

```html
    <script is:inline>
      (() => {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          els.forEach((el) => el.classList.add('reveal-visible'));
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                io.unobserve(entry.target);
              }
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px 40px 0px' },
        );
        els.forEach((el) => io.observe(el));
      })();
    </script>
```

- [ ] **Step 3: Hero 移除 Starfield 并更新 keyframes 引用**

`src/components/layout/Hero.astro`：
1. 删除 frontmatter 第 3 行 `import Starfield from '@/components/features/Starfield.astro';`
2. 删除模板第 15 行 `<Starfield />`
3. `<style is:global>` 中所有 `hero-fade-up` 替换为 `fade-up`、`hero-char-up` 替换为 `char-up`、`hero-wire` 替换为 `wire`（仅替换 `animation:` 与 `@keyframes` 声明中的名字；`.hero-*` 类名保持不变）
4. 删除本组件内 3 个本地 `@keyframes` 定义（`hero-char-up`、`hero-fade-up`、`hero-wire` 块），keyframes 现由 global.css 提供
5. 将 Hero 渐变遮罩透明度降低（星空现位于内容层之下，会被遮罩压暗），第 17 行改为：

```html
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(147,197,253,0.08),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.22),rgba(2,6,23,0.55))]" aria-hidden="true"></div>
```

- [ ] **Step 4: 首页传 full 星空**

`src/pages/index.astro` 第 14 行 `<BaseLayout>` 改为：

```astro
<BaseLayout starfield="full">
```

- [ ] **Step 5: 构建验证与产物检查**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，7 页构建成功。

Run: `grep -c "starfield" dist/index.html dist/posts/index.html && grep -c "view-transition-old" dist/index.html && grep -c "reveal-visible" dist/index.html`
Expected: 首页与文章页各含 starfield 容器；首页含 view-transition 样式与 reveal 脚本。

- [ ] **Step 6: 类型检查**

Run: `pnpm check 2>&1 | tail -3`
Expected: `0 errors`、`9 hints`（hints 数量不变）。

- [ ] **Step 7: 提交**

```bash
git add src/components/layout/BaseLayout.astro src/components/layout/Hero.astro src/pages/index.astro
git commit -m "feat: add global starfield, view transitions and reveal observer to layout"
```

---

### Task 4: PageHeader 组件

**Files:**
- Create: `src/components/layout/PageHeader.astro`

**Interfaces:**
- Consumes: Task 1 的公共 keyframes `fade-up`
- Produces: `PageHeader` 组件，props：`title: string`（必填）、`description?: string`、`eyebrow?: string`、`meta?: string`、`tags?: string[]`、`center?: boolean`（默认 false）。渐入序列：eyebrow 0.1s → title 0.2s → description/meta 0.35s → tags 0.45s。Task 5 的 5 个页面使用。

- [ ] **Step 1: 创建组件文件**

创建 `src/components/layout/PageHeader.astro`：

```astro
---
interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: string;
  tags?: string[];
  center?: boolean;
}

const { title, description, eyebrow, meta, tags = [], center = false } = Astro.props;
---

<header class={`page-header ${center ? 'items-center text-center' : ''} mb-10`}>
  {eyebrow && (
    <p class="page-header-eyebrow mb-3 font-mono text-xs tracking-[0.3em] text-sky-glow">
      {eyebrow}
    </p>
  )}
  <h1 class="page-header-title text-3xl font-bold text-moon-50 md:text-4xl">{title}</h1>
  {description && <p class="page-header-desc mt-3 text-lg text-moon-300">{description}</p>}
  {meta && <p class="page-header-meta mt-3 text-sm text-sky-glow">{meta}</p>}
  {tags.length > 0 && (
    <div class="page-header-tags mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span class="rounded-full bg-moon-800 px-3 py-1 text-xs text-moon-300">{tag}</span>
      ))}
    </div>
  )}
</header>

<style is:global>
  .page-header {
    display: flex;
    flex-direction: column;
  }
  .page-header-eyebrow {
    opacity: 0;
    animation: fade-up 0.7s 0.1s forwards;
  }
  .page-header-title {
    opacity: 0;
    animation: fade-up 0.8s 0.2s forwards;
  }
  .page-header-desc,
  .page-header-meta {
    opacity: 0;
    animation: fade-up 0.8s 0.35s forwards;
  }
  .page-header-tags {
    opacity: 0;
    animation: fade-up 0.8s 0.45s forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .page-header-eyebrow,
    .page-header-title,
    .page-header-desc,
    .page-header-meta,
    .page-header-tags {
      opacity: 1;
      animation: none;
    }
  }
</style>
```

- [ ] **Step 2: 构建验证**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，7 页构建成功（此时组件尚未被引用，仅为编译检查）。

- [ ] **Step 3: 提交**

```bash
git add src/components/layout/PageHeader.astro
git commit -m "feat: add PageHeader component with staggered entrance animation"
```

---

### Task 5: 五个页面应用 PageHeader

**Files:**
- Modify: `src/pages/posts.astro`
- Modify: `src/pages/posts/[slug].astro`
- Modify: `src/pages/resources.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/404.astro`

**Interfaces:**
- Consumes: Task 4 的 `<PageHeader />`
- Produces: 各页面手写 h1 标题区替换为 PageHeader；`[slug].astro` 头部 meta 行并入 PageHeader 的 `meta`/`tags` props。

- [ ] **Step 1: posts.astro 替换标题**

`src/pages/posts.astro` frontmatter 加 import（第 2 行 BaseLayout import 之后）：

```astro
import PageHeader from '@/components/layout/PageHeader.astro';
```

模板中第 25 行 `<h1 class="mb-8 text-3xl font-bold text-moon-50">文章</h1>` 替换为：

```astro
    <PageHeader title="文章" />
```

- [ ] **Step 2: resources.astro 替换标题**

`src/pages/resources.astro` frontmatter 加 import：

```astro
import PageHeader from '@/components/layout/PageHeader.astro';
```

模板中第 14 行 `<h1 class="mb-8 text-3xl font-bold text-moon-50">资源下载</h1>` 替换为：

```astro
    <PageHeader title="资源下载" />
```

- [ ] **Step 3: about.astro 替换标题**

`src/pages/about.astro` frontmatter 加 import：

```astro
import PageHeader from '@/components/layout/PageHeader.astro';
```

模板中第 8 行 `<h1 class="mb-8 text-3xl font-bold text-moon-50">关于</h1>` 替换为：

```astro
    <PageHeader title="关于" />
```

- [ ] **Step 4: 404.astro 替换标题**

`src/pages/404.astro` frontmatter 加 import：

```astro
import PageHeader from '@/components/layout/PageHeader.astro';
```

模板中第 7-8 行替换为：

```astro
    <div class="page-404-emoji mb-6 text-8xl">🌙</div>
    <PageHeader title="404" center />
```

并在文件末尾追加样式块：

```astro
<style is:global>
  .page-404-emoji {
    opacity: 0;
    animation: fade-up 0.8s 0.1s forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .page-404-emoji {
      opacity: 1;
      animation: none;
    }
  }
</style>
```

- [ ] **Step 5: [slug].astro 头部替换为 PageHeader**

`src/pages/posts/[slug].astro` frontmatter 加 import：

```astro
import PageHeader from '@/components/layout/PageHeader.astro';
```

在 `const typeInfo = getPostTypeById(post.data.type);` 之后新增一行：

```astro
const metaText = typeInfo ? `${typeInfo.name} · ${formatDate(post.data.published)}` : formatDate(post.data.published);
```

模板中第 22-37 行 `<header class="mb-8">...</header>` 整块替换为：

```astro
    <PageHeader title={post.data.title} description={post.data.description} meta={metaText} tags={post.data.tags} />
```

- [ ] **Step 6: 构建验证与产物检查**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，7 页构建成功。

Run: `grep -c "page-header-title" dist/posts/index.html dist/resources/index.html dist/about/index.html dist/404.html dist/posts/*.html | head -8`
Expected: 每个文件至少 1 处 `page-header-title`。

- [ ] **Step 7: 类型检查**

Run: `pnpm check 2>&1 | tail -3`
Expected: `0 errors`、9 hints。

- [ ] **Step 8: 提交**

```bash
git add src/pages/posts.astro "src/pages/posts/[slug].astro" src/pages/resources.astro src/pages/about.astro src/pages/404.astro
git commit -m "feat: use PageHeader on all inner pages"
```

---

### Task 6: reveal 滚动显现应用到文章/资源列表

**Files:**
- Modify: `src/pages/posts.astro`
- Modify: `src/components/widgets/PostList.astro`
- Modify: `src/pages/resources.astro`

**Interfaces:**
- Consumes: Task 1 的 `.reveal` / `.reveal-visible` 与 Task 3 注入的 IntersectionObserver 脚本；Task 5 已引入 PageHeader
- Produces: posts 分类卡片与文章条目、resources 标签按钮组与资源卡片获得 reveal 渐入；stagger 延迟通过内联 `--reveal-delay` 控制。筛选/搜索/翻页无需额外代码：display 从 none 恢复的条目会被 IntersectionObserver 自动重新计算相交状态（隐藏条目 display:none 不触发，重新显示且在视口内立即加 `reveal-visible`）。

- [ ] **Step 1: posts.astro 分类卡片加 reveal 与 stagger**

`src/pages/posts.astro` 第 27-41 行的分类卡片容器改为（外层 div 加 reveal，卡片内容不变）：

```astro
    <div class="reveal mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" style="--reveal-delay: 0ms">
      <a href="/posts" data-type-filter="all" class="glass-card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1 hover:border-sky-bright/50">
        <span class="text-lg font-semibold text-moon-50 group-hover:text-sky-glow">全部</span>
        <span class="text-sm text-moon-300">{posts.length} 篇</span>
      </a>
      {postTypes.map((type) => (
        <a href={`/posts?type=${type.id}`} data-type-filter={type.id} class="glass-card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1 hover:border-sky-bright/50">
          <svg class="h-7 w-7 text-sky-glow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            {(iconPaths[type.icon] ?? iconPaths['lucide:book-open']).map((path) => <path d={path} />)}
          </svg>
          <span class="text-sm font-semibold text-moon-50 group-hover:text-sky-glow">{type.name}</span>
          <span class="text-xs text-moon-300">{counts[type.id] || 0} 篇</span>
        </a>
      ))}
    </div>
```

（改动点：外层容器加 `reveal` 类与 `style="--reveal-delay: 0ms"`，内部结构与筛选脚本所依赖的 `data-type-filter` 均不变）

- [ ] **Step 2: PostList 条目加 reveal 与逐个 stagger**

`src/components/widgets/PostList.astro` 第 12-18 行改为：

```astro
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post, index) => (
    <div class="reveal" style={`--reveal-delay: ${index * 60}ms`} data-type={post.data.type} data-searchable={`${post.data.title} ${post.data.description} ${post.data.tags.join(' ')}`}>
      <PostCard post={post} />
    </div>
  ))}
</div>
```

（改动点：条目 div 加 `reveal` 类与 `--reveal-delay` stagger；`data-type` / `data-searchable` 属性保持不变，posts.astro 筛选脚本不感知改动）

- [ ] **Step 3: resources.astro 标签按钮组与卡片加 reveal**

`src/pages/resources.astro` 第 16-27 行标签按钮容器改为（外层加 reveal）：

```astro
    {tags.length > 0 && (
      <div class="reveal mb-6 flex flex-wrap gap-2" style="--reveal-delay: 0ms">
        <button type="button" data-tag-filter="all" class="rounded-full bg-sky-bright px-4 py-1.5 text-sm font-medium text-moon-900 transition">
          全部 ({resources.length})
        </button>
        {tags.map((tag) => (
          <button type="button" data-tag-filter={tag} class="rounded-full bg-moon-800 px-4 py-1.5 text-sm font-medium text-moon-200 transition hover:bg-moon-700">
            {tag} ({tagCounts[tag]})
          </button>
        ))}
      </div>
    )}
```

第 33-39 行资源卡片网格改为：

```astro
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" id="resource-grid">
      {resources.map((resource, index) => (
        <div class="reveal" style={`--reveal-delay: ${index * 60}ms`} data-tags={resource.data.tags.join(' ')} data-searchable={`${resource.data.title} ${resource.data.description} ${resource.data.tags.join(' ')}`}>
          <ResourceCard resource={resource} />
        </div>
      ))}
    </div>
```

（改动点：容器与条目加 `reveal` 类与 stagger；`id="resource-grid"`、`data-tags`、`data-searchable` 保持不变，resources.astro 筛选脚本不感知改动）

- [ ] **Step 4: 构建验证与产物检查**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，7 页构建成功。

Run: `grep -c "reveal" dist/posts/index.html dist/resources/index.html`
Expected: 两文件均含 `reveal` 类（数量 >= 2）。

- [ ] **Step 5: 类型检查**

Run: `pnpm check 2>&1 | tail -3`
Expected: `0 errors`、9 hints。

- [ ] **Step 6: 提交**

```bash
git add src/pages/posts.astro src/components/widgets/PostList.astro src/pages/resources.astro
git commit -m "feat: add scroll reveal animations to post and resource lists"
```

---

## Self-Review

**Spec 覆盖：**
- 全站星空（内页淡化、无流星）→ Task 2 + Task 3 ✓
- PageHeader 标题入场 → Task 4 + Task 5 ✓
- reveal 滚动显现 + stagger → Task 1 + Task 3（脚本）+ Task 6 ✓
- View Transitions fade → Task 1（样式）+ Task 3（启用）✓
- 文章页头部渐入 → Task 5 Step 5 ✓
- Hero 移除 Starfield、keyframes 公共化 → Task 3 Step 3 ✓
- 首页传 full → Task 3 Step 4 ✓
- reduced-motion 覆盖 → Task 1/2/4/5 各样式块 ✓

**占位符扫描：** 无 TBD/TODO；每步均含完整代码与验证命令。

**类型一致性：** `Starfield.dimmed`（Task 2/3）、`BaseLayout.starfield`（Task 3/4 无冲突）、`PageHeader` props（Task 4/5）、keyframes 名 `fade-up`/`char-up`/`wire`（Task 1/3/4/5）在各任务间一致。

**验证手段一致性：** 每个任务以 `pnpm build` 或 `pnpm check` 结束，与项目无测试框架的现状一致。
