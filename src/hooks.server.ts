import { createContext } from '$lib/trpc/context';
import { router, type Router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { TRPCError, inferRouterContext, ProcedureType } from '@trpc/server';
import { createTRPCHandle } from 'trpc-sveltekit';
import { dev } from '$app/environment';

console.log('Starting server: ', { dev });

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

export const profilePerformance: Handle = async ({ event, resolve }) => {
  const route = event.url.pathname;
  const qs = event.url.search;

  const start = performance.now();
  const response = await resolve(event);
  const end = performance.now();

  const responseTime = end - start;

  const prefixIcon = responseTime >= 1000 ? '🐢' : '🚀';

  console.log(`${prefixIcon} ${route}${qs} took ${responseTime.toFixed(2)} ms`);

  return response;
};

const handleTrpc = createTRPCHandle({
  router,
  createContext,
  onError
}) satisfies Handle;

export const handle = sequence(profilePerformance, handleTrpc);
