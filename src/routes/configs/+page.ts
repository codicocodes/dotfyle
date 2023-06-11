import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const rawPluginIdentifiers = event.url.searchParams.get('plugins');
	const plugins = rawPluginIdentifiers === 'all' ? [] : rawPluginIdentifiers?.split(',').filter(Boolean);
	const configs = await trpc(event).getConfigs.query({ plugins });
	return {
		configs,
		plugins: await trpc(event)
			.getPluginIdentifiers.query()
			.then((names) => names.map((identifier) => `${identifier.owner}/${identifier.name}`))
	};
};
