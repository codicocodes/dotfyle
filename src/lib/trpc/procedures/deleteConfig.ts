import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { deleteNeovimConfig } from '$lib/server/prisma/neovimconfigs/service';

export const deleteConfig = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    return z.object({ id: z.number() }).parse(input);
  })
  .mutation(async ({ input: { id }, ctx }) => {
    const user = ctx.getAuthenticatedUser();
    return await deleteNeovimConfig(id, user.id);
  });
