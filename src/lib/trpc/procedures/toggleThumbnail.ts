import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const toggleThumbnail = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z.object({ id: z.number() }).parse(input);
  })
  .mutation(async ({ input: { id } }) => {
    const media = await prismaClient.media.findUniqueOrThrow({ where: { id } });
    const thumbnail = !media.thumbnail;
    await prismaClient.media.update({ where: { id }, data: { thumbnail } });
  });
