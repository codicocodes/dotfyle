import { verifyToken } from '$lib/server/auth/services';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const user = verifyToken(event.cookies);
  if (!user) {
    redirect(302, '/api/auth/github?next=add');
  }
};
