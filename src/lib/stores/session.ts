import { writable } from 'svelte/store';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';

export const refetch = writable(true);
export const session = writable<{
	id: number;
	username: string;
	avatarUrl: string;
	githubId: number;
	createdAt: string;
} | null>(null);

if (browser) {
	refetch.subscribe((b) => {
		if (!b) return;
		session.set(null);
		invalidateAll();
	});
}

export default session;
