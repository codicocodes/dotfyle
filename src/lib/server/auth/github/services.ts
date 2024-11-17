import type { UpsertUserSchema } from '$lib/server/prisma/users/schema';
import { redirect } from '@sveltejs/kit';
import { fetchGithubAccessToken, fetchGithubProfile } from './api';
import { BASE_URL } from './settings';

export class GithubAuthFailed extends Error {
  static status = 302 as const;
  static failedLocation = `${BASE_URL}?error=authentication_failed`;
  static retryLocation = '/api/auth/github';
}

export const parseCode = (url: URL) => {
  const code = url.searchParams.get('code');
  if (!code) {
    throw redirect(GithubAuthFailed.status, GithubAuthFailed.retryLocation);
  }
  return code;
};

export const fetchAccessToken = async (code: string) => {
  const { access_token } = await fetchGithubAccessToken(code);
  if (!access_token) {
    throw redirect(GithubAuthFailed.status, GithubAuthFailed.failedLocation);
  }
  return access_token;
};

export const getGithubUserWithToken = async (url: URL): Promise<UpsertUserSchema> => {
  const code = parseCode(url);
  const accessToken = await fetchAccessToken(code);
  const { id, login, avatar_url } = await fetchGithubProfile(accessToken);
  return {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken
  };
};
