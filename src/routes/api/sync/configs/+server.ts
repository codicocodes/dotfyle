import { createBulkApi } from '$lib/server/api/bulkApi';
import { fetchGithubRepositoryByName } from '$lib/server/github/api';
import { upsertNeovimConfigDTOFactory } from '$lib/server/nvim-sync/services/sync-repo-info';
import { SyncManagerFactory } from '$lib/server/nvim-sync/services/SyncManager';
import { getConfigsWithToken, upsertNeovimConfig } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import type { NeovimConfig } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';


const getSyncTasks = async () => {
	const trackedPlugins = await getAllNeovimPluginNames();
	const configs = await getConfigsWithToken();
	const syncFactory = new SyncManagerFactory(trackedPlugins);
	return configs.map(({ _token, ...config }) => {
		return async () => {
			await Promise.all([
				syncRepoInfo(_token, config),
				syncFactory.create(_token, config).then((syncer) => syncer.treeSync()) ]);
		};
	});
};

async function syncRepoInfo(token: string, config: NeovimConfig) {
	const repo = await fetchGithubRepositoryByName(token, config.owner, config.repo);
	const upsertDTO = upsertNeovimConfigDTOFactory(config.owner, config.root, config.initFile, repo);
	return upsertNeovimConfig(config.userId, upsertDTO);
}

export const GET: RequestHandler = createBulkApi(getSyncTasks);
