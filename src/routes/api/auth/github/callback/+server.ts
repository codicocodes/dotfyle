import { getGithubUser } from '$lib/auth/github/services';
import { login } from '$lib/auth/services';
import { upsertUser } from '$lib/prisma/users/service';
import type { RequestEvent, RequestHandler } from '../$types';

export const GET: RequestHandler = async function (event: RequestEvent): Promise<never> {
	const { url } = event;
	const userData = await getGithubUser(url);
	const user = await upsertUser(userData);
  console.log({user})
	return await login(event.cookies, user);
};
