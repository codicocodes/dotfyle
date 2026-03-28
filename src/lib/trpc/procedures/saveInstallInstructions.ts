import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { prismaClient } from '$lib/server/prisma/client';

export const saveInstallInstructions = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z
      .object({
        id: z.number(),
        pluginManager: z.string(),
        instructions: z.string()
      })
      .parse(input);
  })
  .mutation(async ({ input: { id, instructions, pluginManager } }) => {
    await prismaClient.neovimPluginInstallInstructions.upsert({
      where: {
        pluginId_pluginManager: {
          pluginId: id,
          pluginManager
        }
      },
      create: {
        pluginId: id,
        pluginManager,
        instructions
      },
      update: {
        instructions
      }
    });
  });
