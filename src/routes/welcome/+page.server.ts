import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  return {
    user: await trpc(event).getUser.query(),
    repositories: await trpc(event).getRepositories.query(),
  };
}
