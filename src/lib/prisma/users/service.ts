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
		update,
	});
	return user;
}
