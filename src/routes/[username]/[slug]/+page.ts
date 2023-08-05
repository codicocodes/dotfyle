import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import type { LanguageServer } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
  console.log("wrong load is being hit...")
	const username = event.params.username;
	const slug = event.params.slug;
	const [me, config, plugins, languageServers] = await Promise.all([
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
	]).catch(() => {
		throw error(404);
	});

	return {
		me,
		config,
		plugins,
		languageServers
	};
};
