import { verifyToken } from '$lib/server/auth/services';
import { isAdmin } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const user = verifyToken(event.cookies)
  if (!user) {
    throw redirect(302, "/api/auth/github?next=/neovim/plugins/add")
  }
};
