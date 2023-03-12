import { t } from '$lib/trpc/router';
import { TRPCError } from '@trpc/server';

export const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
});
