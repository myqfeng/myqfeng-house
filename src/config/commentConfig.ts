// src/config/commentConfig.ts
// 评论系统配置中心：只保留 Artalk 与 Giscus（GitHub Discussions）两种
import type { CommentConfig } from '@/types';

export const commentConfig: CommentConfig = {
  // 当前启用的评论系统：'none' | 'artalk' | 'giscus'
  // 填好对应配置后把 type 改为该值即可启用，改一行即可切换
  type: 'artalk',

  // Artalk 评论系统（需自建后端服务，Docker 部署参考 https://artalk.js.org/guide/deploy.html）
  artalk: {
    // 后端程序 API 地址，替换为你实际部署的地址（注意以 / 结尾）
    server: 'https://artalk.myqfeng.top/',
    // 界面语言，支持 en / zh-CN / zh-TW / ja / ko 等，'auto' 为自动检测
    locale: 'zh-CN',
    // 是否在评论区显示文章阅读量（需要后端启用统计功能）
    visitorCount: true,
  },

  // Giscus 评论系统（基于 GitHub Discussions，官方 Web Component，无需后端）
  giscus: {
    // 仓库格式：owner/name，需已开启 Discussions
    repo: 'myqfeng/myqfeng-house',
    // 以下四个值请在 https://giscus.app 填入仓库后自动生成，复制粘贴到对应字段
    repoId: '',
    category: 'General',
    categoryId: '',
    // 评论与页面的映射方式：pathname 按当前页面路径匹配，无需额外配置
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '1',
    inputPosition: 'top',
    lang: 'zh-CN',
    loading: 'lazy',
  },
};
