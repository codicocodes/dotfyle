import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { GITHUB_REDIRECT_URL } from '$lib/server/auth/github/settings';

export const GET: RequestHandler = function() {
	throw redirect(302, GITHUB_REDIRECT_URL);
};
