# 文章分类页放射状导航实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/posts` 改为放射状分类导航页：中心「所有文章」按钮 + 6 个分类按钮成圆环分布，点击进入 `/posts?type=xxx` 列表模式。

**Architecture:** 仅重构 `src/pages/posts.astro` 单文件。按钮坐标在 frontmatter 用三角函数计算（CSS 变量注入），模式切换（导航区 vs 列表区）由客户端脚本检测 `location.search` 的 `type` 参数完成，列表筛选/分页脚本逻辑原样保留。

**Tech Stack:** Astro 5、Tailwind CSS 3、原生 CSS 动画（复用全局 `fade-up` keyframes 与 reduced-motion 规范）

## Global Constraints

- 项目无测试框架，验证手段为 `pnpm build`（期望 7 page(s) built、无 error）与 `pnpm check`（期望 0 error、9 条已知 hints 不变）
- 不新增依赖；不修改筛选/分页/搜索脚本的既有行为（`data-type-filter`、`data-searchable`、`data-empty-state`、`data-pagination` 选择器保持不变）
- `prefers-reduced-motion: reduce` 必须覆盖所有新动画
- 不添加代码注释（保持项目惯例）
- 提交信息风格：`feat: ...`

---

### Task 1: posts.astro 重写为放射状导航 + 列表双模式

**Files:**
- Rewrite: `src/pages/posts.astro`（完整替换文件内容）

**Interfaces:**
- Consumes: `PostTypeInfo`（来自 `@/config/site` 的 `postTypes`，含 `id/name/icon/description`）；`getPosts()`、`getPostTypeCounts()`（来自 `@/utils/content`）；`PageHeader`、`SearchBox`、`Pagination`、`PostList` 组件
- Produces: `/posts` 无 `type` query 时显示放射导航区（`[data-radial-nav]`），有 `type` query（含 `all`）时显示列表区（`[data-posts-list]`）；「全部」卡片链接改为 `/posts?type=all`

- [ ] **Step 1: 完整重写文件**

将 `src/pages/posts.astro` 全部内容替换为：

