import { ADMIN_GITHUB_ID } from '$lib/utils';
import type { User } from '@prisma/client';
import { prismaClient } from './../client';
import type { UpsertUserSchema } from './schema';

export async function upsertUser({ accessToken, ...userData }: UpsertUserSchema): Promise<User> {
  const { githubId } = userData;
  const create = {
    ...userData,
    githubToken: { create: { accessToken } }
  };
  const update = {
    ...userData,
    githubToken: {
      upsert: {
        update: { accessToken },
        create: { accessToken }
      }
    }
  };
  const user = await prismaClient.user.upsert({
    where: { githubId },
    create,
    update
  });
  return user;
}

export async function getAdminGithubToken() {
  const token = await prismaClient.githubToken.findFirstOrThrow({
    where: {
      user: {
        githubId: ADMIN_GITHUB_ID
      }
    }
  });
  return token.accessToken;
}

export async function getGithubToken(userId: number) {
  const token = await prismaClient.githubToken.findUniqueOrThrow({ where: { userId } });
  return token.accessToken;
}

export async function getUserByUsername(username: string): Promise<User> {
	const user = await prismaClient.user.findFirstOrThrow({
		where: {
      username:{
        equals: username,
        mode: "insensitive"
      }
		}
	});

	return user;
}
