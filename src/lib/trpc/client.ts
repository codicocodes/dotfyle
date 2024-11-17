import type { Router } from '$lib/trpc/router';
import { httpBatchLink, httpLink, splitLink } from '@trpc/client';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init: TRPCClientInit) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const url = '/trpc';
  const client = createTRPCClient<Router>({
    links: [
      splitLink({
        condition(op) {
          // check for context property `skipBatch`
          return op.context.skipBatch === true;
        },
        true: httpLink({
          url:
            typeof window === 'undefined' ? `${init.url.origin}${url}` : `${location.origin}${url}`,
          fetch: typeof window === 'undefined' && init ? init.fetch : init?.fetch ?? window.fetch
        }),
        false: httpBatchLink({
          url:
            typeof window === 'undefined' ? `${init.url.origin}${url}` : `${location.origin}${url}`,
          fetch: typeof window === 'undefined' ? init.fetch : init?.fetch ?? window.fetch
        })
      })
    ]
  });
  if (isBrowser) browserClient = client;
  return client;
}
