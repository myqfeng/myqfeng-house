// @ts-check
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site.ts';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
});
