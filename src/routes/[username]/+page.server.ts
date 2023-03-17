import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const username = event.params.username;
	const [me, profile, configs] = await Promise.all([
		trpc(event).getUser.query(),
		trpc(event).getUserByUsername.query(username),
		trpc(event).getConfigsByUsername.query(username) as unknown as NeovimConfigWithMetaData[]
	]). catch(() => {
    throw error(404, "user not found")
  });
	return {
		me,
		profile,
		configs,
	};
};
