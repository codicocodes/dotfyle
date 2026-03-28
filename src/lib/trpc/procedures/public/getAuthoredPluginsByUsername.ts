import { z } from 'zod';
import { t } from '../../t';
import { getPluginsByAuthor } from '$lib/server/prisma/neovimplugins/service';

export const getAuthoredPluginsByUsername = t.procedure
  .input((input: unknown) => {
    return z.string().parse(input);
  })
  .query(async ({ input: username }) => {
    return getPluginsByAuthor(username);
  });
