# Task 3 报告

## 目标
为“明月清风的小屋”定义 Astro content collections，并补齐示例文章、示例资源与内容工具函数，供后续页面直接消费。

## 实现内容
- 新增 `src/content/config.ts`，定义 `posts` 与 `resources` 两个 content collections。
- 新增 `src/utils/content.ts`，提供 `getPosts()`、`getResources()`、`getPostsByType()`、`getResourcesByType()`、`getResourceTypeCounts()`。
- 新增 `src/utils/format.ts`，提供 `formatDate(date: Date)`。
- 新增示例内容文件：
  - `src/content/posts/hello-world.md`
  - `src/content/posts/astro-guide.md`
  - `src/content/resources/vscode.md`
  - `src/content/resources/react-course.md`

## 关键约束
- 直接复用 `src/data/site.ts` 导出的 `resourceTypes` 作为 `type` 枚举来源。
- 保持 brief 中给出的函数名和签名不变。
- 示例内容全部使用前置元数据和 Astro content collections 可解析的日期格式。

## 自检
- 已运行 `pnpm build`，构建成功。
- 已修正资源集合 schema 中遗漏的 `draft` 字段，使 `getResources()` 的过滤逻辑与 schema 保持一致。

## 备注
- 本任务未引入额外依赖，也未修改与内容集合无关的页面逻辑。
