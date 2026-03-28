import { z } from 'zod';
import { t } from '../../t';
import * as NeovimConfigService from '$lib/server/prisma/neovimconfigs/service';

export const getConfigsForPlugin = t.procedure
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name } }) => {
    return NeovimConfigService.getConfigsForPlugin(owner, name, 4);
  });