```astro
---
import BaseLayout from '@/components/layout/BaseLayout.astro';
import PageHeader from '@/components/layout/PageHeader.astro';
import SearchBox from '@/components/ui/SearchBox.astro';
import Pagination from '@/components/ui/Pagination.astro';
import PostList from '@/components/widgets/PostList.astro';
import { postTypes, siteConfig } from '@/config/site';
import { getPosts, getPostTypeCounts } from '@/utils/content';

const posts = await getPosts();
const counts = await getPostTypeCounts();
const totalPages = Math.ceil(posts.length / siteConfig.pageSize);

const RADIUS = 220;
const radialButtons = postTypes.map((type, index) => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / postTypes.length;
  return {
    ...type,
    tx: Math.round(Math.cos(angle) * RADIUS),
    ty: Math.round(Math.sin(angle) * RADIUS),
    delay: `${0.15 + index * 0.12}s`,
  };
});

const iconPaths: Record<string, string[]> = {
  'lucide:book-open': ['M12 7v14', 'M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 1 3 18.5z', 'M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5a2.5 2.5 0 0 0 2.5-2.5z'],
  'lucide:wrench': ['M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.9 2.9-3-3z'],
  'lucide:book': ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2'],
  'lucide:play-circle': ['M10 8l6 4-6 4z', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'],
  'lucide:notebook': ['M6 4h11a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 2v4', 'M8 10h7', 'M8 14h7'],
  'lucide:code': ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
};
---

<BaseLayout title="文章" description="浏览所有原创文章和转载文章">
  <section class="mx-auto max-w-7xl px-4 py-12">
    <PageHeader title="文章" />

    <div class="radial-wrap" data-radial-nav>
      <a href="/posts?type=all" class="radial-center">
        <span class="text-lg font-bold text-moon-900">所有文章</span>
        <span class="text-xs text-moon-700">共 {posts.length} 篇</span>
      </a>
      {radialButtons.map((button) => (
        <a
          href={`/posts?type=${button.id}`}
          class="radial-btn glass-card"
          style={`--tx: ${button.tx}px; --ty: ${button.ty}px; --reveal-delay: ${button.delay}`}
        >
          <svg class="h-8 w-8 text-sky-glow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            {(iconPaths[button.icon] ?? iconPaths['lucide:book-open']).map((path) => <path d={path} />)}
          </svg>
          <span class="text-sm font-semibold text-moon-50">{button.name}</span>
          <span class="text-xs text-moon-300">{counts[button.id] || 0} 篇</span>
        </a>
      ))}
    </div>

    <div class="hidden" data-posts-list>
      <div class="reveal mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" style="--reveal-delay: 0ms">
        <a href="/posts?type=all" data-type-filter="all" class="glass-card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1 hover:border-sky-bright/50">
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

      <div class="mb-8">
        <SearchBox placeholder="搜索文章标题、描述或标签..." label="搜索文章" filter={false} />
      </div>

      <PostList posts={posts} />
      <p class="hidden py-12 text-center text-moon-300" data-empty-state>暂时没有符合条件的文章。</p>

      <Pagination currentPage={1} totalPages={totalPages} baseUrl="/posts" />
    </div>
  </section>
</BaseLayout>

<script is:inline define:vars={{ pageSize: siteConfig.pageSize, validTypes: postTypes.map((type) => type.id) }}>
  const params = new URLSearchParams(window.location.search);
  const hasType = params.has('type');
  document.querySelector('[data-radial-nav]')?.classList.toggle('hidden', hasType);
  document.querySelector('[data-posts-list]')?.classList.toggle('hidden', !hasType);

  const cards = Array.from(document.querySelectorAll('[data-searchable]'));
  const filters = Array.from(document.querySelectorAll('[data-type-filter]'));
  const input = document.getElementById('search');
  const pagination = document.querySelector('[data-pagination]');
  const emptyState = document.querySelector('[data-empty-state]');
  const activeClass = ['bg-sky-bright', 'text-moon-900'];
  const inactiveClass = ['bg-moon-800', 'text-moon-200', 'hover:bg-moon-700'];
  const activeCardClass = ['border-sky-bright/70', 'ring-1', 'ring-sky-bright'];

  function pageHref(type, page) {
    const next = new URLSearchParams();
    if (type !== 'all') next.set('type', type);
    if (page > 1) next.set('page', String(page));
    const query = next.toString();
    return query ? `/posts?${query}` : '/posts';
  }

  function renderPagination(type, currentPage, totalPages) {
    if (!pagination) return;
    pagination.classList.toggle('hidden', totalPages <= 1);
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const pages = [];
    if (currentPage > 1) pages.push({ label: '上一页', page: currentPage - 1 });
    for (let page = 1; page <= totalPages; page += 1) pages.push({ label: String(page), page });
    if (currentPage < totalPages) pages.push({ label: '下一页', page: currentPage + 1 });

    pages.forEach(({ label, page }) => {
      const link = document.createElement('a');
      const isCurrent = page === currentPage && label === String(page);
      link.href = pageHref(type, page);
      link.textContent = label;
      link.className = `rounded-lg px-4 py-2 ${isCurrent ? 'bg-sky-bright text-moon-900' : 'bg-moon-800 text-moon-200 hover:bg-moon-700 hover:text-sky-glow'}`;
      if (isCurrent) link.setAttribute('aria-current', 'page');
      pagination.append(link);
    });
  }

  function applyState() {
    const rawType = params.get('type') || 'all';
    const type = validTypes.includes(rawType) ? rawType : 'all';
    const search = input?.value.toLowerCase().trim() || '';
    const matchingCards = cards.filter((card) => {
      const matchesType = type === 'all' || card.getAttribute('data-type') === type;
      const text = card.getAttribute('data-searchable')?.toLowerCase() || '';
      return matchesType && text.includes(search);
    });
    const totalPages = Math.ceil(matchingCards.length / pageSize);
    const requestedPage = Number.parseInt(params.get('page') || '1', 10);
    const currentPage = Math.min(Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1), Math.max(totalPages, 1));
    const firstIndex = (currentPage - 1) * pageSize;
    const visibleCards = new Set(matchingCards.slice(firstIndex, firstIndex + pageSize));

    cards.forEach((card) => card.classList.toggle('hidden', !visibleCards.has(card)));
    emptyState?.classList.toggle('hidden', matchingCards.length > 0);

    filters.forEach((filter) => {
      const isActive = filter.getAttribute('data-type-filter') === type;
      activeCardClass.forEach((className) => filter.classList.toggle(className, isActive));
    });

    renderPagination(type, currentPage, totalPages);
  }

  input?.addEventListener('input', () => {
    params.delete('page');
    applyState();
  });
  applyState();
</script>

<style is:global>
  .radial-wrap {
    position: relative;
    margin: 0 auto;
    height: 72vh;
    max-width: 900px;
  }

  .radial-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    border-radius: 9999px;
    background: var(--color-accent);
    color: #0f172a;
    padding: 1.5rem 3rem;
    box-shadow: 0 0 40px rgba(96, 165, 250, 0.4);
    animation-name: center-in;
    animation-duration: 0.8s;
    animation-timing-function: cubic-bezier(0.65, 0.05, 0, 1);
    animation-fill-mode: backwards;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .radial-center:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 0 60px rgba(147, 197, 253, 0.55);
  }
  @keyframes center-in {
    from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  .radial-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 9rem;
    height: 9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    border-radius: 9999px;
    text-align: center;
    animation-name: radial-in;
    animation-duration: 0.7s;
    animation-timing-function: cubic-bezier(0.65, 0.05, 0, 1);
    animation-fill-mode: backwards;
    animation-delay: var(--reveal-delay, 0s);
  }
  .radial-btn:hover {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) translateY(-4px);
  }
  @keyframes radial-in {
    from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    to { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 1; }
  }

  @media (max-width: 767px) {
    .radial-wrap {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      height: auto;
      max-width: 28rem;
    }
    .radial-center {
      grid-column: span 2;
      position: static;
      transform: none;
      animation-name: fade-up;
      animation-delay: 0.05s;
    }
    .radial-center:hover {
      transform: scale(1.03);
    }
    .radial-btn {
      position: static;
      transform: none;
      width: auto;
      height: auto;
      border-radius: 1rem;
      padding: 1rem;
      animation-name: fade-up;
    }
    .radial-btn:hover {
      transform: translateY(-2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .radial-center,
    .radial-btn {
      animation: none;
      opacity: 1;
    }
    .radial-center,
    .radial-btn,
    .radial-center:hover,
    .radial-btn:hover {
      transform: translate(-50%, -50%);
    }
    .radial-center:hover {
      transform: translate(-50%, -50%) scale(1);
    }
    @media (max-width: 767px) {
      .radial-center,
      .radial-btn,
      .radial-center:hover,
      .radial-btn:hover {
        transform: none;
      }
    }
  }
</style>
```

