import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { NeovimConfigSyncerFactory } from '$lib/server/nvim-sync/config/NeovimConfigSyncer';
import { syncExistingRepoInfo, syncReadme } from '$lib/server/nvim-sync/config/syncRepoInfo';
import { getConfigsWithToken } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import type { RequestHandler } from '@sveltejs/kit';

const PAGE_SIZE = 50;

async function* getConfigSyncTasks() {
  const trackedPlugins = await getAllNeovimPluginNames();
  const factory = new NeovimConfigSyncerFactory(trackedPlugins);
  let skip = 0;
  while (true) {
    const configs = await getConfigsWithToken(skip, PAGE_SIZE);
    if (!configs.length) break;
    for (const { _token, ...config } of configs) {
      yield async () => {
        await Promise.all([
          syncExistingRepoInfo(_token, config),
          syncReadme(_token, config),
          factory.create(_token, config).then((syncer) => syncer.treeSync())
        ]);
      };
    }
    skip += PAGE_SIZE;
  }
}

export const GET: RequestHandler = createAsyncTaskApi(getConfigSyncTasks);
