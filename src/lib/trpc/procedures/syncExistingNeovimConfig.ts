import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { TRPCError } from '@trpc/server';
import { getConfigBySlug } from '$lib/server/prisma/neovimconfigs/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { syncExistingRepoInfo, syncReadme } from '$lib/server/nvim-sync/config/syncRepoInfo';
import { getNeovimConfigSyncer } from '$lib/server/nvim-sync/config/NeovimConfigSyncer';
import { hasBeenOneDay } from '$lib/utils';

export const syncExistingNeovimConfig = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z.object({ owner: z.string(), slug: z.string() }).parse(input);
  })
  .query(async ({ ctx, input }) => {
    const user = ctx.getAuthenticatedUser();
    const configBeforeSync = await getConfigBySlug(input.owner, input.slug);
    if (!hasBeenOneDay(configBeforeSync.lastSyncedAt.toString())) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    const token = await getGithubToken(user.id);
    const config = await syncExistingRepoInfo(token, configBeforeSync);
    await syncReadme(token, config);
    const syncer = await getNeovimConfigSyncer(user, config);
    return await syncer.treeSync();
  });
