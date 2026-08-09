// src/utils/markdown.ts
// Markdown 渲染辅助插件
import { visit } from 'unist-util-visit';

// 将 :::tip / :::warning 等 directive 转换为提示框 div
// 渲染为 <div class="admonition admonition-tip">...</div>
export function remarkDirectiveContainer() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'containerDirective' || node.type === 'leafDirective') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = {
          class: `admonition admonition-${node.name || 'note'}`,
        };
      }
    });
  };
}
