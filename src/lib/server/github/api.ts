import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { GithubBlob, GithubRepository, GithubTree } from './schema';

export const fetchGitCommits = async (token: string, since: Date, owner: string, repo: string) => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const commitResponse = await gh.repos.listCommits({
		since: since.toString(),
		owner,
		repo
	});
	return commitResponse.data;
};

export const fetchGithubRepositories = async (
	username: string,
	token: string
): Promise<GithubRepository[]> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const reposData = await gh.paginate(gh.repos.listForUser, { username, per_page: 100 });
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
	repo: string,
	branch: string
): Promise<GithubTree> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const pagesResponse = await gh.git.getTree({
		owner,
		repo,
		tree_sha: branch,
		recursive: 'true'
	});
	const data = pagesResponse.data;
	const tree = GithubTree.parse(data);
	return tree;
};

export const fetchFile = async (
	token: string,
	owner: string,
	repo: string,
	file_sha: string
): Promise<GithubBlob> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const blobResponse = await gh.git.getBlob({ owner, repo, file_sha });
	return GithubBlob.parse(blobResponse.data);
};

export const fetchReadme = async (token: string, owner: string, repo: string): Promise<string> => {
	const gh = new Octokit({
		auth: `token ${token}`
	});
	const readmeResponse = await gh.repos.getReadme({ owner, repo });
	const readme = GithubBlob.parse(readmeResponse.data);
	const content = Buffer.from(readme.content, 'base64').toString();
	return content;
};

