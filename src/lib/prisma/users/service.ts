import type { User } from '@prisma/client';
import { prismaClient } from './../client';
import type { UserDTO } from './schema';

export async function upsertUser (userDTO: UserDTO): Promise<User> {
	return await prismaClient.user.upsert({
		where: { githubId: userDTO.githubId },
		create: userDTO,
		update: userDTO
	});
};
