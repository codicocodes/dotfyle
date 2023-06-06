import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { searchPlugins } from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pLimit from 'p-limit';

let running = false;

const runner = pLimit(10);

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate();
	if (running) {
		throw error(429, 'limit');
	}

	const limit = [];

	running = true;
	const [token, plugins] = await Promise.all([getAdminGithubToken(), searchPlugins()]);

	let synced = 0;

	let rateLimit = false;

	for (const plugin of plugins) {
		limit.push(
			runner(async () => {
				if (rateLimit) {
					return;
				}
				try {
					const syncer = new PluginSyncer(token, plugin);
					await syncer.sync()
					synced++;
					console.log(`Synced ${synced}/${plugins.length} plugins`);
				} catch (e: any) {
					if (e instanceof Error) {
						console.log(`Failed syncing ${plugin.owner}/${plugin.name}`, e.message);
					}
					if (e.status === 403) {
						rateLimit = true;
						const reset = e.response.headers['x-ratelimit-reset'];
						console.log('Rate limit rill reset at UTC: ', new Date(reset * 1000));
					}
				}
			})
		);
	}
	limit.push(() => {
		running = false;
	});
	return new Response();
};
