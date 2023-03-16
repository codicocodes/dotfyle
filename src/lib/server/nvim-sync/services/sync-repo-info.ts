import { fetchGithubRepositoryByName } from '$lib/server/github/api';
import type { GithubTree } from '$lib/server/github/schema';
import type { CreateNeovimConfigDTO } from '$lib/server/prisma/neovimconfigs/schema';
import { upsertNeovimConfig } from '$lib/server/prisma/neovimconfigs/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import type { NeovimConfig, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { InitFileNames } from './init-file-finder';

export async function syncRepoInfo(user: User, owner: string, repoName: string, root: string, init: InitFileNames): Promise<NeovimConfig> {
	const token = await getGithubToken(user.id);
	const repo = await fetchGithubRepositoryByName(token, owner, repoName);
	const upsertDTO: CreateNeovimConfigDTO = {
		githubId: repo.id,
		stars: repo.stargazers_count,
		owner,
		repo: repo.name,
		root: root,
		initFile: init,
    fork: repo.fork,
    branch: repo.default_branch,
	};
  const config = await upsertNeovimConfig(user.id, upsertDTO)
  return config
}

export function validateConfigPath(root: GithubTree, path: string): undefined {
	for (const node of root.tree) {
		if (node.path === path) {
			return;
		}
	}
	throw new TRPCError({ message: 'cannot find init file in repo', code: 'BAD_REQUEST' });
}
