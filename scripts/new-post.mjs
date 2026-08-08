#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });
const queuedLines = [];
let waiting = null;
let closed = false;

rl.on('line', (line) => {
  queuedLines.push(line.trim());
  if (waiting) {
    const resolve = waiting;
    waiting = null;
    resolve(queuedLines.shift());
  }
});

input.on('close', () => {
  closed = true;
  if (waiting) {
    const resolve = waiting;
    waiting = null;
    resolve('');
  }
});

function ask(question, defaultValue = '') {
  const suffix = defaultValue ? ` (默认: ${defaultValue})` : '';
  output.write(`${question}${suffix}: `);
  if (queuedLines.length > 0) {
    return Promise.resolve(queuedLines.shift() || defaultValue);
  }
  if (closed) return Promise.resolve(defaultValue);
  return new Promise((resolve) => {
    waiting = (line) => resolve(line || defaultValue);
  });
}

function formatDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
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

async function getTypes() {
  try {
    const source = await readFile(resolve('src/config/site.ts'), 'utf8');
    const block = source.match(/postTypes:\s*PostTypeInfo\[\]\s*=\s*\[([\s\S]*?)\n\s*\];/);
    if (block) {
      const matches = [...block[1].matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
      if (matches.length) return matches.map((m) => ({ id: m[1], name: m[2] }));
    }
  } catch {
    return [];
  }
  return [];
}

async function askType(types) {
  console.log('选择分类:');
  types.forEach((type, index) => console.log(`  ${index + 1}. ${type.name} (${type.id})`));
  const answer = await ask('分类编号', '1');
  const index = parseInt(answer, 10);
  if (Number.isInteger(index) && index >= 1 && index <= types.length) {
    return types[index - 1].id;
  }
  return types[0].id;
}

function parseTags(raw) {
  return raw
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function frontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === 'boolean' || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value).replace(/"/g, '\\"')}"`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function main() {
  const author = await getDefaultAuthor();
  const types = await getTypes();
  const title = await ask('文章标题');
  if (!title) {
    console.error('标题不能为空，已取消。');
    process.exit(1);
  }
  const description = await ask('摘要（可选）');
  const type = await askType(types);
  const rawTags = await ask('标签（用逗号分隔，可选）');
  const tags = parseTags(rawTags);
  const source = await ask('来源（original / repost-local / repost-external，默认 original）', 'original');
  let sourceUrl = '';
  if (source !== 'original') {
    sourceUrl = await ask('原文链接');
  }
  const draft = (await ask('是否先存为草稿（y/n，默认 y）', 'y')).toLowerCase() === 'y';

  const now = new Date();
  const defaultSlug = toSlug(title) || `post-${formatDateTime(now)}`;
  const slug = await ask('文件名（英文小写，默认自动生成）', defaultSlug);
  const filePath = resolve('src/content/posts', `${slug}.md`);

  if (existsSync(filePath)) {
    console.error(`文件已存在: ${filePath}，已取消。`);
    process.exit(1);
  }

  const content = frontmatter({
    title,
    description: description || undefined,
    published: formatDate(now),
    author,
    source,
    sourceUrl: sourceUrl || undefined,
    type,
    tags,
    draft,
    pinned: false,
  });

  await writeFile(filePath, content + '\n');
  console.log(`\n已创建: ${filePath}`);
  console.log(`发布时间: ${formatDate(now)}（可修改 published 字段）`);
  if (draft) {
    console.log('当前为草稿（draft: true），完成后请将 draft 改为 false 并重新构建。');
  }
  rl.close();
}

main().catch((error) => {
  console.error('创建失败:', error.message);
  process.exit(1);
});
