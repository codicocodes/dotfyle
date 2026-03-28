import { z } from 'zod';
import { t } from '../../t';
import * as PostService from '$lib/server/prisma/posts/services';

export const getTwinPosts = t.procedure
  .input((input: unknown) => {
    return z.object({ page: z.number(), perPage: z.number().max(10).optional() }).parse(input);
  })
  .query(async ({ input: { page, perPage } }) => {
    return PostService.getTwinPosts(page, perPage);
  });
