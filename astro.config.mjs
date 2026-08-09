// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import rehypeComponents from 'rehype-components';
import remarkDirective from 'remark-directive';
import { siteConfig } from './src/config/site.ts';
import { parseDirectiveNode } from './src/plugins/remark-directive-rehype.ts';
import { createAdmonitionComponent } from './src/plugins/rehype-component-admonition.ts';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
  integrations: [icon()],
  markdown: {
    remarkPlugins: [remarkDirective, parseDirectiveNode],
    rehypePlugins: [
      [
        rehypeComponents,
        {
          components: {
            note: createAdmonitionComponent('note'),
            tip: createAdmonitionComponent('tip'),
            important: createAdmonitionComponent('important'),
            caution: createAdmonitionComponent('caution'),
            warning: createAdmonitionComponent('warning'),
          },
        },
      ],
    ],
  },
});
