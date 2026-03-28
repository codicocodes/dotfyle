import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { TRPCError } from '@trpc/server';
import { prismaClient } from '$lib/server/prisma/client';
import * as OpenAIService from '$lib/server/openai/api';

export const generatePluginDescription = t.procedure
  .use(middlewares.isAuthenticated)
  .use(middlewares.isAdmin)
  .input((input: unknown) => {
    return z.object({ id: z.number() }).parse(input);
  })
  .mutation(async ({ input: { id } }) => {
    const plugin = await prismaClient.neovimPlugin.findUniqueOrThrow({
      where: { id },
      select: { readme: true, name: true }
    });
    if (!plugin.readme) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Plugin does not have readme'
      });
    }
    const description = await OpenAIService.generatePluginDescription(plugin.name, plugin.readme);
    return description;
  });
