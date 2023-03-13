import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { GithubRepository, GithubTree } from './schema';

export const fetchGithubRepositories = async (
	username: string,
	token: string
): Promise<GithubRepository[]> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const reposResponse = await gh.repos.listForUser({ username });
	const reposData = reposResponse.data;
	const repos = z.array(GithubRepository).parse(reposData);
	return repos;
};

export const fetchGithubRepositoryByName = async (
	token: string,
	owner: string,
	repo: string
): Promise<GithubRepository> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const repoResponse = await gh.repos.get({ owner, repo });
	const repoData = repoResponse.data;
	const githubRepo = GithubRepository.parse(repoData);
	return githubRepo;
};

export const fetchRepoFileTree = async (
	token: string,
	owner: string,
	repo: string
): Promise<GithubTree> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const { default_branch: tree_sha } = await fetchGithubRepositoryByName(token, owner, repo);
	const pagesResponse = await gh.git.getTree({ owner, repo, tree_sha, recursive: 'true' });
	const data = pagesResponse.data;
	const tree = GithubTree.parse(data);
	return tree;
};
