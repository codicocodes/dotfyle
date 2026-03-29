import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { NeovimConfigSyncerFactory } from '$lib/server/nvim-sync/config/NeovimConfigSyncer';
import { syncExistingRepoInfo, syncReadme } from '$lib/server/nvim-sync/config/syncRepoInfo';
import { getConfigsWithToken } from '$lib/server/prisma/neovimconfigs/service';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import { deleteGithubToken } from '$lib/server/prisma/users/service';
import { RepoTransferredError } from '$lib/server/nvim-sync/config/syncRepoInfo';
import { prismaClient } from '$lib/server/prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

const PAGE_SIZE = 50;
const SYNC_LIMIT = 500;

async function* getConfigSyncTasks() {
  const trackedPlugins = await getAllNeovimPluginNames();
  const factory = new NeovimConfigSyncerFactory(trackedPlugins);
  let skip = 0;
  let synced = 0;
  while (synced < SYNC_LIMIT) {
    const configs = await getConfigsWithToken(skip, PAGE_SIZE);
    if (!configs.length) break;
    for (const { _token, _lastSyncSha, ...config } of configs) {
      if (synced >= SYNC_LIMIT) break;
      yield async () => {
        await Promise.all([
          syncExistingRepoInfo(_token, config),
          syncReadme(_token, config),
          factory.create(_token, config).then(async (syncer) => {
            if (_lastSyncSha && syncer.treeSha === _lastSyncSha) {
              console.log(`[SYNC_CONFIGS] Skipped ${config.owner}/${config.repo} — sha unchanged`);
              return;
            }
            await syncer.treeSync();
          })
        ]).catch(async (e: { status?: number; message?: string }) => {
          if (e instanceof RepoTransferredError) {
            await prismaClient.neovimConfig.update({
              where: { id: e.configId },
              data: { lastSyncedAt: new Date() }
            });
            return;
          }
          if (e.status === 404) {
            await prismaClient.neovimConfig.update({
              where: { id: config.id },
              data: { lastSyncedAt: new Date() }
            });
          }
          if (e.status === 401) {
            await deleteGithubToken(config.userId);
            console.log(
              `[SYNC_CONFIGS] Deleted invalid token for user ${config.userId} (${config.owner})`
            );
            return;
          }
          throw { ...e, message: `${config.owner}/${config.repo}: ${e.message ?? e}` };
        });
      };
      synced++;
    }
    skip += PAGE_SIZE;
  }
}

export const GET: RequestHandler = createAsyncTaskApi('SYNC_CONFIGS', getConfigSyncTasks);
