import RSS from 'rss';
import type { RequestHandler } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma/client';
import { marked } from 'marked';
import { sanitizeHtml } from '$lib/utils';

async function createTwinRssFeed() {
  const feed = new RSS({
    title: 'This Week in Neovim',
    description:
      'A weekly newsletter with updates from the Neovim ecosystem, including Neovim core and the plugin community. New plugins RSS: https://dotfyle.com/neovim/plugins/rss.xml',
    site_url: 'https://dotfyle.com/this-week-in-neovim',
    feed_url: 'https://dotfyle.com/this-week-in-neovim/rss'
  });
  const posts = await prismaClient.twinPost.findMany({
    where: {
      publishedAt: {
        not: null
      }
    },
    orderBy: {
      issue: 'desc'
    },
    take: 10
  });

  for (const post of posts) {
    if (!post.publishedAt) continue;
    const html = marked(post.content);
    const description = await sanitizeHtml(html);
    feed.item({
      title: post.title,
      url: `https://dotfyle.com/this-week-in-neovim/${post.issue}?utm_source=twin-rss`,
      date: post.publishedAt,
      description
    });
  }

  const xml = feed.xml({ indent: true });

  return xml;
}

export const GET: RequestHandler = async () => {
  const feed = await createTwinRssFeed();
  return new Response(feed, {
    headers: {
      'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 24}`, // seconds
      'Content-Type': 'application/rss+xml'
    }
  });
};
