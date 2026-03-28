import { z } from 'zod';
import { isAdmin } from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const publishTwinIssue = t.procedure
  .use(isAdmin)
  .input((input: unknown) => {
    return z.object({ issue: z.number() }).parse(input);
  })
  .mutation(async ({ input: { issue } }) => {
    return await prismaClient.twinPost.update({
      where: { issue },
      data: {
        publishedAt: new Date()
      }
    });
  });
