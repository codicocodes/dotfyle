import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const { owner, plugin: name } = event.params;
	const [[plugin, categoryPlugins], configs, breaking, media] = await Promise.all([
		trpc(event)
			.getPlugin.query({ owner, name })
			.then(async (plugin) => {
				const relatedPlugins = await trpc(event).getPluginsByCategory.query(plugin.category);
        return [plugin, relatedPlugins]
			}),
		trpc(event).getConfigsForPlugin.query({ owner, name }),
		trpc(event).getBreakingCommits.query({ owner, name }),
		trpc(event).getMediaForPlugin.query({ owner, name })
	]);
	return {
		plugin,
		configs: configs as unknown as NeovimConfigWithMetaData[],
		categoryPlugins,
		breaking,
		media
	};
};
