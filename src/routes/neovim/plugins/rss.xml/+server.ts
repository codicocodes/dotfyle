import { createPluginsRssFeed } from '$lib/server/rss/plugins';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const feed = await createPluginsRssFeed();
  return new Response(feed, {
    headers: {
      'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 24}`, // seconds
      'Content-Type': 'application/rss+xml'
    }
  });
};
