import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const savePluginDescription = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z.object({ id: z.number(), description: z.string() }).parse(input);
  })
  .mutation(async ({ input: { id, description } }) => {
    await prismaClient.neovimPlugin.update({
      where: { id },
      data: { description }
    });
  });
