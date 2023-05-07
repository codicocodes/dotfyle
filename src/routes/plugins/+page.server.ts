import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  const plugins = await trpc(event).searchPlugins.query({
    sorting: 'new'
  }) as unknown as NeovimPluginWithCount[];
	return {
    plugins
	};
};
