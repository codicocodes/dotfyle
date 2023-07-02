import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	return {
		loading: {
			configs: trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
      newPlugins: trpc(event).searchPlugins.query({
        sorting: 'new',
        categories: [],
        page: 1,
        take: 6
      }),
      trendingPlugins: trpc(event).searchPlugins.query({
        sorting: 'trending',
        categories: [],
        page: 1,
        take: 6
      }),
      breaking: trpc(event).getPosts.query({ type: 'breaking-change' })
		},
	};
};
