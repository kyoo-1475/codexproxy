// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kyoo-369.github.io',
  base: '/codexproxy_landing',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});