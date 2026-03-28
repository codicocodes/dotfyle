import { z } from 'zod';
import { t } from '../../t';
import * as NeovimPluginService from '$lib/server/prisma/neovimplugins/service';

export const searchPlugins = t.procedure
  .input((input: unknown) => {
    return z
      .object({
        query: z.string().optional(),
        categories: z.array(z.string()).default([]),
        sorting: z.enum(['new', 'popular', 'trending']),
        page: z.number().default(1),
        take: z.number().max(10).optional()
      })
      .parse(input);
  })
  .query(async ({ input }) => {
    const plugins = await NeovimPluginService.searchPlugins(
      input.query,
      input.categories,
      input.sorting,
      input.page,
      input.take
    );
    return plugins;
  });
