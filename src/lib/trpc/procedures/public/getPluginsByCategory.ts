import { z } from 'zod';
import { t } from '../../t';
import * as NeovimPluginService from '$lib/server/prisma/neovimplugins/service';

export const getPluginsByCategory = t.procedure
  .input((input: unknown) => {
    return z.string().parse(input);
  })
  .query(async ({ input: category }) => {
    return NeovimPluginService.getPluginsByCategory(category);
  });
