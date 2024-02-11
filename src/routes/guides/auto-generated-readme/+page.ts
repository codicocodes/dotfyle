import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	return {
		loading: {
			configs: trpc(event).recentConfigsWithDotfyleShields.query()
		}
	};
};
