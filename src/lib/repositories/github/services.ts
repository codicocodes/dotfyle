import type { User } from '@prisma/client';
import { getGithubToken } from '../../prisma/users/service';
import { fetchGithubRepositories } from './api';

export async function getGithubRepositories(user: User) {
  const token = await getGithubToken(user.id)
  const repositories = await fetchGithubRepositories(user.username, token)
  return repositories
}
