import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageLoad, PageLoadEvent } from './$types';

const content = {
	new: {
		title: 'New Neovim Colorschemes',
		description: 'The newest Neovim colorschemes on Dotfyle',
		ogTitle: `New Neovim Colorschemes in ${new Date().getFullYear()}`,
		ogDescription: `List of the newest Neovim colorschemes in ${new Date().getFullYear()}.`
	},
	popular: {
		title: 'Top Neovim Colorschemes',
		description:
			'The most popular Neovim colorschemes ranked by total number of installs across 1000+ tracked Neovim configurations on Dotfyle',
		ogTitle: `Top Neovim Colorschemes in ${new Date().getFullYear()}`,
		ogDescription: `List of the most popular Neovim colorschemes by total number of installs across 1000+ tracked Neovim configurations on Dotfyle.`
	},
	trending: {
		title: 'Trending Neovim Colorschemes',
		description:
			'Trending Neovim colorschemes ranked by recent installations across 1000+ tracked Neovim configurations on Dotfyle',
		ogTitle: `Trending Neovim Colorschemes in ${new Date().getFullYear()}`,
		ogDescription: `List of trending Neovim plugins ranked by recent installations across 1000+ tracked Neovim configurations on Dotfyle.`
	}
} as const;

const getPage = (event: PageLoadEvent) => {
	const rawPage = event.url.searchParams.get('page') ?? '';
	const page = parseInt(rawPage, 10);
	return isNaN(page) ? 1 : page;
};

const getSorting = (event: PageLoadEvent) => {
	const { sort } = event.params;
	try {
		const sorting = z.enum(['new', 'top', 'popular', 'trending']).parse(sort);
		switch (sorting) {
			case 'top':
				return 'popular';
			default:
				return sorting;
		}
	} catch {
		throw error(404);
	}
};

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const query = event.url.searchParams.get('q') ?? undefined;
	const sorting = getSorting(event);
	const page = getPage(event);
	const res = await trpc(event).searchPluginsWithMedia.query({
		query,
		category: 'colorscheme',
		sorting,
		page,
		take: 25
	});
	return {
		plugins: res.data,
		pagination: res.meta,
		content: content[sorting],
		navigation: ['Trending', 'Top', 'New'].map((label) => {
			const value = label.toLowerCase();
			return {
				label,
				value,
				path: `/neovim/colorscheme/${value}`
			};
		})
	};
};
