import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const { owner, plugin: name } = event.params;
	const [[plugin, categoryPlugins], configs, breaking, ownerUser, installInstructions] =
		await Promise.all([
			trpc(event)
				.getPlugin.query({ owner, name })
				.then(async (plugin) => {
					const relatedPlugins = await trpc(event).getPluginsByCategory.query(plugin.category);
					return [plugin, relatedPlugins] as const;
				}),
			trpc(event).getConfigsForPlugin.query({ owner, name }),
			trpc(event).getBreakingCommits.query({ owner, name }),
			trpc(event)
				.getUserByUsername.query(owner)
				.catch(() => {
					return null;
				}),
			trpc(event).getInstallInstructions.query({ owner, name })
		]);
	return {
		plugin,
		configs: configs as unknown as NeovimConfigWithMetaData[],
		categoryPlugins,
		breaking,
		media: plugin.media,
		owner: ownerUser,
		installInstructions: Object.fromEntries(installInstructions.map((i) => [i.pluginManager, i]))
	};
};
