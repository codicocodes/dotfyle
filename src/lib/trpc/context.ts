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
  user!.username = 'phaazon'
	return {
		user,
    event,
    getAuthenticatedUser(): User {
      return UserSchema.parse(this.user)
    }
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
