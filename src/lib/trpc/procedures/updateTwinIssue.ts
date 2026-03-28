import { z } from 'zod';
import { isAdmin } from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const updateTwinIssue = t.procedure
  .use(isAdmin)
  .input((input: unknown) => {
    return z.object({ issue: z.number(), title: z.string(), content: z.string() }).parse(input);
  })
  .mutation(async ({ input: { issue, title, content } }) => {
    return await prismaClient.twinPost.update({
      where: { issue },
      data: {
        content: content,
        title: title
      }
    });
  });
