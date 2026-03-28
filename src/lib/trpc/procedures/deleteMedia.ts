import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const deleteMedia = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z.object({ id: z.number() }).parse(input);
  })
  .mutation(async ({ input: { id } }) => {
    await prismaClient.media.delete({ where: { id } });
  });
