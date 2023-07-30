import { getPlugin } from '$lib/server/prisma/neovimplugins/service';
import type { RequestEvent, RequestHandler } from './$types';

const BASE_URL =
	'https://img.shields.io/badge/{plugin-usage}-22c55e?logo=neovim&label=configs%20using%20{repo-name}&labelColor=1e40af&link=https://dotfyle.com/plugins/{repo-owner}/{repo-name}&style={style}';

export const GET: RequestHandler = async function (event: RequestEvent) {
	const { owner, plugin: plugin } = event.params;
  const style = event.url.searchParams.get('style') ?? 'flat'
	const neovimPlugin = await getPlugin(owner, plugin);
	const usage = neovimPlugin.configCount;
	const url = BASE_URL.replaceAll('{repo-owner}', owner)
		.replaceAll('{repo-name}', plugin)
		.replaceAll('{plugin-usage}', usage.toString())
		.replaceAll('{style}', style);
	const res = await fetch(url).then((r) => r.text());
	event.setHeaders({
		'Content-Type': 'image/svg+xml',
		'Content-Length': res.toString().length.toString(),
    'Cache-Control': `max-age=0, s-maxage=${24 * 60 * 60}`, // one day
	});
	return new Response(res);
};
