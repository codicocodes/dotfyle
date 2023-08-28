import * as Sentry from '@sentry/sveltekit';
import { createContext } from '$lib/trpc/context';
import { router, type Router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { TRPCError, inferRouterContext, ProcedureType } from '@trpc/server';
import { createTRPCHandle } from 'trpc-sveltekit';
import { env } from '$env/dynamic/private';
import { verifyToken } from '$lib/server/auth/services';
import { NODE_ENV } from '$env/static/private';
import { prismaClient } from '$lib/server/prisma/client';

console.log("Starting server: ", { NODE_ENV })

if (NODE_ENV === 'production') {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		tracesSampleRate: 0.01,
		environment: NODE_ENV,
		integrations: [new Sentry.Integrations.Prisma({ client: prismaClient })]
	});
}

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
	Sentry.withScope((scope) => {
		const user = verifyToken(event.cookies);
		scope.setUser({ id: user?.id ?? 'Anonymous' });
	});
	const route = event.url.pathname;

	const start = performance.now();
	const response = await resolve(event);
	const end = performance.now();

	const responseTime = end - start;

	const prefixIcon = responseTime >= 1000 ? '🐢' : '🚀'

	console.log(`${prefixIcon} ${route} took ${responseTime.toFixed(2)} ms`);

	return response;
};

const handleTrpc = createTRPCHandle({
	router,
	createContext,
	onError
}) satisfies Handle;

export const handle = sequence(Sentry.sentryHandle(), profilePerformance, handleTrpc);
