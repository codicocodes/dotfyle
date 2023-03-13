import { verifyToken } from '$lib/auth/services';
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
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
