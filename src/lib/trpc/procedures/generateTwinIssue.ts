import { z } from 'zod';
import { isAdmin } from '../middlewares/auth';
import { t } from '../t';
import { TwinPostBuilder } from '$lib/server/twin/builder';

export const generateTwinIssue = t.procedure
  .use(isAdmin)
  .input((input: unknown) => {
    return z.object({ issue: z.number(), days: z.number().optional().default(7) }).parse(input);
  })
  .mutation(async ({ input: { issue, days } }) => {
    const twinBuilder = new TwinPostBuilder();
    await twinBuilder.validate(issue);
    return await twinBuilder.run(issue, days);
  });
