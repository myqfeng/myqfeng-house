# Task 5 实施报告：首页 Hero + 分类入口 + 最新推荐

## 任务信息

- 任务：Task 5
- 基础提交：`006ea48`
- 实施范围：`Hero`、`CategoryGrid`、`PostCard`、`ResourceCard`，以及首页数据加载和布局
- 依赖变更：无；未安装或下载任何包

## 实现内容

### Hero

- 新增 `src/components/layout/Hero.astro`。
- 使用集中配置中的 `siteConfig.title` 和 `siteConfig.subtitle`。
- 提供“开始探索”按钮，链接到 `/posts`。
- 保留现有深色月光主题的装饰背景，并使用内联 SVG 绘制箭头图标。
- 为按钮补充键盘焦点样式。

### 分类入口

- 新增 `src/components/widgets/CategoryGrid.astro`。
- 使用集中配置中的 `resourceTypes` 动态渲染六个分类入口。
- 接收 `counts` 参数，显示每类文章和资源合计条目数。
- 分类入口链接到 `/categories/{type.id}`。
- 未使用 `astro-icon`，按分类 ID 使用内联 SVG 图标。

### 文章卡片

- 新增 `src/components/layout/PostCard.astro`。
- 接收 `CollectionEntry<'posts'>` 类型的 `post` 参数。
- 显示文章分类、标题、描述、发布日期和最多三个标签。
- 对 `repost-external` 且存在 `sourceUrl` 的文章使用外部链接，并在新窗口打开；其他文章链接到 `/posts/{post.id}`。

### 资源卡片

- 新增 `src/components/layout/ResourceCard.astro`。
- 接收 `CollectionEntry<'resources'>` 类型的 `resource` 参数。
- 显示资源分类、标题、描述、发布日期和最多三个标签。
- 根据 `downloadType` 显示“前往下载”、“网盘下载”或“GitHub”。
- 下载链接在新窗口打开，并显示外链内联 SVG 图标。
- 有提取码时显示提取码区域。

### 首页

- 修改 `src/pages/index.astro`，移除 Task 4 的占位内容。
- 调用 `getResourceTypeCounts()`、`getPosts()` 和 `getResources()`。
- 使用已排序的数据分别截取最新三篇文章和最新三个资源。
- 首页顺序为 Hero、资源分类、最新文章、最新资源。
- 保留“查看全部”链接，分别指向 `/posts` 和 `/resources`。

### 路由占位

- 为避免首页与分类入口在后续任务前落到 404，补充了最小占位路由：`/posts`、`/categories`、`/categories/[type]`、`/resources`、`/about`。
- 这些占位页只提供基础布局和提示文案，不替代后续正式列表/详情实现。

## 自审结果

- 所有需求指定的文件均已创建或修改。
- 未引入未注册的 `astro-icon` 组件导入。
- 内容集合数据继续通过现有 `src/utils/content.ts` 获取，未重复实现排序或草稿过滤。
- 文章外链仅在 `sourceUrl` 存在时启用，避免生成空链接。
- 首页网格使用现有 Tailwind 断点，覆盖单列、双列和三列布局。
- 未修改 Task 5 范围之外的业务文件。
- 当前仓库没有现成测试文件或测试脚本，因此以 Astro 类型检查、差异检查和生产构建作为验证。

## 验证记录

### `pnpm check`

通过：

- 0 errors
- 0 warnings
- 0 hints

### `pnpm build`

通过：

- 静态构建完成
- 首页 `/index.html` 成功生成
- 共生成 1 个页面

更新后重新构建：

- 共生成 11 个页面
- `/posts`、`/categories`、`/categories/[type]`、`/resources`、`/about` 均已可访问

### `git diff --check`

通过，未发现空白字符错误。

## 提交

提交信息：`feat: add homepage with hero, category grid and latest posts/resources`
