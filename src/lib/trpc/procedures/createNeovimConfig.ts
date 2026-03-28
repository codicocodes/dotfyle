import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { fetchRepoFileTree } from '$lib/server/github/api';
import {
  syncInitialRepoInfo,
  syncReadme,
  validateConfigPath
} from '$lib/server/nvim-sync/config/syncRepoInfo';
import { getNeovimConfigSyncer } from '$lib/server/nvim-sync/config/NeovimConfigSyncer';
import { InitFileNames } from '$lib/server/nvim-sync/config/InitFileFinder';

export const createNeovimConfig = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z
      .object({
        initFile: z.nativeEnum(InitFileNames),
        root: z.string(),
        repo: z.string(),
        branch: z.string()
      })
      .parse(input);
  })
  .mutation(async ({ ctx, input }) => {
    const user = ctx.getAuthenticatedUser();
    const token = await getGithubToken(user.id);
    const tree = await fetchRepoFileTree(token, user.username, input.repo, input.branch);
    validateConfigPath(tree, input.root ? `${input.root}/${input.initFile}` : input.initFile);
    const config = await syncInitialRepoInfo(
      user,
      user.username,
      input.repo,
      input.root,
      input.initFile
    );
    await syncReadme(token, config);
    const syncer = await getNeovimConfigSyncer(user, config);
    return await syncer.treeSync();
  });
