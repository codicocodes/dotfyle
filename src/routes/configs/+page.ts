import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const query = event.url.searchParams.get('q') ?? undefined;
	const rawPage = event.url.searchParams.get('page') ?? '';
	const page = parseInt(rawPage, 10);
	const sorting = (event.url.searchParams.get('sort') ?? 'stars') as 'new' | 'stars' | 'plugins';

	const rawPluginIdentifiers = event.url.searchParams.get('plugins');
	const pluginFilter =
		rawPluginIdentifiers === '' ? [] : rawPluginIdentifiers?.split(',').filter(Boolean);

	const rawLanguageServers = event.url.searchParams.get('languageservers');

	const languageServersFilter =
		rawLanguageServers === '' ? [] : rawLanguageServers?.split(',').filter(Boolean);

	const res = await trpc(event).searchConfigs.query({
		query,
		sorting,
		plugins: pluginFilter,
		languageServers: languageServersFilter,
		page: isNaN(page) ? 1 : page
	});

	return {
		configs: res.data,
		pagination: res.meta,
		filter: {
			plugins: trpc(event)
				.getPluginIdentifiers.query()
				.then((names) => names.map((identifier) => `${identifier.owner}/${identifier.name}`)),
			languageServers: trpc(event).listLanguageServers.query()
		}
	};
};
