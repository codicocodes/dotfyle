import RSS from 'rss';
import type { RequestHandler } from '@sveltejs/kit';
import { remark } from 'remark';
import remarkHTML from 'remark-html';
import { prismaClient } from '$lib/server/prisma/client';

export const GET: RequestHandler = async () => {
	const feed = new RSS({
		title: 'This Week in Neovim RSS Feed',
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
		}
	});

	for (const post of posts) {
		if (!post.publishedAt) continue;
		const content = remark().use(remarkHTML).processSync(post.content);
		feed.item({
			title: post.title,
			url: `https://dotfyle.com/this-week-in-neovim/${post.issue}`,
			date: post.publishedAt,
			description: content.toString()
		});
	}
	return new Response(feed.xml({ indent: true }), {
		headers: {
			'Cache-Control': `max-age=0, s-maxage=${60 * 10}`, // seconds
			'Content-Type': 'application/rss+xml'
		}
	});
};
