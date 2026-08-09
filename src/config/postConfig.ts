// src/config/postConfig.ts
// 文章相关配置中心：分类、分页、文章目录（TOC）等都在这里调整
import type { PostTypeInfo, TocConfig } from '@/types';

export const postConfig = {
  // ── 分页 ──────────────────────────────────────
  pageSize: 24, // 文章每页显示条数

  // ── 文章目录（TOC）─────────────────────────────
  toc: {
    enabled: true, // 是否显示文章目录（false 则所有文章都不显示目录）
    minDepth: 2, // 目录包含的最小标题级别（h2）
    maxDepth: 4, // 目录包含的最大标题级别（h4）
    collapseThreshold: 5, // 目录条目数 <= 此值时默认折叠（> 此值默认展开）
  } satisfies TocConfig,
};

// 文章分类体系（icon 使用 lucide 图标名，如 lucide:cpu / lucide:terminal / lucide:code）
export const postTypes: PostTypeInfo[] = [
  { id: 'computer-basics', name: '计算机基础篇', icon: 'lucide:square-play', description: '掌握基础计算机知识' },
  { id: 'language-basics', name: '语言入门篇', icon: 'lucide:code', description: '程序设计语言入门学习' },
  { id: 'tools', name: '工具软件篇', icon: 'lucide:wrench', description: '工欲善其事，必先利其器' },
  { id: 'embedded', name: '嵌入式 MCU 篇', icon: 'lucide:cpu', description: '学习嵌入式单片机开发' },
  { id: 'computer-vision', name: '计算机视觉篇', icon: 'lucide:camera', description: '计算机视觉基础' },
  { id: 'linux', name: 'Linux 开发篇', icon: 'lucide:terminal', description: '来玩玩 Linux 吧' },
];

export function getPostTypeById(id: string): PostTypeInfo | undefined {
  return postTypes.find((t) => t.id === id);
}
