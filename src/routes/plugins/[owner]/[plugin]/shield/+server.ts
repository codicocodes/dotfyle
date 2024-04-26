import { getPlugin } from '$lib/server/prisma/neovimplugins/service';
import type { RequestEvent, RequestHandler } from './$types';

const BASE_URL =
	'https://img.shields.io/badge/{plugin-usage}-{color}?logo=neovim&label=configs%20using%20{repo-name}&labelColor={labelColor}&link=https://dotfyle.com/plugins/{repo-owner}/{repo-name}&style={style}';

export const GET: RequestHandler = async function (event: RequestEvent) {
	const { owner, plugin: plugin } = event.params;
	const style = event.url.searchParams.get('style') ?? 'flat';

	// Add color support + sanitize input
	const color = event.url.searchParams.get('color').replaceAll(/[^0-9a-z]/i, '') ?? '22c55e';
	const label_color = event.url.searchParams.get('labelColor').replaceAll(/[^0-9a-z]/i, '') ?? '1e40af';

	const neovimPlugin = await getPlugin(owner, plugin);
	const usage = neovimPlugin.configCount;
	const url = BASE_URL.replaceAll('{repo-owner}', owner)
		.replaceAll('{repo-name}', plugin)
		.replaceAll('{plugin-usage}', usage.toString())
		.replaceAll('{color}', color)
		.replaceAll('{labelColor}', label_color)
		.replaceAll('{style}', style);
	const res = await fetch(url).then((r) => r.text());
	event.setHeaders({
		'Content-Type': 'image/svg+xml',
		'Content-Length': res.toString().length.toString(),
		'Cache-Control': `public, max-age=0, s-maxage=${24 * 60 * 60}` // one day
	});
	return new Response(res);
};
