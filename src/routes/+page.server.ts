import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const [configs, newPlugins, popularPlugins, colorschemes, editingSupport, preConfigured] = await Promise.all([
		trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
    trpc(event).searchPlugins.query({ sorting: 'new', take: 3 }),
    trpc(event).searchPlugins.query({ sorting: 'popular', take: 3 }),
		trpc(event).getPluginsByCategory.query('colorscheme'),
    trpc(event).searchPlugins.query({ category: 'editing-support', sorting: 'popular', take: 3 }),
    trpc(event).searchPlugins.query({ category: 'preconfigured', sorting: 'popular', take: 3 }),
	]);
	return {
		configs,
    newPlugins,
		popularPlugins,
		colorschemes,
    editingSupport,
    preConfigured
	};
};
