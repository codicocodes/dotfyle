import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import {
  getUnsyncedPlugins,
  upsertManyNeovimPlugins
} from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { scrapeRockerBooAwesomeNeovim, getTrackedPlugins } from '$lib/server/seeder/plugins';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function (event: RequestEvent) {
  new AdminRequestValidator(event).validate();

  await upsertManyNeovimPlugins(getTrackedPlugins());
  const scraped = await scrapeRockerBooAwesomeNeovim();
  await upsertManyNeovimPlugins(scraped);

  const [token, plugins] = await Promise.all([getAdminGithubToken(), getUnsyncedPlugins()]);
  for (const plugin of plugins) {
    try {
      const syncer = new PluginSyncer(token, plugin);
      await syncer.sync();
    } catch (e) {
      console.error(`Failed to sync ${plugin.owner}/${plugin.name}:`, e);
    }
  }

  return new Response('Sync completed');
};
