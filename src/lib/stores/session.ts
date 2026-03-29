import { writable } from 'svelte/store';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';
import type { UserSchema } from '$lib/server/prisma/users/schema';

export type SessionUser = Omit<UserSchema, 'createdAt'> & { createdAt: string };

export const refetch = writable(true);
export const session = writable<{
  loading: boolean;
  user: SessionUser | null;
}>({ user: null, loading: true });

if (browser) {
  refetch.subscribe((b) => {
    if (!b) return;
    session.set({
      user: null,
      loading: true
    });
    invalidateAll();
  });
}

export default session;
