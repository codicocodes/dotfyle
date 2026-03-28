import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { TRPCError } from '@trpc/server';
import { prismaClient } from '$lib/server/prisma/client';
import * as OpenAIService from '$lib/server/openai/api';

export const generateInstallInstructions = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z.object({ id: z.number(), pluginManager: z.string() }).parse(input);
  })
  .mutation(async ({ input: { id, pluginManager } }) => {
    const plugin = await prismaClient.neovimPlugin.findUniqueOrThrow({
      where: { id },
      select: { readme: true, owner: true, name: true }
    });
    if (!plugin.readme) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Plugin does not have readme'
      });
    }
    const instructions = await OpenAIService.generateInstallInstructions(
      plugin.owner,
      plugin.name,
      plugin.readme,
      pluginManager
    );
    return instructions;
  });
