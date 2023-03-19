import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const [configs, plugins, colorschemes] = await Promise.all([
		trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
		trpc(event).getPopularPlugins.query(),
		trpc(event).getPluginsByCategory.query('colorscheme'),
	]);
	return {
		configs,
		plugins,
		colorschemes
	};
};
