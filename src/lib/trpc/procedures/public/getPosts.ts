import { z } from 'zod';
import { t } from '../../t';
import * as PostService from '$lib/server/prisma/posts/services';

export const getPosts = t.procedure
  .input((input: unknown) => {
    return z.object({ type: z.enum(['breaking-change', 'twin']) }).parse(input);
  })
  .query(async ({ input: { type } }) => {
    return PostService.getPosts(type, 6);
  });
