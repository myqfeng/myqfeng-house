// src/config/friendLinks.ts
// 友情链接配置中心：在首页"友情链接"区块展示，所有链接都在这里调整
// 字段说明：
//   name        - 站点名称
//   url         - 站点链接（http(s):// 开头）
//   description - 站点简介（可选，留空则不显示）
//   image       - 站点图标（可选，常用站点 favicon 地址，留空则不显示图标）
// 留空数组 [] 则首页不显示"友情链接"区块
import type { FriendLink } from '@/types';

export const friendLinks: FriendLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的代码托管平台',
    image: 'https://github.com/favicon.ico',
  },
  {
    name: 'Gitee',
    url: 'https://gitee.com',
    description: '国内知名的代码托管平台',
    image: 'https://gitee.com/favicon.ico',
  },
  {
    name: '波特律动',
    url: 'https://docs.baud-dance.com/',
    description: '最好的 STM32 HAL 库教程',
    image: 'https://docs.baud-dance.com/img/logo.svg',
  },
  {
    name: '菜鸟教程',
    url: 'https://www.runoob.com/',
    description: '有些简略但内容全面的新手教程网站',
    image: 'https://www.runoob.com/favicon.ico',
  },
  {
    name: '清风博客',
    url: 'https://blog.myqfeng.top/',
    description: '本站作者自己的个人博客',
    image: 'https://blog.myqfeng.top/assets/images/icon.png',
  },
  {
    name: '桂电无刀客',
    url: 'https://www.gdwdk.com/',
    description: '电子人必备的学习网站',
    image: 'https://www.gdwdk.com/feedback_files/avatar.jpg',
  },
  {
    name: 'VS Code',
    url: 'https://code.visualstudio.com/',
    description: '世界上最好用的代码编辑器',
    image: 'https://code.visualstudio.com/favicon.ico',
  },
  {
    name: '腾讯云 EdgeOne',
    url: 'https://intl.cloud.tencent.com/zh/products/teo',
    description: '本站部署在腾讯云 EdgeOne 上',
    image: 'https://cloud.tencent.com/favicon.ico',
  },
];
