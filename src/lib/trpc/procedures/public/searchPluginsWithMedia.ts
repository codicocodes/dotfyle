import { z } from 'zod';
import { t } from '../../t';
import { getPluginsWithMedia } from '$lib/server/prisma/neovimplugins/service';

export const searchPluginsWithMedia = t.procedure
  .input((input: unknown) => {
    return z
      .object({
        query: z.string().optional(),
        category: z.string(),
        sorting: z.enum(['new', 'popular', 'trending']),
        page: z.number().default(1),
        take: z.number().max(25).default(10)
      })
      .parse(input);
  })
  .query(async ({ input }) => {
    const plugins = await getPluginsWithMedia(
      input.query || '',
      input.category,
      input.sorting,
      input.page,
      input.take
    );
    return plugins;
  });
