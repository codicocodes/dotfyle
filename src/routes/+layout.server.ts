import { trpc } from '$lib/trpc/client';
import { type ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async function load(e: ServerLoadEvent) {
  return {
    user: await trpc(e).getUser.query()
  };
}
