# 文章分类页放射状导航设计

- 日期：2026-08-08
- 项目：myqfeng-house（Astro 5 静态站，暗色星空主题）
- 状态：已确认

## 背景

当前 `/posts` 为文章列表页（分类卡片网格 + 搜索 + 文章列表 + 分页），分类与列表混在一页。需求：将 `/posts` 首页改为分类导航页——页面中间为「所有文章」大按钮，6 个分类按钮成放射状分布在周围，点击分类按钮进入对应分类的文章列表页；无分类筛选时不再直接展示文章列表。

## 目标

1. `/posts` 无 `type` query 时：展示放射状分类导航（中心「所有文章」按钮 + 周围 6 分类按钮）
2. 点击分类/所有按钮进入 `/posts?type=xxx` 列表模式（复用现有客户端筛选机制）
3. 有 `type` query 时：展示原有列表 UI（搜索 + 文章列表 + 分页），分类卡片网格保留作为分类切换器
4. 移动端回退为紧凑网格布局

## 设计

### 1. 页面结构（posts.astro）

页面自上而下：

1. **PageHeader**（现有组件）：`title="文章"`
2. **放射导航区**（默认显示）：
   - 中心：「所有文章」大按钮 → `/posts?type=all`，显示文章总数
   - 周围：6 个分类按钮按 60° 间隔、半径约 220px 均匀分布（图标 + 分类名 + 计数）→ `/posts?type={id}`
3. **列表区**（有 `type` query 时显示）：现有 SearchBox + 分类卡片网格（href 调整，见下）+ PostList + 空态 + Pagination，逻辑不变

显示/隐藏由客户端脚本根据 `location.search` 中是否存在 `type` 参数切换（构建时无法得知 query，沿用现有客户端模式）。

### 2. 放射状布局实现

- 位置计算在 Astro frontmatter 中完成（模板期）：对 `postTypes` 数组，第 i 个按钮角度 `θ = -π/2 + i * 2π / 6`，坐标 `tx = Math.cos(θ) * 220`、`ty = Math.sin(θ) * 220`
- 按钮样式：`position: absolute; left: 50%; top: 50%; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty)))`
- 入场动画 keyframes（新增在 posts.astro 内部 `<style is:global>`）：
  - `radial-in`：`from { transform: translate(-50%, -50%) scale(0); opacity: 0 }` → `to { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 1 }`，动画延迟 `index * 0.12s`
  - 中心按钮用 `center-in`：`from { transform: translate(-50%, -50%) scale(0); opacity: 0 }` → `to { transform: translate(-50%, -50%) scale(1); opacity: 1 }`
- 容器：`position: relative; height: 72vh; max-width: 900px; margin: 0 auto`（容纳半径 220px 圆环 + 按钮尺寸）

### 3. 移动端回退（<768px）

- 容器改 `display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: auto`
- 按钮 `position: static; transform: none`，动画改 `fade-up`（stagger 0.1s）
- 中心按钮 `grid-column: span 2`
- 通过 `@media (min-width: 768px)` 启用放射状，默认移动布局（移动优先，避免绝对定位溢出）

### 4. 按钮视觉

- 中心按钮：`rounded-full bg-sky-bright` 大按钮（px-10 py-4）、发光阴影、`hover:-translate-y-0.5` 强化发光；文案「所有文章」+ 次级文字「共 N 篇」
- 分类按钮：`glass-card` 圆形（约 128px 直径）、图标 + 分类名 + 计数，`hover` 上浮发光（沿用 glass-card 全局样式）

### 5. 列表模式调整

- 「全部」卡片链接：`/posts` → `/posts?type=all`（否则从列表页点「全部」会回到导航页）
- 其余分类卡片链接（`/posts?type=xxx`）、搜索、分页、筛选脚本逻辑不变

### 6. 交互与状态

- 导航页 → 列表页：点击按钮，VT 导航（query 变化触发完整导航），新页面脚本检测到 `type` 参数显示列表区
- 列表页 → 导航页：点击导航栏「文章」或浏览器返回 `/posts`（无 query）
- 导航页在列表页返回时无闪烁（VT 淡入淡出）

## 改动文件

| 文件 | 改动 |
|---|---|
| `src/pages/posts.astro` | 重构：PageHeader + 放射导航区 + 列表区条件显示；frontmatter 计算按钮坐标；新增样式 |

仅此一个文件（不新增页面、不改筛选脚本逻辑）。

## 验证

- `pnpm build`：7 页构建成功（posts 页产物含放射区 DOM 与内联样式）
- `pnpm check`：0 errors、9 hints 不变
- 产物检查：`dist/posts/index.html` 含中心按钮文案与分类按钮坐标
