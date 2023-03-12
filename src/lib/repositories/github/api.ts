import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { GithubRepository } from './schema';

export const fetchGithubRepositories = async (username: string, token: string): Promise<GithubRepository[]> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const reposResponse = await gh.repos.listForUser({ username });
	const reposData = reposResponse.data;
  console.log(reposData)
  const repos = z.array(GithubRepository).parse(reposData)
	return repos;
};
