import { SyncManagerFactory, syncManagerFactory } from '$lib/server/nvim-sync/services/SyncManager';
import { getConfigsWithToken } from '$lib/server/prisma/neovimconfigs/service';
import {
    getAllNeovimPluginNames,
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
    const trackedPlugins = await getAllNeovimPluginNames()
    const syncFactory = new SyncManagerFactory(trackedPlugins)

		let synced = 0;

    const configs = await getConfigsWithToken()

		for (const {_token, ...config} of configs) {
      runner(async () => {
        const syncer = await syncFactory.create(_token, config)
        await syncer.treeSync().catch((e) => [console.log(`Failed syncing ${config.slug}`, e)]);
        synced++;
        console.log(`Synced ${synced}/${configs.length} configs`);
      })
		}
		return new Response();
	} finally {
    running = false;
  }
};
