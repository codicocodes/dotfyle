import { fetchGithubRepositoryByName } from '$lib/server/github/api';
import { upsertNeovimConfigDTOFactory } from '$lib/server/nvim-sync/services/sync-repo-info';
import { SyncManagerFactory } from '$lib/server/nvim-sync/services/SyncManager';
import { getConfigsWithToken, upsertNeovimConfig } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import type { NeovimConfig } from '@prisma/client';
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
	const limit = [];
	running = true;
	const trackedPlugins = await getAllNeovimPluginNames();
	const syncFactory = new SyncManagerFactory(trackedPlugins);

	let synced = 0;

	const configs = await getConfigsWithToken();

	for (const { _token, ...config } of configs) {
		limit.push(
			runner(async () => {
				try {
					await Promise.all([
						syncRepoInfo(_token, config),
						syncFactory.create(_token, config).then((syncer) => syncer.treeSync())
					]);
					synced++;
					console.log(`Synced ${synced}/${configs.length} configs`);
				} catch (e: any) {
					console.log(`Failed syncing ${config.slug}`, e.message);
				}
			})
		);
	}
	limit.push(() => {
		running = false;
	});
	return new Response();
};

async function syncRepoInfo(token: string, config: NeovimConfig) {
	const repo = await fetchGithubRepositoryByName(token, config.owner, config.repo);
	const upsertDTO = upsertNeovimConfigDTOFactory(config.owner, config.root, config.initFile, repo);
	return upsertNeovimConfig(config.userId, upsertDTO);
}
