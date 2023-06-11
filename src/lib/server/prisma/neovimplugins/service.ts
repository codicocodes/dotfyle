import { oneWeekAgo } from '$lib/utils';
import type { NeovimPlugin } from '@prisma/client';
import { prismaClient } from '../client';
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

const orderByPopularity: [
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
	new: orderByNew
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
	_count: {
		select: {
			neovimConfigPlugins: true
		}
	}
};

const selectWithReadme = {
	...selectConfigCount,
	readme: true
};

export async function searchPlugins(
	query: string | undefined = undefined,
	category: string | undefined = undefined,
	sorting: 'new' | 'popular' = 'popular',
	take: number | undefined = undefined
): Promise<NeovimPluginWithCount[]> {
	const where = {
		...(category ? { category } : {})
	};
	const orderBy = orderByConfig[sorting];
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		where,
		orderBy,
		take
	});
	return plugins.map(flattenConfigCount);
}

export async function getPluginsByCategory(category: string): Promise<NeovimPluginWithCount[]> {
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		where: {
			category
		},
		orderBy: orderByPopularity,
		take: 4
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
		select: selectWithReadme,
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

export async function getPluginsBySlug(
	username: string,
	slug: string
): Promise<NeovimPluginWithCount[]> {
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: selectConfigCount,
		where: {
			neovimConfigPlugins: {
				some: {
					config: {
						user: {
							username
						},
						slug
					}
				}
			}
		}
	});
	return plugins.map(flattenConfigCount);
}

export async function upsertManyNeovimPlugins(plugins: PluginDTO[]): Promise<NeovimPlugin[]> {
	const savedPluginsPromise = plugins.map(async (p) => {
		const { shortDescription, ...update } = p;
		const savedPlugin = await prismaClient.neovimPlugin.upsert({
			where: {
				owner_name: {
					owner: p.owner,
					name: p.name
				}
			},
			create: p,
			update
		});
		return savedPlugin;
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
		}
	});
}

export async function getAddedCountSince(since: Date): Promise<Record<number, number>> {
	const pluginMappings = await prismaClient.neovimConfigPlugins.findMany({
		where: {
			createdAt: {
				gt: since
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
	const since = oneWeekAgo();
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

export async function updatePlugin(plugin: NeovimPlugin): Promise<NeovimPlugin> {
	return prismaClient.neovimPlugin.update({
		where: {
			id: plugin.id
		},
		data: plugin
	});
}
