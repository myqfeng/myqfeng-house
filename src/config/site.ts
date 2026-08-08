// src/config/site.ts
// 站点配置中心：所有可自定义项都在这里调整
import type { SiteConfig, PostTypeInfo } from '@/types';

export const siteConfig: SiteConfig = {
  // ── 站点基本信息 ──────────────────────────────
  title: '明月清风的小屋',
  subtitle: '收集星光，分享知识',
  description: '一个专注于学习资源收集与分享的个人站点，包含原创文章、转载文章与各类资源下载链接。',
  siteUrl: 'https://www.070219.xyz', //  部署前替换为你的真实域名
  author: 'Myqfeng',
  pageSize: 12, // 文章/资源每页显示条数

  // SEO 关键词（用于 <meta name="keywords">）
  keywords: ['明月清风', '学习资源', '博客', '教程', '资源下载'],

  // 网站图标（favicon），支持多个：浏览器按顺序使用匹配的尺寸
  // 默认使用 public/favicon.svg，可替换为自己的图标文件
  favicon: ['/favicon.svg'],

  // 公告（显示在首页 Hero 顶部，留空则不显示）
  announcement: '欢迎来到明月清风的学习空间',

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

// 文章分类体系（icon 使用 lucide 图标名，如 lucide:cpu / lucide:terminal / lucide:code）
export const postTypes: PostTypeInfo[] = [
  { id: '0', name: '计算机基础篇', icon: 'lucide:square-play', description: '掌握基础计算机知识' },
  { id: '1', name: '语言入门篇', icon: 'lucide:code', description: '程序设计语言入门学习' },
  { id: '2', name: '工具软件篇', icon: 'lucide:wrench', description: '工欲善其事，必先利其器' },
  { id: '3', name: '嵌入式 MCU 篇', icon: 'lucide:cpu', description: '学习嵌入式单片机开发' }, 
  { id: '4', name: '计算机视觉篇', icon: 'lucide:camera', description: '计算机视觉基础' },
  { id: '5', name: 'Linux 开发篇', icon: 'lucide:terminal', description: '来玩玩 Linux 吧' },
    ];

export function getPostTypeById(id: string): PostTypeInfo | undefined {
  return postTypes.find((t) => t.id === id);
}
