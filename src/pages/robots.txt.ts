import type { APIRoute } from 'astro';
import { isPreview, url } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const body = isPreview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('sitemap-index.xml'), site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
