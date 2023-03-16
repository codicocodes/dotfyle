import { Octokit } from '@octokit/rest';
import { GithubProfileDTO } from './schema';
import { GITHUB_ACCESS_TOKEN_URL } from './settings';

export const fetchGithubAccessToken = async (code: string) => {
	return fetch(
    GITHUB_ACCESS_TOKEN_URL.replace("{{code}}", code),
		{
			method: 'POST',
			headers: {
				accept: 'application/json'
			}
		}
	).then((res) => res.json());
};

export const fetchGithubProfile = async (token: string): Promise<GithubProfileDTO> => {
  const gh = new Octokit({
    auth: `token ${token}`
  });
  const userResponse = await gh.users.getAuthenticated()
  const user = GithubProfileDTO.parse(userResponse.data)
  return user
};
