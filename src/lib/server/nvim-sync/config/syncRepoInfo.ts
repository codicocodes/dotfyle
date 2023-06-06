import { fetchGithubRepositoryByName } from '$lib/server/github/api';
import type { GithubRepository, GithubTree } from '$lib/server/github/schema';
import type { CreateNeovimConfigDTO } from '$lib/server/prisma/neovimconfigs/schema';
import { upsertNeovimConfig } from '$lib/server/prisma/neovimconfigs/service';
import { getGithubToken, getUserByUsername } from '$lib/server/prisma/users/service';
import type { NeovimConfig, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export async function syncInitialRepoInfo(
	user: User,
	owner: string,
	repoName: string,
	root: string,
	init: string
): Promise<NeovimConfig> {
	const token = await getGithubToken(user.id);
	const repo = await fetchGithubRepositoryByName(token, owner, repoName);
	const upsertDTO = upsertNeovimConfigDTOFactory(owner, root, init, repo);
	const configUser = user.username === owner ? user : await getUserByUsername(owner);
	return await upsertNeovimConfig(configUser.id, upsertDTO);
}

export async function syncExistingRepoInfo(token: string, config: NeovimConfig) {
	const repo = await fetchGithubRepositoryByName(token, config.owner, config.repo);
	const upsertDTO = upsertNeovimConfigDTOFactory(config.owner, config.root, config.initFile, repo);
	return upsertNeovimConfig(config.userId, upsertDTO);
}

export function validateConfigPath(root: GithubTree, path: string): undefined {
	for (const node of root.tree) {
		if (node.path === path) {
			return;
		}
	}
	throw new TRPCError({ message: 'cannot find init file in repo', code: 'BAD_REQUEST' });
}

export function upsertNeovimConfigDTOFactory(
	owner: string,
	root: string,
	init: string,
	repo: GithubRepository
) {
	const slug = `${repo.name}${root ? `-${root}` : ''}`
		.replaceAll('/', '-')
		.replaceAll(/[^A-Za-z-]/g, '')
		.toLowerCase();
	const upsertDTO: CreateNeovimConfigDTO = {
		githubId: repo.id,
		stars: repo.stargazers_count,
		slug,
		owner,
		repo: repo.name,
		root: root,
		initFile: init,
		fork: repo.fork,
		branch: repo.default_branch
	};
	return upsertDTO;
}
