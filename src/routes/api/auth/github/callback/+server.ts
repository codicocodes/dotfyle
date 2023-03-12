import { getGithubUser } from '$lib/auth/github/services';
import { login } from '$lib/auth/services';
import { upsertUser } from '$lib/prisma/users/service';
import type { RequestEvent, RequestHandler } from '../$types';

export const GET: RequestHandler = async function ({ request, url }: RequestEvent) {
  const userData = await getGithubUser(url);
  const user = await upsertUser(userData);
  return await login(request, user)
};
