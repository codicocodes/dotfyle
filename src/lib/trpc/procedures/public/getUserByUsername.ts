import { z } from 'zod';
import { t } from '../../t';
import { TRPCError } from '@trpc/server';
import * as UserService from '$lib/server/prisma/users/service';

export const getUserByUsername = t.procedure
  .input((input: unknown) => {
    return z.string().parse(input);
  })
  .query(async ({ input: username }) => {
    return UserService.getUserByUsername(username).catch(() => {
      throw new TRPCError({
        message: 'user not found',
        code: 'NOT_FOUND'
      });
    });
  });
