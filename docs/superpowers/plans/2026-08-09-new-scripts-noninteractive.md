# 非交互式 new-post / new-resource 脚本实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `scripts/new-post.mjs` 与 `scripts/new-resource.mjs` 从交互式填表改为 `pnpm new-post <name>` / `pnpm new-resource <name>` 命令行参数直接生成示例 markdown。

**Architecture:** 两个独立 CLI 脚本，删除 readline 交互逻辑，从 `process.argv` 读取文件名，输出占位符格式的示例 frontmatter（含 YAML 注释标注可选项），合法枚举值（type/downloadType/published）取默认合法值以满足 Astro schema 校验。

**Tech Stack:** Node.js >= 22（ESM），纯 Node 内置模块（fs/path/process），无新依赖。

## Global Constraints

- 脚本必须为 ESM（项目 `package.json` 中 `"type": "module"`）
- Node 版本 >= 22（`package.json` engines 字段）
- 输出内容全部使用中文
- 不引入任何新依赖
- 不修改 `src/content.config.ts` 与 `src/config/site.ts`，只读取

---

### Task 1: 重写 scripts/new-post.mjs 为非交互式

**Files:**
- Modify: `scripts/new-post.mjs`（整文件重写）

**Interfaces:**
- Consumes: `src/config/site.ts` 中的 `author`（`/author:\s*'([^']+)'/`）与 `postTypes`（`/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g`），仅正则读取，不改文件
- Produces: `src/content/posts/<name>.md`（占位符格式示例文章）

- [ ] **Step 1: 重写脚本**

将 `scripts/new-post.mjs` 全文替换为：

```js
#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const POSTS_DIR = 'src/content/posts';

function formatDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function normalizeName(raw) {
  return raw.trim().replace(/\.md$/i, '');
}

async function getDefaultAuthor() {
  try {
    const source = await readFile(resolve('src/config/site.ts'), 'utf8');
    const match = source.match(/author:\s*'([^']+)'/);
    return match ? match[1] : '站长';
  } catch {
    return '站长';
  }
}

async function getTypeIds() {
  try {
    const source = await readFile(resolve('src/config/site.ts'), 'utf8');
    const block = source.match(/postTypes:\s*PostTypeInfo\[\]\s*=\s*\[([\s\S]*?)\n\s*\];/);
    if (block) {
      const matches = [...block[1].matchAll(/\{\s*id:\s*'([^']+)'/g)];
      if (matches.length) return matches.map((m) => m[1]);
    }
  } catch {
    return [];
  }
  return [];
}

function usage() {
  console.log('用法: pnpm new-post <文件名>');
  console.log('示例: pnpm new-post my-first-post');
  process.exit(1);
}

async function main() {
  const rawName = process.argv[2];
  if (!rawName) usage();
  const name = normalizeName(rawName);
  if (!name) usage();

  const filePath = resolve(POSTS_DIR, `${name}.md`);
  if (existsSync(filePath)) {
    console.error(`文件已存在: ${filePath}，已取消。`);
    process.exit(1);
  }

  const author = await getDefaultAuthor();
  const typeIds = await getTypeIds();
  const type = typeIds[0] ?? 'computer-basics';

  const content = `---
title: "${escapeYaml(name)}"
description: "待填写：文章摘要"
published: ${formatDate()}
author: "${escapeYaml(author)}"
source: "original"  # 可选: original / repost-local / repost-external
sourceUrl: ""  # 站外转载时填写原文链接
type: "${type}"  # 可选: ${typeIds.join(' / ')}
tags: ["待填写"]
draft: true  # 完成后改为 false
pinned: false
---

正文从这里开始
`;

  await writeFile(filePath, content);
  console.log(`已创建: ${filePath}`);
  console.log('请编辑该文件完善内容，完成后将 draft 改为 false。');
}

main().catch((error) => {
  console.error('创建失败:', error.message);
  process.exit(1);
});
```

- [ ] **Step 2: 无参数时打印用法**

Run: `node scripts/new-post.mjs`
Expected: 输出 `用法: pnpm new-post <文件名>` 与示例行，退出码 1（`echo $?` 为 1）。

- [ ] **Step 3: 生成示例文章并核对内容**

Run: `node scripts/new-post.mjs test-post && cat src/content/posts/test-post.md`
Expected: 文件内容为占位符模板；`title: "test-post"`；`published` 为今天（YYYY-MM-DD）；`type` 注释列出全部 6 个分类 id；结尾为 `正文从这里开始`。

