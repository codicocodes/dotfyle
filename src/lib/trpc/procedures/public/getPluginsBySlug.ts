import { z } from 'zod';
import { t } from '../../t';
import * as NeovimPluginService from '$lib/server/prisma/neovimplugins/service';

export const getPluginsBySlug = t.procedure
  .input((input: unknown) => {
    return z.object({ username: z.string(), slug: z.string() }).parse(input);
  })
  .query(async ({ input: { username, slug } }) => {
    return NeovimPluginService.getPluginsBySlug(username, slug);
  });
