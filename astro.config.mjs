// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import { siteConfig } from './src/config/site.ts';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
  integrations: [icon()],
});
