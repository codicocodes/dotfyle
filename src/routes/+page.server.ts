import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { NeovimConfigWithMetaData } from "$lib/server/prisma/neovimconfigs/schema";

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  return {
    configs: await trpc(event).getNewestConfigs.query() as unknown as NeovimConfigWithMetaData[],
    plugins: await trpc(event).getPopularPlugins.query()
  }
}
