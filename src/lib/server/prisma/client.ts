import Prisma, * as PrismaScope from "@prisma/client";

const PrismaClient = Prisma?.PrismaClient || PrismaScope?.PrismaClient;

export const prismaClient = new PrismaClient();
