# 非交互式 new-post / new-resource 脚本设计

日期：2026-08-09
状态：已批准

## 背景

现有 `scripts/new-post.mjs` 与 `scripts/new-resource.mjs` 为交互式填表脚本（通过 readline 依次询问标题、摘要、分类、标签等），体验繁琐。改为通过命令行参数直接生成示例 markdown，由用户自行编辑。

## 目标行为

- `pnpm new-post <name>` → 生成 `src/content/posts/<name>.md`
- `pnpm new-resource <name>` → 生成 `src/content/resources/<name>.md`
- 无参数或参数为空 → 打印用法说明（`用法: pnpm new-post <文件名>`）后退出，不进入任何交互
- 文件已存在 → 报错退出
- `<name>` 原样用作文件名（自动去除多余的 `.md` 后缀），不做 slug 化或大小写转换

## 示例内容（占位符格式）

### post（src/content/posts/<name>.md）

```markdown
---
title: "<name>"
description: "待填写：文章摘要"
published: <今天，YYYY-MM-DD>
author: "<从 site.ts 读取的默认作者>"
source: "original"  # 可选: original / repost-local / repost-external
sourceUrl: ""  # 站外转载时填写原文链接
type: "computer-basics"  # 可选: computer-basics / language-basics / tools / embedded-mcu / computer-vision / linux
tags: ["待填写"]
draft: true  # 完成后改为 false
pinned: false
---

正文从这里开始
```

### resource（src/content/resources/<name>.md）

```markdown
---
title: "<name>"
description: "待填写：资源简介"
published: <今天，YYYY-MM-DD>
downloadType: "link"  # 可选: link / pan / github
url: "待填写：下载链接"
extractCode: ""  # 网盘提取码（pan 时填写）
source: ""
tags: ["待填写"]
draft: true
pinned: false
---

资源介绍与使用说明
```

## 设计要点

- schema 校验要求 `published` 为合法日期（取当天）、`type`/`downloadType` 为合法枚举值，因此这两处给默认合法值，并以 YAML 注释标注可选列表；其余字段给占位符
- YAML 注释行不影响 Astro schema 校验
- `type` 可选列表从 `src/config/site.ts` 的 `postTypes` 动态读取并渲染进注释
- 删除 readline 交互逻辑，保留 `formatDate`、`frontmatter` 序列化等复用函数
- 创建成功后在终端打印生成路径

## 非目标

- 不做文件名合法性校验以外的任何内容校验
- 不自动创建分类子目录
- 不改动站点构建逻辑
