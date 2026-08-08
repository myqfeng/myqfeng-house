// src/config/site.ts
// 站点配置中心：所有可自定义项都在这里调整
import type { SiteConfig, PostTypeInfo } from '@/types';

export const siteConfig: SiteConfig = {
  // ── 站点基本信息 ──────────────────────────────
  title: '明月清风的小屋',
  subtitle: '收集星光，分享知识',
  description: '一个专注于学习资源收集与分享的个人站点，包含原创文章、转载文章与各类资源下载链接。',
  siteUrl: 'https://example.com', //  部署前替换为你的真实域名
  author: 'Myqfeng',
  pageSize: 12, // 文章/资源每页显示条数

  // SEO 关键词（用于 <meta name="keywords">）
  keywords: ['明月清风', '学习资源', '博客', '教程', '资源下载'],

  // 网站图标（favicon），支持多个：浏览器按顺序使用匹配的尺寸
  // 默认使用 public/favicon.svg，可替换为自己的图标文件
  favicon: ['/favicon.svg'],

  // 公告（显示在首页 Hero 顶部，留空则不显示）
  announcement: '   ',

  // ── 导航栏 ────────────────────────────────────
  navLinks: [
    { name: '首页', url: '/' },
    { name: '文章', url: '/posts' },
    { name: '资源', url: '/resources' },
    { name: '关于', url: '/about' },
  ],
  navbar: {
    // Header 图标（Logo）三种类型：
    //   emoji: { type: 'emoji', value: '🌙' }
    //   image: { type: 'image', value: '/logo.png', alt: 'Logo' }
    //   icon : { type: 'icon', value: '<svg>...</svg>', alt: 'Logo' }  内联 SVG
    logo: {
      type: 'image',
      value: 'https://www.myqfeng.top/logo.png',
      alt: '站点 Logo',
    },
  },

  // ── 首页 Hero ─────────────────────────────────
  hero: {
    eyebrow: 'MYQFENG · LEARNING HUB', // Hero 眉题（留空不显示）
    buttons: [
      { label: '开始探索', url: '/posts', style: 'primary' },
      { label: '资源下载', url: '/resources', style: 'ghost' },
    ],
  },

  // ── 社交链接（显示在页脚）─────────────────────
  socialLinks: [
    { label: 'GITHUB', url: 'https://github.com/myqfeng' },
    { label: 'GITEE', url: 'https://gitee.com/myqfeng' },
    { label: 'BILIBILI', url: 'https://space.bilibili.com/558600071' },
    { label: 'E-MAIL', url: 'mailto:viagrahuang@outlook.com' },
  ],

  // ── 页脚 ──────────────────────────────────────
  // 页脚自定义 HTML 请直接编辑 src/config/footer.html 文件
  footer: {
    copyright: 'All rights reserved.',
  },

  // ── 统计代码（可选）───────────────────────────
  // 例如百度统计 / 谷歌分析等，填入对应脚本片段即可
  analytics: {
    head: '',
    body: '',
  },
};

// 文章分类体系（资源不分类，仅使用 tags 标签）
export const postTypes: PostTypeInfo[] = [
  { id: 'tutorial', name: '教程文章', icon: 'lucide:book-open', description: '系统化的学习教程与文章' },
  { id: 'tool', name: '工具软件', icon: 'lucide:wrench', description: '提升效率的软件与工具' },
  { id: 'ebook', name: '电子书/PDF', icon: 'lucide:book', description: '电子书籍与 PDF 文档' },
  { id: 'video', name: '视频课程', icon: 'lucide:play-circle', description: '优质视频教程' },
  { id: 'note', name: '笔记资料', icon: 'lucide:notebook', description: '学习笔记与资料整理' },
];

export function getPostTypeById(id: string): PostTypeInfo | undefined {
  return postTypes.find((t) => t.id === id);
}
