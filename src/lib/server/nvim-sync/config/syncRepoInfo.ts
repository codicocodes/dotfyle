import { fetchGithubRepositoryByName, fetchReadme } from '$lib/server/github/api';

export class RepoTransferredError extends Error {
  constructor(public configId: number) {
    super('Repo has been transferred to a different dotfyle user');
  }
}
import type { GithubRepository, GithubTree } from '$lib/server/github/schema';
import { prismaClient } from '$lib/server/prisma/client';
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

export async function syncReadme(token: string, config: NeovimConfig) {
  const readme = await fetchReadme(token, config.owner, config.repo).catch(() => '');

  const shields = ['leaderkey', 'plugins', 'plugin-manager'].map((shield) => {
    return `https://dotfyle.com/${config.owner}/${config.slug}/badges/${shield}`;
  });

  const hasShield = shields.filter((s) => readme.includes(s)).length > 0;

  if (!config.dotfyleShieldAddedAt && hasShield) {
    await prismaClient.neovimConfig.updateMany({
      where: { id: config.id },
      data: { dotfyleShieldAddedAt: new Date() }
    });
  }

  if (config.dotfyleShieldAddedAt && !hasShield) {
    await prismaClient.neovimConfig.updateMany({
      where: { id: config.id },
      data: { dotfyleShieldAddedAt: null }
    });
  }
}

export async function syncExistingRepoInfo(token: string, config: NeovimConfig) {
  const repo = await fetchGithubRepositoryByName(token, config.owner, config.repo);
  const ownerChanged = repo.owner.login !== config.owner;
  const nameChanged = repo.name !== config.repo;
  if (ownerChanged || nameChanged) {
    if (ownerChanged) {
      const newOwnerUser = await prismaClient.user.findUnique({
        where: { username: repo.owner.login }
      });
      const isRename = !newOwnerUser || newOwnerUser.id === config.userId;
      if (isRename) {
        console.log(
          `[SYNC_CONFIGS] [WARNING] Redirected ${config.owner}/${config.repo} -> ${repo.owner.login}/${repo.name}. Updating data.`
        );
        await prismaClient.user.update({
          where: { id: config.userId },
          data: {
            username: repo.owner.login,
            neovimConfigs: {
              updateMany: {
                where: { owner: config.owner },
                data: { owner: repo.owner.login }
              }
            }
          }
        });
      } else {
        console.log(
          `[SYNC_CONFIGS] [WARNING] ${config.owner}/${config.repo} owner changed to ${repo.owner.login} who is a different dotfyle user — skipping sync`
        );
        throw new RepoTransferredError(config.id);
      }
    }
    if (nameChanged) {
      const existingWithNewName = await prismaClient.neovimConfig.findUnique({
        where: {
          owner_repo_root: { owner: repo.owner.login, repo: repo.name, root: config.root }
        }
      });
      if (existingWithNewName) {
        console.log(
          `[SYNC_CONFIGS] [WARNING] ${config.owner}/${config.repo} -> ${repo.name} — stale duplicate, deleting`
        );
        await prismaClient.neovimConfig.delete({ where: { id: config.id } });
        return existingWithNewName;
      }
      await prismaClient.neovimConfig.updateMany({
        where: { id: config.id },
        data: { repo: repo.name }
      });
    }
  }
  const upsertDTO = upsertNeovimConfigDTOFactory(
    repo.owner.login,
    config.root,
    config.initFile,
    repo
  );
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
