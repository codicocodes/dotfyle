import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { NeovimConfigSyncerFactory } from '$lib/server/nvim-sync/config/NeovimConfigSyncer';
import { syncExistingRepoInfo } from '$lib/server/nvim-sync/config/syncRepoInfo';
import { getConfigsWithToken } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import type { RequestHandler } from '@sveltejs/kit';


const getConfigSyncTasks = async () => {
	const trackedPlugins = await getAllNeovimPluginNames();
	const configs = await getConfigsWithToken();
	const syncFactory = new NeovimConfigSyncerFactory(trackedPlugins);
	return configs.map(({ _token, ...config }) => {
		return async () => {
			await Promise.all([
				syncExistingRepoInfo(_token, config),
				syncFactory.create(_token, config).then((syncer) => syncer.treeSync()) ]);
		};
	});
};

export const GET: RequestHandler = createAsyncTaskApi(getConfigSyncTasks);
