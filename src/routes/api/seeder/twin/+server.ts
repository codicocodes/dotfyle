import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { prismaClient } from '$lib/server/prisma/client';
import { TwinPostBuilder } from '$lib/server/twin/builder';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

class TwinFetcher {
	rawTwinContents = './raw-twin-contents.txt';
	getUrls() {
		const text = readFileSync(this.rawTwinContents, 'utf8');
		return text.split('\n').filter(Boolean);
	}

	async fetchBlogs() {
		const urls = this.getUrls();
		const inputs = this.parseUrls(urls);
		return await Promise.all(
			inputs.map(async ({ url, issue, title, ...post }) => {
				const content = await fetch(url).then((r) => r.text());
				return {
					title,
					content,
					issue,
					license: 'CC-BY-SA',
					createdAt: post.createdAt,
					publishedAt: post.createdAt
				};
			})
		);
	}

	parseUrls(urls: string[]) {
		const startUrl =
			'https://raw.githubusercontent.com/RoryNesbitt/this-week-in-neovim-contents/master/contents/';
		const endUrl = '.md';
		return urls
			.map((url) => {
				const date = new Date(url.replace(startUrl, '').replace(endUrl, '').replaceAll('/', ' '));
				return {
					url,
					date
				};
			})
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.map(({ url, date }, index) => {
				const issue = index + 1;
				const title = `Issue #${issue}`;
				return {
					issue,
					title,
					url,
					createdAt: date
				};
			});
	}
}

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate();
	const fetcher = new TwinFetcher();
	const data = await fetcher.fetchBlogs();
	await Promise.all(
		data.map(async (post) => {
			return await prismaClient.twinPost.upsert({
				where: {
					issue: post.issue
				},
				create: post,
				update: post
			});
		})
	);

	return new Response('TWIN data has been seeded');
};
