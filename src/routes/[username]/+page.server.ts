import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  const username = event.params.username;
  return {
    profile: trpc(event).getUserByUsername.query(username),
    configs: trpc(event).getConfigsByUsername.query(username),
    plugins: trpc(event).getAuthoredPluginsByUsername.query(username)
  };
};
