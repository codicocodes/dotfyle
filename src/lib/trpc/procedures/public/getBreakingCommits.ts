import { z } from 'zod';
import { t } from '../../t';
import { getBreakingChangesByPlugin } from '$lib/server/prisma/posts/services';

export const getBreakingCommits = t.procedure
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name } }) => {
    return getBreakingChangesByPlugin(owner, name, 3);
  });
