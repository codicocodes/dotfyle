import { z } from 'zod';
import { t } from '../../t';
import { prismaClient } from '$lib/server/prisma/client';

export const getInstallInstructions = t.procedure
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name } }) => {
    return await prismaClient.neovimPluginInstallInstructions.findMany({
      where: {
        plugin: {
          owner,
          name
        }
      }
    });
  });
