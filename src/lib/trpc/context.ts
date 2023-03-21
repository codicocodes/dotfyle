import { verifyToken } from '$lib/server/auth/services';
import { UserSchema } from '$lib/server/prisma/users/schema';
import type { User } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
  const user = verifyToken(event.cookies)
	return {
		user,
    event,
    getAuthenticatedUser(): User {
      const parsedUser = UserSchema.parse(this.user)
      return {
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt)
      }
    }
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
