import type { User } from '@prisma/client';
import { getGithubToken } from '../prisma/users/service';
import { fetchGithubRepositories, fetchRepoFileTree } from './api';

export async function getGithubRepositories(user: User) {
  const token = await getGithubToken(user.id)
  const repositories = await fetchGithubRepositories(user.username, token)
  return repositories
}

export async function getRepoFileTree(user: User, repo: string, branch: string) {
  const token = await getGithubToken(user.id)
  const tree = await fetchRepoFileTree(token, user.username, repo, branch)
  return tree
}
