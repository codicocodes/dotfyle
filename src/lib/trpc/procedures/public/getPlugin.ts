import { z } from 'zod';
import { t } from '../../t';
import { TRPCError } from '@trpc/server';
import * as NeovimPluginService from '$lib/server/prisma/neovimplugins/service';

export const getPlugin = t.procedure
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name } }) => {
    return NeovimPluginService.getPlugin(owner, name).catch(() => {
      throw new TRPCError({ code: 'NOT_FOUND' });
    });
  });
