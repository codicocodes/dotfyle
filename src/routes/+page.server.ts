import { redirect, type Actions } from "@sveltejs/kit";
import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from "$lib/server/prisma/neovimconfigs/schema";

export const actions: Actions = {
	githubLogin: async () => {
		throw redirect(303, '/api/auth/github');
	}
};

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  return {
    user: await trpc(event).getUser.query(),
    configs: await trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
  };
}
