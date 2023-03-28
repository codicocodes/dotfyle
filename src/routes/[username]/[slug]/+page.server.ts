import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import type { NeovimPlugin } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const username = event.params.username;
	const slug = event.params.slug;
	const [me, config, plugins] = await Promise.all([
		trpc(event).getUser.query(),
		trpc(event).getConfigBySlug.query({
      username,
      slug
    }) as unknown as NeovimConfigWithMetaData,
		trpc(event).getPluginsBySlug.query({
      username,
      slug
    }) as unknown as NeovimPluginWithCount[],
	]). catch(() => {
    throw error(404, "config not found")
  });
	return {
		me,
		config,
    plugins,
	};
};
