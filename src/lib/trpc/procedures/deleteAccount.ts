import { TRPCError } from '@trpc/server';
import { logout } from '$lib/server/auth/services';
import { deleteUser } from '$lib/server/prisma/users/service';
import { isAdmin } from '$lib/utils';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';

export const deleteAccount = t.procedure
  .use(middlewares.isAuthenticated)
  .mutation(async ({ ctx }) => {
    const user = ctx.getAuthenticatedUser();
    if (isAdmin(user)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin account cannot be deleted' });
    }
    await deleteUser(user.id);
    logout(ctx.event.cookies);
  });
