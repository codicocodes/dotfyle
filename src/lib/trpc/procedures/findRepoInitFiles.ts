import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { getRepoFileTree } from '$lib/server/github/services';
import { InitFileFinder } from '$lib/server/nvim-sync/config/InitFileFinder';

export const findRepoInitFiles = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z.object({ repo: z.string(), branch: z.string() }).parse(input);
  })
  .query(async ({ ctx, input }) => {
    const user = ctx.getAuthenticatedUser();
    const root = await getRepoFileTree(user, input.repo, input.branch);
    const initFiles = new InitFileFinder().findAllInitFile(root);
    return initFiles;
  });
