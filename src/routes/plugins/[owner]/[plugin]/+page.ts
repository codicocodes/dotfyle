import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const { owner, plugin: name } = event.params;
	const plugin = await trpc(event).getPlugin.query({ owner, name });
	const categoryPlugins = await trpc(event).getPluginsByCategory.query(plugin.category);
	const configs = await trpc(event).getConfigsForPlugin.query({ owner, name });
	const breaking = await trpc(event).getBreakingCommits.query({ owner, name });
	return {
		plugin,
		configs: configs as unknown as NeovimConfigWithMetaData[],
		categoryPlugins,
		breaking
	};
};
