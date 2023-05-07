import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
  const plugins = await trpc(event).searchPlugins.query({
    sorting: 'new'
  }) as unknown as NeovimPluginWithCount[];
	return {
    plugins
	};
};
