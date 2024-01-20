import { daysAgo } from '$lib/utils';
import type { NeovimPlugin } from '@prisma/client';
import { prismaClient } from '../client';
import { paginator, type PaginatedResult } from '../pagination';
import type {
	NeovimPluginIdentifier,
	NeovimPluginWithCount,
	NestedNeovimPluginWithCount,
	PluginDTO
} from './schema';

function flattenConfigCount({
	_count,
	...plugin
}: NestedNeovimPluginWithCount): NeovimPluginWithCount {
	return {
		...plugin,
		configCount: _count.neovimConfigPlugins
	};
}

const orderByWeeklyAdded: [
	{
		addedLastWeek: 'desc';
	},
	{
		neovimConfigPlugins: {
			_count: 'desc';
		};
	},
	{
		stars: 'desc';
	},
	{
		name: 'asc';
	}
] = [
		{
			addedLastWeek: 'desc'
		},
		{
			neovimConfigPlugins: {
				_count: 'desc'
			}
		},
		{
			stars: 'desc'
		},
		{
			name: 'asc'
		}
	];

const orderByPopularity: [
	{
		_count: 'desc';
		neovimConfigPlugins: {};
	},
	{
		stars: 'desc';
	},
	{
		name: 'asc';
	}
] = [
		{
			neovimConfigPlugins: {
				_count: 'desc'
			}
		},
		{
			stars: 'desc'
		},
		{
			name: 'asc'
		}
	];

const orderByNew: [
	{
		createdAt: 'desc';
	},
	{
		neovimConfigPlugins: {
			_count: 'desc';
		};
	},
	{
		stars: 'desc';
	},
	{
		name: 'asc';
	}
] = [
		{
			createdAt: 'desc'
		},
		{
			neovimConfigPlugins: {
				_count: 'desc'
			}
		},
		{
			stars: 'desc'
		},
		{
			name: 'asc'
		}
	];

const orderByConfig = {
	popular: orderByPopularity,
	new: orderByNew,
	trending: orderByWeeklyAdded
} as const;

const selectConfigCount = {
	id: true,
	owner: true,
	name: true,
	type: true,
	source: true,
	category: true,
	link: true,
	shortDescription: true,
	createdAt: true,
	lastSyncedAt: true,
	stars: true,
	readme: false,
	addedLastWeek: true,
	dotfyleShieldAddedAt: true,
	media: {
		orderBy: {
			thumbnail: 'desc'
		}
	},
	_count: {
		select: {
			neovimConfigPlugins: true
		}
	}
} as const;

export async function getAllPlugins() {
	const nestedPluginData = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount
	});
	return nestedPluginData.map(flattenConfigCount);
}

export async function getPluginsWithDotfyleShield() {
	const nestedPluginData = await prismaClient.neovimPlugin.findMany({
		where: {
			dotfyleShieldAddedAt: {
				not: null
			}
		},
		select: selectConfigCount,
		orderBy: {
			dotfyleShieldAddedAt: 'desc'
		},
		take: 9
	});

	return nestedPluginData.map(flattenConfigCount);
}

export async function getPluginsWithMedia(
	query: string,
	category: string,
	sorting: 'new' | 'popular' | 'trending' = 'trending',
	page: number,
	take: number
) {
	const orderBy = orderByConfig[sorting];

	const args = {
		select: selectConfigCount,
		where: {
			category: {
				equals: category
			},
			media: {
				some: {
					type: {
						contains: ''
					}
				}
			},
			...parsePluginQuery(query ?? '')
		},
		orderBy
	};

	const { data: nestedPluginData, meta } = await paginator({
		perPage: take
	})<NestedNeovimPluginWithCount>(prismaClient.neovimPlugin, args, { page });

	await prismaClient.neovimPlugin.findMany({ ...args });

	const data = nestedPluginData.map(flattenConfigCount);

	return {
		meta,
		data
	};
}

function parsePluginQuery(query: string) {
	const mode = 'insensitive';
	const queries = query.split('/');
	return {
		...(query && queries
			? queries.length > 1
				? {
					AND: [
						{ owner: { contains: queries[0], mode } },
						{ name: { contains: queries[1], mode } }
					]
				}
				: {
					OR: [{ owner: { contains: query, mode } }, { name: { contains: query, mode } }]
				}
			: {})
	};
}

export async function searchPlugins(
	query: string | undefined = undefined,
	categories: string[] = [],
	sorting: 'new' | 'popular' | 'trending' = 'popular',
	page: number | undefined = undefined,
	take: number | undefined = undefined
): Promise<PaginatedResult<NeovimPluginWithCount>> {
	const where = {
		...(categories.length > 0
			? {
				category: {
					in: categories
				}
			}
			: {}),
		...parsePluginQuery(query ?? '')
	};

	const orderBy = orderByConfig[sorting];

	const args = {
		select: selectConfigCount,
		where,
		orderBy
	};

	const { data: nestedPluginData, meta } = await paginator({
		perPage: take
	})<NestedNeovimPluginWithCount>(prismaClient.neovimPlugin, args, { page });

	const data = nestedPluginData.map(flattenConfigCount);

	return {
		meta,
		data
	};
}

