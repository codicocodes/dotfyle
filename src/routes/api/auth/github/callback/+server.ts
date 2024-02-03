import { getGithubUserWithToken } from '$lib/server/auth/github/services';
import { login } from '$lib/server/auth/services';
import {
	deleteConfigsWithStaleOwner,
	updateConfigUsername
} from '$lib/server/prisma/neovimconfigs/service';
import { upsertUser } from '$lib/server/prisma/users/service';
import type { RequestEvent, RequestHandler } from '../$types';

export const GET: RequestHandler = async function(event: RequestEvent): Promise<never> {
	const { url } = event;
	const state = event.url.searchParams.get('state');
	const next = state ? JSON.parse(state).next : null;
	const upsertUserData = await getGithubUserWithToken(url);
	const user = await upsertUser(upsertUserData);
	await updateConfigUsername(user.id, user.username).catch(async (e) => {
		console.error('Failed updating config username.', user.id, user.username);
		await deleteConfigsWithStaleOwner(user.id, user.username);
	});
	return await login(event.cookies, user, next);
};