- [ ] **Step 2: 构建验证**

Run: `pnpm build 2>&1 | grep -E "error|page\(s\)|Complete" | tail -3`
Expected: 无 error，`7 page(s) built`、`Complete!`

- [ ] **Step 3: 产物检查**

Run: `grep -c "radial-wrap" dist/posts/index.html && grep -c "所有文章" dist/posts/index.html && grep -c "data-posts-list" dist/posts/index.html`
Expected: 三处均 >= 1（放射区、中心按钮、列表区均存在）

Run: `grep -o "type=tutorial" dist/posts/index.html | head -2`
Expected: 分类按钮与列表卡片中均含 `?type=tutorial` 链接

- [ ] **Step 4: 类型检查**

Run: `pnpm check 2>&1 | tail -3`
Expected: `0 warnings`、`9 hints`

- [ ] **Step 5: 提交**

```bash
git add src/pages/posts.astro
git commit -m "feat: convert posts page to radial category navigation"
```

---

## Self-Review

**Spec 覆盖：**
- 中心「所有文章」按钮 + 总数 → Step 1 模板 `radial-center` ✓
- 6 分类 60° 圆环分布（frontmatter 三角计算）→ `radialButtons` + `radial-btn` ✓
- 模式切换（无 query 导航区 / 有 query 列表区）→ 脚本 `hasType` toggle + `data-radial-nav` / `data-posts-list` ✓
- 移动端回退紧凑网格 → `@media (max-width: 767px)` ✓
- 入场动画 stagger + reduced-motion → `--reveal-delay` + 动画属性 + reduce 覆盖 ✓
- 「全部」链接改 `/posts?type=all` → Step 1 模板 ✓
- 筛选/分页/搜索脚本逻辑不变 → Step 1 脚本原样保留 ✓
- 列表区保留（搜索 + 卡片网格 + PostList + 空态 + 分页）→ Step 1 模板 ✓

**占位符扫描：** 无 TBD/TODO，代码完整。

**类型一致性：** `radialButtons` 结构 `{...type, tx, ty, delay}` 与模板 `button.tx/ty/delay` 一致；CSS 变量 `--tx/--ty/--reveal-delay` 与 keyframes `radial-in` 引用一致；`data-radial-nav` / `data-posts-list` 在模板与脚本中一致。
