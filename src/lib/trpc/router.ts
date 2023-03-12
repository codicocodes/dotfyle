import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
export const t = initTRPC.context<Context>().create();

export const router = t.router({});

export type Router = typeof router;
