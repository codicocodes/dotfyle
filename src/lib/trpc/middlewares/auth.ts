import { TRPCError } from '@trpc/server';
import { t } from '../t';
import { isAdmin as checkIsAdmin } from '../../utils';

export const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
});

export const isAdmin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  const isAdmin = checkIsAdmin(ctx.user);
  if (!isAdmin) throw new TRPCError({ code: 'FORBIDDEN' });
  return next();
});
