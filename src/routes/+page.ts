import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const [configs, newPlugins, trendingPlugins, twinPosts] = await Promise.all([
		trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
		trpc(event).searchPlugins.query({
			sorting: 'new',
			categories: [],
			page: 1,
			take: 4
		}),
		trpc(event).searchPlugins.query({
			sorting: 'trending',
			categories: [],
			page: 1,
			take: 4
		}),
		trpc(event).getTwinPosts.query({
			page: 1,
			perPage: 4
		})
	]);
	return {
		loading: {
			configs,
			newPlugins,
			trendingPlugins,
			twinPosts: twinPosts.data
		}
	};
};
