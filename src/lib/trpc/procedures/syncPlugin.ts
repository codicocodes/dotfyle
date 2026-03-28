import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { getPluginSyncer } from '$lib/server/sync/plugins/sync';

export const syncPlugin = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .mutation(async ({ input: { owner, name }, ctx }) => {
    const user = ctx.getAuthenticatedUser();
    const syncer = await getPluginSyncer(user, owner, name);
    return syncer.sync();
  });
