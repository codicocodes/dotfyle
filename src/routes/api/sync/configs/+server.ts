import { SyncManagerFactory } from '$lib/server/nvim-sync/services/SyncManager';
import { getConfigsWithToken } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pLimit from 'p-limit';
import { AdminRequestValidator } from '../../common/AdminRequestValidator';

let running = false;

const runner = pLimit(10);

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate();
	if (running) {
		throw error(429, 'limit');
	}
	try {
		running = true;
		const trackedPlugins = await getAllNeovimPluginNames();
		const syncFactory = new SyncManagerFactory(trackedPlugins);

		let synced = 0;

		const configs = await getConfigsWithToken();
		const limit = [];

		for (const { _token, ...config } of configs) {
			limit.push(
				runner(async () => {
          try {
            const syncer = await syncFactory.create(_token, config);
            await syncer.treeSync()
            synced++;
            console.log(`Synced ${synced}/${configs.length} configs`);
          } catch (e: any) {
            console.log(`Failed syncing ${config.slug}`, e.message);
          }
				})
			);
		}
    await Promise.all(limit)
		return new Response();
	} finally {
		running = false;
	}
};
