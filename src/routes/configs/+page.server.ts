import { trpc } from '$lib/trpc/client';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const configs = await trpc(event).getConfigs.query();
	return {
		configs,
	};
};
