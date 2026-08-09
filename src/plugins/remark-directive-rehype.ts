// src/plugins/remark-directive-rehype.ts
// 将 directive 节点转换为以 directive 名为标签名的 HTML 节点（参考 Fuwari 实现）
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

export function parseDirectiveNode() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        node.attributes = node.attributes || {};
        if (
          node.children.length > 0 &&
          node.children[0].data &&
          node.children[0].data.directiveLabel
        ) {
          node.attributes['has-directive-label'] = true;
        }
        const hast: any = h(node.name, node.attributes);

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
