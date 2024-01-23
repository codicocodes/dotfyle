import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { getAllPlugins, getUnsyncedPlugins, upsertManyNeovimPlugins } from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { scrapeRockerBooAwesomeNeovim, getTrackedPlugins } from '$lib/server/seeder/plugins';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

const getSyncTasks = async () => {
	const [token, plugins] = await Promise.all([getAdminGithubToken(), getUnsyncedPlugins()]);
	return plugins.map((plugin) => async () => {
		const syncer = new PluginSyncer(token, plugin);
		await syncer.sync();
	});
};


export const GET: RequestHandler = async function(event: RequestEvent) {
	new AdminRequestValidator(event).validate()
	await upsertManyNeovimPlugins(getTrackedPlugins());
	const plugins = await scrapeRockerBooAwesomeNeovim();
	await upsertManyNeovimPlugins(plugins);
	return createAsyncTaskApi(getSyncTasks)(event)
};
