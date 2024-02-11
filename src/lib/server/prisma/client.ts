import { DATABASE_PRIVATE_URL } from '$env/static/private';
import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;

export const prismaClient = new PrismaClient({
	datasources: {
		db: {
			url: DATABASE_PRIVATE_URL
		}
	}
});

prismaClient.$on('beforeExit', async () => {
	console.log('beforeExit hook');
});
