// src/data/site.ts
import type { SiteConfig, ResourceTypeInfo } from '@/types';

export const siteConfig: SiteConfig = {
  title: '明月清风的小屋',
  subtitle: '收集星光，分享知识',
  description: '一个专注于学习资源收集与分享的个人站点，包含原创文章、转载文章与各类资源下载链接。',
  siteUrl: 'https://example.com',
  author: '站长',
  pageSize: 12,
  navLinks: [
    { name: '首页', url: '/' },
    { name: '文章', url: '/posts' },
    { name: '分类', url: '/categories' },
    { name: '资源', url: '/resources' },
    { name: '关于', url: '/about' },
  ],
};

export const resourceTypes: ResourceTypeInfo[] = [
  { id: 'tutorial', name: '教程文章', icon: 'lucide:book-open', description: '系统化的学习教程与文章' },
  { id: 'tool', name: '工具软件', icon: 'lucide:wrench', description: '提升效率的软件与工具' },
  { id: 'ebook', name: '电子书/PDF', icon: 'lucide:book', description: '电子书籍与 PDF 文档' },
  { id: 'video', name: '视频课程', icon: 'lucide:play-circle', description: '优质视频教程' },
  { id: 'note', name: '笔记资料', icon: 'lucide:notebook', description: '学习笔记与资料整理' },
  { id: 'opensource', name: '开源项目', icon: 'lucide:code', description: '值得学习的开源项目' },
];

export function getResourceTypeById(id: string): ResourceTypeInfo | undefined {
  return resourceTypes.find((t) => t.id === id);
}
