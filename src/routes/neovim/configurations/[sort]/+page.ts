import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageLoad, PageLoadEvent } from './$types';

const getPage = (event: PageLoadEvent) => {
	const rawPage = event.url.searchParams.get('page') ?? '';
	const page = parseInt(rawPage, 10);
	return isNaN(page) ? 1 : page;
};

const getSorting = (event: PageLoadEvent) => {
	const { sort } = event.params;
	try {
		return z.enum(['top', 'new', 'plugins']).parse(sort);
	} catch {
		throw error(404);
	}
};

const content = {
	top: {
		title: 'Popular Neovim Configurations',
		description: 'The most popular Neovim configurations on Dotfyle',
		ogTitle: 'Popular Neovim Configurations',
		ogDescription: `List of the most popular Neovim configurations in ${new Date().getFullYear()}.`
	},
	new: {
		title: 'New Neovim Configurations',
		description: 'The newest Neovim configurations on Dotfyle',
		ogTitle: `New Neovim Configurations in ${new Date().getFullYear()}`,
		ogDescription: `List of the newest Neovim configurations in ${new Date().getFullYear()}.`
	},
	plugins: {
		title: 'Plugin Heavy Neovim Configurations',
		description: 'Neovim configurations with the most plugins installed on Dotfyle',
		ogTitle: 'Plugin Heavy Neovim Configurations',
		ogDescription:
			'Neovim configurations with the most plugins installed on Dotfyle. These configurations come with batteries included.'
	}
} as const;

function getLanguageServers(event: PageLoadEvent) {
	const rawLanguageServers = event.url.searchParams.get('languageservers');
	const languageServersFilter =
		rawLanguageServers === '' ? [] : rawLanguageServers?.split(',').filter(Boolean);
	return languageServersFilter;
}

function getPluginFilters(event: PageLoadEvent) {
	const rawPluginIdentifiers = event.url.searchParams.get('plugins');
	const pluginFilter =
		rawPluginIdentifiers === '' ? [] : rawPluginIdentifiers?.split(',').filter(Boolean);
	return pluginFilter;
}

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const query = event.url.searchParams.get('q') ?? undefined;

	const sorting = getSorting(event);

	const res = await trpc(event).searchConfigs.query({
		query,
		sorting: getSorting(event),
		plugins: getPluginFilters(event),
		languageServers: getLanguageServers(event),
		page: getPage(event)
	});

	return {
		configs: res.data,
		pagination: res.meta,
		filter: {
			plugins: trpc(event)
				.getPluginIdentifiers.query()
				.then((names) => names.map((identifier) => `${identifier.owner}/${identifier.name}`)),
			languageServers: trpc(event).listLanguageServers.query()
		},
		content: content[sorting],
		navigation: ['Top', 'New', 'Plugins'].map((label) => {
			const value = label.toLowerCase();
			return {
				label,
				value,
				path: `/neovim/configurations/${value}`
			};
		})
	};
};
