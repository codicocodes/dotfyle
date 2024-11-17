import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { GITHUB_REDIRECT_URL } from '$lib/server/auth/github/settings';

export const GET: RequestHandler = function (e) {
  const next = e.url.searchParams.get('next');
  const url = next
    ? GITHUB_REDIRECT_URL + `&state=${JSON.stringify({ next })}`
    : GITHUB_REDIRECT_URL;
  throw redirect(302, url);
};
