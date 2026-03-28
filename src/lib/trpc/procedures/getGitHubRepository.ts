import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { TRPCError } from '@trpc/server';
import { getGithubRepository } from '$lib/server/github/services';

export const getGitHubRepository = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name }, ctx }) => {
    const repository = await getGithubRepository(ctx.user!.id, owner, name).catch(() => {
      throw new TRPCError({ code: 'NOT_FOUND' });
    });
    return repository;
  });