export async function getPluginsByCategory(category: string): Promise<NeovimPluginWithCount[]> {
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		where: {
			category
		},
		orderBy: orderByPopularity,
		take: 5
	});
	return plugins.map(flattenConfigCount);
}

export async function getPopularPlugins(): Promise<NeovimPluginWithCount[]> {
	const plugins: NestedNeovimPluginWithCount[] = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		orderBy: orderByPopularity,
		take: 3
	});
	return plugins.map(flattenConfigCount);
}

export async function getPlugin(owner: string, name: string): Promise<NeovimPluginWithCount> {
	const { _count, ...plugin } = await prismaClient.neovimPlugin.findUniqueOrThrow({
		select: selectConfigCount,
		where: {
			owner_name: {
				owner,
				name
			}
		}
	});
	return {
		...plugin,
		configCount: _count.neovimConfigPlugins
	};
}

export async function getReadme(owner: string, name: string): Promise<string> {
	const { readme } = await prismaClient.neovimPlugin.findUniqueOrThrow({
		select: { readme: true },
		where: {
			owner_name: {
				owner,
				name
			}
		}
	});
	return readme;
}

export async function getPluginsBySlug(username: string, slug: string) {
	const configPlugins = await prismaClient.neovimConfigPlugins.findMany({
		where: {
			config: {
				user: {
					username
				},
				slug
			}
		},
		select: {
			paths: true,
			plugin: {
				select: selectConfigCount
			}
		}
	});
	return configPlugins.map(({ plugin, ...configPlugin }) => ({
		...flattenConfigCount(plugin),
		paths: configPlugin.paths
	}));
}

export async function upsertNeovimPlugin(plugin: PluginDTO): Promise<NeovimPlugin> {
	const { shortDescription, ...update } = plugin;
	const savedPlugin = await prismaClient.neovimPlugin.upsert({
		where: {
			owner_name: {
				owner: plugin.owner,
				name: plugin.name
			}
		},
		create: plugin,
		update
	});
	return savedPlugin;
}

export async function upsertManyNeovimPlugins(plugins: PluginDTO[]): Promise<NeovimPlugin[]> {
	const savedPluginsPromise = plugins.map(async (p) => {
		return upsertNeovimPlugin(p);
	});
	return await Promise.all(savedPluginsPromise);
}

export async function getManyPlugins(ids: number[]): Promise<NeovimPlugin[]> {
	return prismaClient.neovimPlugin.findMany({
		where: {
			OR: ids.map((id) => ({ id }))
		}
	});
}

export async function getAllNeovimPluginNames(): Promise<NeovimPluginIdentifier[]> {
	return await prismaClient.neovimPlugin.findMany({
		select: {
			id: true,
			owner: true,
			name: true
		},
		orderBy: orderByPopularity
	});
}

export async function getAllPluginCategories(): Promise<string[]> {
	return await prismaClient.neovimPlugin
		.findMany({
			select: {
				category: true
			},
			distinct: 'category'
		})
		.then((res) => res.map(({ category }) => category));
}

export async function getAddedCountSince(since: Date): Promise<Record<number, number>> {
	const pluginMappings = await prismaClient.neovimConfigPlugins.findMany({
		where: {
			createdAt: {
				gt: since
			},
			config: {
				is: {
					createdAt: {
						lt: since
					}
				}
			}
		}
	});
	const countByPluginID = pluginMappings.reduce((counter: Record<number, number>, curr) => {
		if (!counter[curr.pluginId]) {
			counter[curr.pluginId] = 1;
		} else {
			counter[curr.pluginId]++;
		}
		return counter;
	}, {});
	return countByPluginID;
}

export async function syncWeeklyTrending() {
	const since = daysAgo(7);
	const countByPluginID = await getAddedCountSince(since);
	await prismaClient.neovimPlugin.updateMany({
		data: {
			addedLastWeek: 0
		}
	});
	return await Promise.all(
		Object.entries(countByPluginID).map(([pluginId, addedLastWeek]) => {
			const id = parseInt(pluginId, 10);
			return prismaClient.neovimPlugin.update({
				where: {
					id
				},
				data: {
					addedLastWeek
				}
			});
		})
	);
}

export async function updatePlugin(data: NeovimPlugin): Promise<NeovimPlugin> {
	return prismaClient.neovimPlugin.update({
		where: {
			id: data.id
		},
		data
	});
}

export async function getPluginsByAuthor(owner: string): Promise<NeovimPluginWithCount[]> {
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		where: { owner },
		orderBy: orderByPopularity
	});
	return plugins.map(flattenConfigCount);
}
