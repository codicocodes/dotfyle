import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { getAllPlugins } from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import type { RequestHandler } from '@sveltejs/kit';

class SyncError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rateLimitReset?: number,
    public rateLimitLimit?: number
  ) {
    super(message);
  }
}

// GitHub rate limit: 5000 requests/hr (1hr rolling window)
// 2 requests/plugin (repo + readme) × 300/day = ~600 requests/day
// cycles all ~2400 plugins every ~8 days
const PAGE_SIZE = 50;
const SYNC_LIMIT = 300;

async function* getSyncTasks() {
  const token = await getAdminGithubToken();
  let skip = 0;
  let synced = 0;
  while (synced < SYNC_LIMIT) {
    const plugins = await getAllPlugins(skip, PAGE_SIZE);
    if (!plugins.length) break;
    for (const plugin of plugins) {
      if (synced >= SYNC_LIMIT) break;
      yield async () => {
        const syncer = new PluginSyncer(token, plugin);
        await syncer
          .sync()
          .catch(
            (e: {
              status?: number;
              message?: string;
              response?: { headers: Record<string, number> };
            }) => {
              throw new SyncError(
                `${plugin.owner}/${plugin.name}: ${e?.message ?? e}`,
                e?.status,
                e?.response?.headers['x-ratelimit-reset'],
                e?.response?.headers['x-ratelimit-limit']
              );
            }
          );
      };
      synced++;
    }
    skip += PAGE_SIZE;
  }
}

export const GET: RequestHandler = createAsyncTaskApi(getSyncTasks);
