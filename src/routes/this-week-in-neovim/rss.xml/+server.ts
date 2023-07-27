import RSS from 'rss';
import type { RequestHandler } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma/client';
import { marked } from 'marked';
import { sanitizeHtml } from '$lib/utils';

export const GET: RequestHandler = async () => {
	const feed = new RSS({
		title: 'This Week in Neovim RSS Feed',
    description: 'This Week In Neovim is a weekly newsletter with updates from the Neovim ecosystem, including new plugins and breaking changes.',
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
    take: 10,
	});

	for (const post of posts) {
		if (!post.publishedAt) continue;
    const html = marked(post.content)
    const description = await sanitizeHtml(html)
		feed.item({
			title: post.title,
			url: `https://dotfyle.com/this-week-in-neovim/${post.issue}`,
			date: post.publishedAt,
			description,
		});
	}
	return new Response(feed.xml({ indent: true }), {
		headers: {
			'Cache-Control': `max-age=0, s-maxage=${60 * 10}`, // seconds
			'Content-Type': 'application/rss+xml'
		}
	});
};
