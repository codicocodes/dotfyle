import { TRPCError } from '@trpc/server';
import { t } from '../t';

export const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
});
