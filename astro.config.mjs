// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import remarkDirective from 'remark-directive';
import { siteConfig } from './src/config/site.ts';
import { remarkDirectiveContainer } from './src/utils/markdown.ts';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
  integrations: [icon()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveContainer],
  },
});
