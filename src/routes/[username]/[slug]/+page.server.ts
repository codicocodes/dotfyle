import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { getNeovimConfigSyncs } from '$lib/server/prisma/neovimconfigsync/service';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import type { LanguageServer } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const username = event.params.username;
	const slug = event.params.slug;
	const [me, config, plugins, languageServers, syncs] = await Promise.all([
		trpc(event).getUser.query(),
		trpc(event).getConfigBySlug.query({
			username,
			slug
		}) as unknown as NeovimConfigWithMetaData,
		trpc(event).getPluginsBySlug.query({
			username,
			slug
		}) as unknown as NeovimPluginWithCount[],
		trpc(event).getLanguageServersBySlug.query({
			username,
			slug
		}) as unknown as LanguageServer[],
    getNeovimConfigSyncs(username, slug)
	]).catch(() => {
		throw error(404, 'config not found');
	});

  console.log(JSON.stringify(syncs, null, 2))

	return {
		me,
		config,
		plugins,
		languageServers
	};
};
