import { createContext } from '$lib/trpc/context';
import { router, type Router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import type { TRPCError, inferRouterContext, ProcedureType } from '@trpc/server';
import { createTRPCHandle } from 'trpc-sveltekit';

export const onError = (opts: {
	ctx?: inferRouterContext<Router>;
	error: TRPCError;
	path: string;
	input: unknown;
	req: RequestInit;
	type: ProcedureType | 'unknown';
}) => {
	const { error } = opts;
	if (error.code === 'INTERNAL_SERVER_ERROR') {
		console.log(error);
		error.message = 'Something went wrong';
	}
	delete error.stack;
};

export const handle = createTRPCHandle({
	router,
	createContext,
	onError
}) satisfies Handle;
