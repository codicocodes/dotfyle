import { z } from 'zod';
import { t } from '../../t';
import * as MediaService from '$lib/server/prisma/media/service';

export const getMediaForPlugin = t.procedure
  .input((input: unknown) => {
    return z.object({ owner: z.string(), name: z.string() }).parse(input);
  })
  .query(async ({ input: { owner, name } }) => {
    return MediaService.getMediaForPlugin(owner, name);
  });
