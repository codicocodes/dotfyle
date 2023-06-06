import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { TRPCError } from '@trpc/server';
import { createTRPCHandle } from 'trpc-sveltekit';

export const onError = (opts: any) => {
	const { error, type, path, input, ctx, req } = opts;
	if (error.code === 'INTERNAL_SERVER_ERROR') {
    console.log(error)
    error.message = 'Something went wrong'
	}
  delete error.stack
};

export const handle = createTRPCHandle({
	router,
	createContext,
	onError
}) satisfies Handle;
