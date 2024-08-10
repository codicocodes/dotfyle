import { prismaClient } from '$lib/server/prisma/client';
import type { RequestEvent, RequestHandler } from './$types';

const BASE_URL =
	'https://img.shields.io/badge/{value}-{color}?logo=neovim&label={label}&labelColor={labelColor}&logoColor={logoColor}&link=https://dotfyle.com/{repo-owner}/{repo-slug}&style={style}';

export const GET: RequestHandler = async function (event: RequestEvent) {
	const { username, slug } = event.params;
	const style = event.url.searchParams.get('style') ?? 'flat';

	// Add color support + sanitize input
	const color = event.url.searchParams.get('color').replaceAll(/[^0-9a-z]/i, '') ?? '22c55e';
	const label_color = event.url.searchParams.get('labelColor').replaceAll(/[^0-9a-z]/i, '') ?? '1e40af';
	const logo_color = event.url.searchParams.get('logoColor').replaceAll(/[^0-9a-z]/i, '') ?? '';

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
		.replaceAll('{color}', color)
		.replaceAll('{labelColor}', label_color)
		.replaceAll('{logoColor}', logo_color)
		.replaceAll('{style}', style);
	const res = await fetch(url).then((r) => r.text());
	event.setHeaders({
		'Content-Type': 'image/svg+xml',
		'Content-Length': res.toString().length.toString(),
		'Cache-Control': `public, max-age=0, s-maxage=${24 * 60 * 60}` // one day
	});
	return new Response(res);
};
