import { upsertManyNeovimPlugins } from '$lib/server/prisma/neovimplugins/service';
import { scrapeRockerBooAwesomeNeovim } from '$lib/server/seeder/plugins';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { AdminRequestValidator } from '../../common/AdminRequestValidator';

export const GET: RequestHandler = async function (event: RequestEvent) {
	new AdminRequestValidator(event).validate()
	const plugins = await scrapeRockerBooAwesomeNeovim();
	const saved = await upsertManyNeovimPlugins(plugins);
	const res = new Response(JSON.stringify(saved, undefined, 4));
	return res;
};
