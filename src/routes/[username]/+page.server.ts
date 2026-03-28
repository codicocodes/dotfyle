import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  const username = event.params.username;
  const [profile, configs, plugins] = await Promise.all([
    trpc(event).getUserByUsername.query(username),
    trpc(event).getConfigsByUsername.query(username),
    trpc(event).getAuthoredPluginsByUsername.query(username)
  ]);
  return { profile, configs, plugins };
};