- [ ] **Step 4: 重复执行报文件已存在**

Run: `node scripts/new-post.mjs test-post.md`
Expected: 输出 `文件已存在: .../src/content/posts/test-post.md，已取消。`，退出码 1。同时验证 `.md` 后缀被去除后仍命中同一文件。

- [ ] **Step 5: 验证 schema 合法并清理**

Run: `pnpm check`
Expected: 无 content 校验错误（test-post.md 的 frontmatter 通过 schema）。

Run: `rm src/content/posts/test-post.md`

- [ ] **Step 6: Commit**

```bash
git add scripts/new-post.mjs
git commit -m "refactor: new-post 改为命令行参数生成示例文章"
```

### Task 2: 重写 scripts/new-resource.mjs 为非交互式

**Files:**
- Modify: `scripts/new-resource.mjs`（整文件重写）

**Interfaces:**
- Consumes: 无外部配置
- Produces: `src/content/resources/<name>.md`（占位符格式示例资源）

- [ ] **Step 1: 重写脚本**

将 `scripts/new-resource.mjs` 全文替换为：

```js
#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const RESOURCES_DIR = 'src/content/resources';

function formatDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function normalizeName(raw) {
  return raw.trim().replace(/\.md$/i, '');
}

function usage() {
  console.log('用法: pnpm new-resource <文件名>');
  console.log('示例: pnpm new-resource my-resource');
  process.exit(1);
}

async function main() {
  const rawName = process.argv[2];
  if (!rawName) usage();
  const name = normalizeName(rawName);
  if (!name) usage();

  const filePath = resolve(RESOURCES_DIR, `${name}.md`);
  if (existsSync(filePath)) {
    console.error(`文件已存在: ${filePath}，已取消。`);
    process.exit(1);
  }

  const content = `---
title: "${escapeYaml(name)}"
description: "待填写：资源简介"
published: ${formatDate()}
downloadType: "link"  # 可选: link / pan / github
url: "待填写：下载链接"
extractCode: ""  # 网盘提取码（pan 时填写）
source: ""
tags: ["待填写"]
draft: true  # 完成后改为 false
pinned: false
---

资源介绍与使用说明
`;

  await writeFile(filePath, content);
  console.log(`已创建: ${filePath}`);
  console.log('请编辑该文件完善内容，完成后将 draft 改为 false。');
}

main().catch((error) => {
  console.error('创建失败:', error.message);
  process.exit(1);
});
```

- [ ] **Step 2: 无参数时打印用法**

Run: `node scripts/new-resource.mjs`
Expected: 输出 `用法: pnpm new-resource <文件名>` 与示例行，退出码 1（`echo $?` 为 1）。

- [ ] **Step 3: 生成示例资源并核对内容**

Run: `node scripts/new-resource.mjs test-resource && cat src/content/resources/test-resource.md`
Expected: 文件内容为占位符模板；`title: "test-resource"`；`published` 为今天；`downloadType: "link"` 带可选注释；结尾为 `资源介绍与使用说明`。

- [ ] **Step 4: 重复执行报文件已存在**

Run: `node scripts/new-resource.mjs test-resource.md`
Expected: 输出 `文件已存在: .../src/content/resources/test-resource.md，已取消。`，退出码 1。同时验证 `.md` 后缀被去除后仍命中同一文件。

- [ ] **Step 5: 验证 schema 合法并清理**

Run: `pnpm check`
Expected: 无 content 校验错误。

Run: `rm src/content/resources/test-resource.md`

- [ ] **Step 6: Commit**

```bash
git add scripts/new-resource.mjs
git commit -m "refactor: new-resource 改为命令行参数生成示例资源"
```

---

## 自审记录

- **Spec 覆盖**：无参数用法提示（Task 1/2 Step 2）、生成 posts 根目录（Task 1）、占位符格式与注释（两任务 Step 1）、文件已存在报错（Step 4）、name 去除 .md 后缀（两任务 normalizeName + Step 4 验证）、保留作者/分类动态读取（Task 1 Step 1）、结束打印路径（Step 1 console.log）——全部覆盖。
- **占位符扫描**：无 TBD/TODO，所有代码块为完整可运行代码。
- **类型一致性**：两脚本共用 `formatDate`/`escapeYaml`/`normalizeName` 命名，无跨任务引用冲突。
