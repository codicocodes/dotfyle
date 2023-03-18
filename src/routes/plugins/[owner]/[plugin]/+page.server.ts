import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const { owner, plugin: name } = event.params;
	const plugin = await trpc(event).getPlugin.query({ owner, name });
	const configs = await trpc(event).getConfigsForPlugin.query({ owner, name });
	return {
		plugin,
    configs: configs as unknown as NeovimConfigWithMetaData[],
	};
};
