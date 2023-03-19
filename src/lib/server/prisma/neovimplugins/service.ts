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

const orderByConfig = {
  popular: orderByPopularity,
  new: orderByPopularity,
} as const

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
	readme: true,
	_count: {
		select: {
			neovimConfigPlugins: true
		}
	}
};

export async function searchPlugins(
	query: string | undefined,
	category: string | undefined,
	sorting: 'new' | 'popular'
): Promise<NeovimPluginWithCount[]>{
	const where = {
		...(category ? { category } : {})
	};
  const orderBy = orderByConfig[sorting]
  const plugins = await prismaClient.neovimPlugin.findMany({
    select: selectConfigCount,
    where,
    orderBy,
  })
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
		orderBy: [
			{
				neovimConfigPlugins: {
					_count: 'desc'
				}
			},
			{
				name: 'asc'
			}
		],
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

export async function getPluginsBySlug(username: string, slug: string): Promise<NeovimPlugin[]> {
	return prismaClient.neovimPlugin.findMany({
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
}

export async function upsertManyNeovimPlugins(plugins: PluginDTO[]): Promise<NeovimPlugin[]> {
	const savedPluginsPromise = plugins.map(async (p) => {
		const savedPlugin = await prismaClient.neovimPlugin.upsert({
			where: {
				owner_name: {
					owner: p.owner,
					name: p.name
				}
			},
			create: p,
			update: p
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

export async function updatePlugin(plugin: NeovimPlugin): Promise<NeovimPlugin> {
	return prismaClient.neovimPlugin.update({
		where: {
			id: plugin.id
		},
		data: plugin
	});
}
