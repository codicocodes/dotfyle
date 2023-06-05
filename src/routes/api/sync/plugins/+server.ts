import {
	searchPlugins,
} from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pLimit from 'p-limit';
import { AdminRequestValidator } from '../../common/AdminRequestValidator';

let running = false;

const runner = pLimit(10)

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate()
  if (running) {
    throw error(429, 'limit');
  }
	try {
    running = true
		const [token, plugins] = await Promise.all([getAdminGithubToken(), searchPlugins()]);

		let synced = 0;

		for (const plugin of plugins) {
      runner(async () => {
        const syncer = new PluginSyncer(token, plugin);
        await syncer.sync()
        .catch((e) => [console.log(`Failed syncing ${plugin.owner}/${plugin.name}`, e)]);
        synced++;
        console.log(`Synced ${synced}/${plugins.length} plugins`);
      })
		}
		return new Response();
	} finally {
    running = false;
  }
};
