import { verifyToken } from '$lib/server/auth/services';
import { UserSchema } from '$lib/server/prisma/users/schema';
import type { User } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export async function createContext(event: RequestEvent) {
  const user = verifyToken(event.cookies)
	return {
		user,
    event,
    getAuthenticatedUser(): User {
      const parsedUser = UserSchema.parse(this.user)
      return parsedUser 
    }
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
