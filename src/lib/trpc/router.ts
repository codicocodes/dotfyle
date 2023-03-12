import { COOKIE_NAME, logout } from '$lib/auth/services';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
export const t = initTRPC.context<Context>().create();

export const router = t.router({
	getUser: t.procedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
});

export type Router = typeof router;
