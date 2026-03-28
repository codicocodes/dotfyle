import { z } from 'zod';
import { t } from '../../t';
import { searchNeovimConfigs } from '$lib/server/prisma/neovimconfigs/service';

export const searchConfigs = t.procedure
  .input((input: unknown) => {
    return z
      .object({
        query: z.string().optional(),
        plugins: z.array(z.string()).optional(),
        languageServers: z.array(z.string()).optional(),
        sorting: z.enum(['top', 'new', 'plugins']),
        page: z.number().default(1),
        take: z.number().optional()
      })
      .parse(input);
  })
  .query(async ({ input: { query, plugins, sorting, page, take, languageServers } }) => {
    const configs = await searchNeovimConfigs({
      query,
      plugins,
      sorting,
      page,
      take,
      languageServers
    });
    return configs;
  });
