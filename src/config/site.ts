// src/config/site.ts
// 站点配置中心：所有可自定义项都在这里调整
import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  // ── 站点基本信息 ──────────────────────────────
  title: '明月清风的小屋',
  subtitle: '收集星光，分享知识',
  description: '一个专注于学习资源收集与分享的个人站点',
  siteUrl: 'https://www.070219.xyz', //  部署前替换为你的真实域名
  author: 'Myqfeng',

  // SEO 关键词（用于 <meta name="keywords">）
  keywords: ['明月清风', '学习资源', '博客', '教程', '资源下载'],

  // 网站图标（favicon），支持多个：浏览器按顺序使用匹配的尺寸
  // 默认使用 public/favicon.svg，可替换为自己的图标文件
  favicon: ['/favicon.svg'],

  // 公告（显示在首页 Hero 顶部，留空则不显示）
  announcement: '本站在 [github.com/myqfeng/myqfeng-house](https://github.com/myqfeng/myqfeng-house) 上开源，求个 Star 喵~',

  // ── 导航栏 ────────────────────────────────────
  navLinks: [
    { name: '首页', url: '/' },
    { name: '文章', url: '/posts' },
    { name: '资源', url: '/resources' },
    { name: '留言板', url: '/guestbook' },
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
    // 项目源码链接（显示在搜索按钮旁，icon 使用 iconify 图标名，如 simple-icons:github）
    repo: {
      url: 'https://github.com/myqfeng/myqfeng-house',
      icon: 'simple-icons:github',
      label: 'GitHub',
    },
  },

  // ── 首页 Hero ─────────────────────────────────
  hero: {
    eyebrow: 'MYQFENG · LEARNING HUB', // Hero 眉题（留空不显示）
    buttons: [
      { label: '开始探索', url: '/posts', style: 'primary' },
      { label: '资源下载', url: '/resources', style: 'ghost' },
      { label: '留言板', url: '/guestbook', style: 'ghost' },
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
