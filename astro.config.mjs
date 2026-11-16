// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview is hosted on GitHub Pages under a sub-path. Override with SITE_URL / BASE_PATH for other hosts
// (e.g. BASE_PATH=/ when moving to kelleyproperty.com).
const site = process.env.SITE_URL ?? 'https://getprojectable.github.io';
const base = process.env.BASE_PATH ?? '/kelley-property-preview';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Legacy WordPress URLs are handled by redirect pages in src/pages (base-path aware).
  vite: {
    plugins: [tailwindcss()],
  },
});
