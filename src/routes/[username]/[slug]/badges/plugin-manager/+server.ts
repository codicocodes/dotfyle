import { prismaClient } from '$lib/server/prisma/client';
import type { RequestEvent, RequestHandler } from './$types';

const BASE_URL =
	'https://img.shields.io/badge/{value}-22c55e?logo=neovim&label={label}&labelColor=1e40af&link=https://dotfyle.com/{repo-owner}/{repo-slug}&style={style}';

export const GET: RequestHandler = async function(event: RequestEvent) {
	const { username, slug } = event.params;
	const style = event.url.searchParams.get('style') ?? 'flat';
	const pluginManagerInstallation = await prismaClient.neovimConfigPlugins.findFirst({
		where: {
			config: {
				user: { username },
				slug
			},
			plugin: { category: 'plugin-manager' }
		},
		select: {
			plugin: {
				select: {
					name: true
				}
			}
		}
	});
	const url = BASE_URL.replaceAll('{repo-owner}', username)
		.replaceAll('{repo-slug}', slug)
		.replaceAll('{label}', `plugin manager`)
		.replaceAll('{value}', pluginManagerInstallation?.plugin?.name ?? 'unknown')
		.replaceAll('{style}', style);
	const res = await fetch(url).then((r) => r.text());
	event.setHeaders({
		'Content-Type': 'image/svg+xml',
		'Content-Length': res.toString().length.toString(),
		'Cache-Control': `public, max-age=0, s-maxage=${24 * 60 * 60}` // one day
	});
	return new Response(res);
};
