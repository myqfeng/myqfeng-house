// src/plugins/rehype-component-admonition.ts
// 将 admonition directive 渲染为 GitHub 风格的 blockquote（参考 Fuwari 实现）
import { h } from 'hastscript';

export const ADMONITION_TYPES = ['note', 'tip', 'important', 'warning', 'caution'] as const;

const TYPE_ALIAS: Record<string, (typeof ADMONITION_TYPES)[number]> = {
  alert: 'warning',
  danger: 'caution',
};

export function resolveAdmonitionType(type: string): (typeof ADMONITION_TYPES)[number] {
  return (TYPE_ALIAS[type] ?? type) as (typeof ADMONITION_TYPES)[number];
}

/**
 * 创建 admonition 组件。
 * @param properties 组件属性
 * @param children 子节点
 * @param type admonition 类型（note/tip/important/caution/warning 等）
 */
export function AdmonitionComponent(properties: any, children: any[], type: string) {
  if (!Array.isArray(children) || children.length === 0)
    return h(
      'div',
      { class: 'hidden' },
      'Invalid admonition directive. (Admonition directives must be of block type ":::tip{name="name"} <content> :::")',
    );

  const resolvedType = resolveAdmonitionType(type);

  let label = null;
  if (properties?.['has-directive-label']) {
    label = children[0];
    children = children.slice(1);
    label.tagName = 'div';
  }

  return h('blockquote', { class: `admonition bdm-${resolvedType}` }, [
    h('span', { class: 'bdm-title' }, label ? label : resolvedType.toUpperCase()),
    ...children,
  ]);
}

/**
 * 生成绑定类型的 admonition 组件工厂函数（供 rehype-components 使用）。
 */
export function createAdmonitionComponent(type: string) {
  return (properties: any, children: any[]) => AdmonitionComponent(properties, children, type);
}
