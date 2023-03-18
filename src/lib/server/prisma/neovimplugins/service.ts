import type { NeovimPlugin } from '@prisma/client';
import { prismaClient } from '../client';
import type { NeovimPluginIdentifier, PluginDTO } from './schema';

export async function getPopularPlugins() {
	const plugins = await prismaClient.neovimPlugin.findMany({
		select: {
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
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		orderBy: [
			{
				neovimConfigPlugins: {
					_count: 'desc'
				}
			},
			{
        name: 'asc',
			}
		],
    take: 9,
	});
	return plugins;
}

export async function getPlugin(owner: string, name: string) {
	return prismaClient.neovimPlugin.findUniqueOrThrow({
		where: {
			owner_name: {
				owner,
				name
			}
		}
	});
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
