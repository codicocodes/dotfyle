import { createContext } from '$lib/trpc/context';
import { router, type Router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
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

export const printPageVisits: Handle = ({ event, resolve }) => {
  const search = event.url.searchParams.toString()
  const path = event.url.pathname;
  const page = path + (search ? `?${search}` : "")
  if (!page.includes('trpc') && !page.includes('api')) {
    console.log({ page })
  }
  return resolve(event)
};

const handleTrpc = createTRPCHandle({
	router,
	createContext,
	onError
}) satisfies Handle

export const handle = sequence(printPageVisits, handleTrpc);
