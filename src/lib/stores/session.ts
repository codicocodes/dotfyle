import { writable } from 'svelte/store';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';

export const refetch = writable(true);
export const session = writable<{
	loading: boolean;
	user: {
		id: number;
		username: string;
		avatarUrl: string;
		githubId: number;
		createdAt: string;
	} | null;
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
