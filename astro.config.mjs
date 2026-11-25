// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production is www.kelleyproperty.com at the root. CI overrides SITE_URL / BASE_PATH for the
// GitHub Pages preview build (e.g. https://<owner>.github.io + /<repo>).
const site = process.env.SITE_URL ?? 'https://www.kelleyproperty.com';
const base = process.env.BASE_PATH ?? '/';

// Legacy WordPress URLs are redirect-only pages and are left out of the sitemap.
const legacy = /\/(property|property-city|property-type|property-feature|property-status|author)\/|\/(application|contact-us|search-properties|404)\/?$/;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Legacy WordPress URLs are handled by redirect pages in src/pages (base-path aware).
  integrations: [sitemap({ filter: (page) => !legacy.test(new URL(page).pathname) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
