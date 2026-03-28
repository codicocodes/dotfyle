import { z } from 'zod';
import { t } from '../../t';
import * as PostService from '$lib/server/prisma/posts/services';

export const getTwinByIssue = t.procedure
  .input((input: unknown) => {
    return z.object({ issue: z.number() }).parse(input);
  })
  .query(async ({ input: { issue } }) => {
    const post = await PostService.getTwinByIssue(issue);
    return post;
  });
