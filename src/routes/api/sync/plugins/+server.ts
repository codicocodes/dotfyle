import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { getAllPlugins } from '$lib/server/prisma/neovimplugins/service';
import { getAdminGithubToken } from '$lib/server/prisma/users/service';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';
import type { RequestHandler } from '@sveltejs/kit';


const getSyncTasks = async () => {
	const [token, plugins] = await Promise.all([getAdminGithubToken(), getAllPlugins()]);
	return plugins.map((plugin) => async () => {
		const syncer = new PluginSyncer(token, plugin);
		await syncer.sync();
	});
};

export const GET: RequestHandler = createAsyncTaskApi(getSyncTasks)
