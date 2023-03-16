import { getGithubUserWithToken } from '$lib/server/auth/github/services';
import { login } from '$lib/server/auth/services';
import { upsertUser } from '$lib/server/prisma/users/service';
import type { RequestEvent, RequestHandler } from '../$types';

export const GET: RequestHandler = async function (event: RequestEvent): Promise<never> {
	const { url } = event;
	const upsertUserData = await getGithubUserWithToken(url);
	const user = await upsertUser(upsertUserData);
	return await login(event.cookies, user);
};
