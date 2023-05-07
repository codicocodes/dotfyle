import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const configs = await trpc(event).getConfigs.query();
	return {
		configs,
	};
};
