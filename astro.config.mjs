// @ts-check
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/data/site.ts';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
});
