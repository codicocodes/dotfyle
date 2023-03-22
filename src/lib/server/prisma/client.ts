import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;

export const prismaClient = new PrismaClient();
