import { z } from 'zod';
import { t } from '../../t';
import { TRPCError } from '@trpc/server';
import * as NeovimConfigService from '$lib/server/prisma/neovimconfigs/service';

export const getConfigBySlug = t.procedure
  .input((input: unknown) => {
    return z.object({ username: z.string(), slug: z.string() }).parse(input);
  })
  .query(async ({ input: { username, slug } }) => {
    return NeovimConfigService.getConfigBySlug(username, slug).catch((e) => {
      console.log(e);
      throw new TRPCError({
        message: 'config not found',
        code: 'NOT_FOUND'
      });
    });
  });
