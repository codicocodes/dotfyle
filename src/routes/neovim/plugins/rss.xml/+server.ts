import { getCachedPluginFeed, rebuildCachedPluginFeed } from "$lib/server/rss/plugins";
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const cachedFeed = await getCachedPluginFeed()
	console.log(cachedFeed)
	return new Response(cachedFeed, {
		headers: {
			'Cache-Control': `max-age=0, s-maxage=${60 * 60 * 24}`, // seconds
			'Content-Type': 'application/rss+xml'
		}
	});
};
