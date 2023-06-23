import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const [configs, newPlugins, trendingPlugins, breaking] = await Promise.all([
		trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
    trpc(event).searchPlugins.query({ sorting: 'new', take: 6 }),
    trpc(event).searchPlugins.query({ sorting: 'trending', take: 6 }),
    trpc(event).getPosts.query({type: 'breaking-change' }),
	]);

	return {
		configs,
    newPlugins,
		trendingPlugins,
    breaking,
	};
};
