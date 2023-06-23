import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { upsertManyNeovimPlugins } from '$lib/server/prisma/neovimplugins/service';
import { scrapeRockerBooAwesomeNeovim, getTrackedPlugins } from '$lib/server/seeder/plugins';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate()
	await upsertManyNeovimPlugins(getTrackedPlugins());
	const plugins = await scrapeRockerBooAwesomeNeovim();
	await upsertManyNeovimPlugins(plugins);
  return new Response();
};
