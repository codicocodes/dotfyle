import { trpc } from '$lib/trpc/client';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const query = event.url.searchParams.get('q') ?? undefined;
	const rawPage = event.url.searchParams.get('page') ?? '';
	const page = parseInt(rawPage, 10);
	const sorting = (event.url.searchParams.get('sort') ?? 'popular') as 'new' | 'popular' | 'trending';
	const selectedCategories =
		event.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	const res = await trpc(event).searchPlugins.query({
		query,
		sorting,
		categories: selectedCategories,
		page: isNaN(page) ? 1 : page
	});

	const categories = await trpc(event).listPluginCategories.query();

	return {
		plugins: res.data,
		pagination: res.meta,
		categories
	};
};
