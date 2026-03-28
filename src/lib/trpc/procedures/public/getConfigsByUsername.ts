import { z } from 'zod';
import { t } from '../../t';
import * as NeovimConfigService from '$lib/server/prisma/neovimconfigs/service';

export const getConfigsByUsername = t.procedure
  .input((input: unknown) => {
    return z.string().parse(input);
  })
  .query(async ({ input: username }) => {
    return NeovimConfigService.getConfigsByUsername(username);
  });
